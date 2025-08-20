import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';
import { IntegrationCompletionService } from '@/app/lib/integrations/IntegrationCompletionService';

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const { service } = params;
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
    const integrationService = new IntegrationService();
    const result = await integrationService.handleOAuthCallback(service, code, state || undefined);

    if (!result.success) {
      console.error(`Integration failed for ${service}:`, result.error);
      return NextResponse.redirect(
        new URL(`/integrations?error=${encodeURIComponent(result.error || 'integration_failed')}&service=${service}`, request.url)
      );
    }

    console.log(`Integration successful for ${service}, sending completion message`);

    // Send completion message to chat
    const completionSuccess = await IntegrationCompletionService.sendCompletionMessage(service, user.id);
    
    if (!completionSuccess) {
      console.warn('Failed to send completion message, but integration was successful');
    }

    // Redirect to chat page for completion
    return NextResponse.redirect(new URL('/chat', request.url));

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