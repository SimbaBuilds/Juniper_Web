import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { getOAuthConfig } from '@/app/lib/integrations/oauth/OAuthConfig';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  scope?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { serviceName, code, state } = await request.json();

    if (!serviceName || !code) {
      return NextResponse.json(
        { success: false, error: 'Service name and code are required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const config = getOAuthConfig(serviceName);
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'OAuth configuration not found for service' },
        { status: 404 }
      );
    }

    // Prepare token exchange request
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', config.clientId);
    body.append('code', code);
    body.append('redirect_uri', config.redirectUri);

    if (config.clientSecret) {
      body.append('client_secret', config.clientSecret);
    }

    // Handle PKCE if needed (get code_verifier from state storage)
    if (config.usePKCE) {
      // In a real implementation, you'd need to store the code_verifier server-side
      // For now, we'll require it to be passed from the client
      // This is a temporary solution - ideally store code_verifier in server session
      console.warn('PKCE implementation needs server-side code_verifier storage');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Handle Basic Auth if required
    if (config.useBasicAuth && config.clientSecret) {
      const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // Add custom headers if specified
    if (config.customHeaders) {
      Object.assign(headers, config.customHeaders);
    }

    // Exchange code for tokens
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers,
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Token exchange failed for ${serviceName}:`, errorText);
      return NextResponse.json(
        { success: false, error: `Token exchange failed: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const tokens: TokenData = await response.json();

    // Calculate expires_at if not provided
    if (tokens.expires_in && !tokens.expires_at) {
      tokens.expires_at = Date.now() / 1000 + tokens.expires_in;
    }

    // Create/update integration in database
    const integrationService = new IntegrationService(supabase);
    const integrationResult = await integrationService.createOrUpdateIntegration(
      user.id,
      serviceName,
      tokens
    );

    if (!integrationResult.success) {
      return NextResponse.json(
        { success: false, error: integrationResult.error },
        { status: 500 }
      );
    }

    // Note: Health data sync is triggered in IntegrationService.exchangeOAuthCode()
    // This route is only used as a fallback when no supabase client is provided
    // The web-callback route always provides the supabase client, so this code path is not used

    return NextResponse.json({
      success: true,
      integration: integrationResult.integration
    });

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}