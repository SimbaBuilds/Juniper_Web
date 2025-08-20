import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

interface SystemIntegrationRequest {
  userId: string;
  integrationKey: string;
  enabled: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, integrationKey, enabled }: SystemIntegrationRequest = await request.json();

    if (!userId || !integrationKey || enabled === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, integrationKey, enabled' },
        { status: 400 }
      );
    }

    // Verify the user can only update their own system integrations
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('enabled_system_integrations')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Get current system integrations or set defaults
    const currentIntegrations = profile?.enabled_system_integrations || {
      perplexity: true,
      textbelt: true,
      xai_live_search: true
    };

    // Update the specific integration
    const updatedIntegrations = {
      ...currentIntegrations,
      [integrationKey]: enabled
    };

    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ enabled_system_integrations: updatedIntegrations })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating system integrations:', updateError);
      return NextResponse.json(
        { error: 'Failed to update system integrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enabled_system_integrations: updatedIntegrations
    });

  } catch (error) {
    console.error('System integration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Verify the user can only access their own system integrations
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('enabled_system_integrations')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    // Return system integrations or defaults
    const systemIntegrations = profile?.enabled_system_integrations || {
      perplexity: true,
      textbelt: true,
      xai_live_search: true
    };

    return NextResponse.json({
      success: true,
      enabled_system_integrations: systemIntegrations
    });

  } catch (error) {
    console.error('System integration GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}