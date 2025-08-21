import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';

interface TextbeltCredentials {
  phone_number: string;
}

export async function POST(request: NextRequest) {
  try {
    const { phone_number, userId } = await request.json();

    if (!phone_number || !userId) {
      return NextResponse.json(
        { success: false, error: 'Phone number and user ID are required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Validate and clean phone number
    const cleanedPhoneNumber = phone_number.replace(/[^\d]/g, '');
    if (cleanedPhoneNumber.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      );
    }

    const credentials: TextbeltCredentials = {
      phone_number: cleanedPhoneNumber
    };

    // Create token-like structure for Textbelt (following React Native pattern)
    const tokens = {
      phone_number: cleanedPhoneNumber, // Store as "tokens" for compatibility
      access_token: 'textbelt-api-key', // Placeholder since it's API key based
      refresh_token: null,
      expires_at: null,
      scope: null
    };

    // Use the same integration service as other services
    const integrationService = new IntegrationService(supabase);
    const integrationResult = await integrationService.createOrUpdateIntegration(
      user.id,
      'textbelt', // Use lowercase service name
      tokens,
      credentials, // Store phone number in configuration field
      {} // No additional fields needed for Textbelt
    );

    if (!integrationResult.success) {
      return NextResponse.json(
        { success: false, error: integrationResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      integration: integrationResult.integration
    });

  } catch (error) {
    console.error('Textbelt credential storage error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}