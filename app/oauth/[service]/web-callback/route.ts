import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';
import { sendCompletionMessageAsync } from '@/app/lib/integrations/completion-logic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  try {
    const { service } = await params;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log(`OAuth callback received for service: ${service}`, {
      hasCode: !!code,
      hasState: !!state,
      hasError: !!error
    });

    // Check for OAuth errors
    if (error) {
      console.error(`OAuth error for ${service}:`, error, errorDescription);
      return NextResponse.redirect(
        new URL(`/integrations?error=${encodeURIComponent(error)}&service=${service}`, request.url)
      );
    }

    // Validate required parameters
    if (!code) {
      console.error(`No authorization code received for ${service}`);
      return NextResponse.redirect(
        new URL(`/integrations?error=no_code&service=${service}`, request.url)
      );
    }

    // Get authenticated user
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated for OAuth callback');
      return NextResponse.redirect(
        new URL('/login?error=not_authenticated', request.url)
      );
    }

    // Handle OAuth callback
    console.log('🔍 [web-callback] Creating IntegrationService with supabase client');
    const integrationService = new IntegrationService(supabase);
    
    console.log('🔍 [web-callback] Calling handleOAuthCallback with:', {
      service,
      hasCode: !!code,
      hasState: !!state,
      hasSupabase: !!supabase
    });
    
    const result = await integrationService.handleOAuthCallback(service, code, state || undefined, supabase);

    console.log('🔍 [web-callback] handleOAuthCallback result:', {
      success: result.success,
      error: result.error,
      hasIntegration: !!result.integration
    });

    if (!result.success) {
      console.error(`🔍 [web-callback] Integration failed for ${service}:`, result.error);
      console.error('🔍 [web-callback] Full error details:', JSON.stringify(result, null, 2));
      return NextResponse.redirect(
        new URL(`/integrations?error=${encodeURIComponent(result.error || 'integration_failed')}&service=${service}`, request.url)
      );
    }

    console.log(`Integration successful for ${service}, determining redirect destination`);

    // Check if this is a reconnection by looking for reconnect parameter in state
    const isReconnection = state && state.includes('reconnect=true');
    
    if (isReconnection) {
      console.log(`Reconnection flow detected for ${service}, redirecting to integrations`);
      // Redirect back to integrations page for reconnections
      const integrationsUrl = new URL('/integrations', request.url);
      integrationsUrl.searchParams.set('reconnected', service);
      return NextResponse.redirect(integrationsUrl);
    } else {
      console.log(`New connection flow detected for ${service}, sending async completion request`);
      // Fire-and-forget: send completion request without blocking
      sendCompletionMessageAsync(service, user.id, supabase).catch(err => {
        console.error('Async completion request failed:', err);
      });

      // Redirect back to integrations page
      const integrationsUrl = new URL('/integrations', request.url);
      integrationsUrl.searchParams.set('connected', service);
      return NextResponse.redirect(integrationsUrl);
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/integrations?error=callback_error&service=${params.service}`, request.url)
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}