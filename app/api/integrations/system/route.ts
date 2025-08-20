import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

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

    const body = await request.json();
    const { userId, integrationKey, enabled } = body;

    // Verify the user can only update their own system integrations
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update system integration setting
    const { error: updateError } = await supabase
      .from('system_integrations')
      .upsert({
        user_id: userId,
        [integrationKey]: enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating system integration:', updateError);
      return NextResponse.json(
        { error: 'Failed to update system integration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `System integration ${integrationKey} ${enabled ? 'enabled' : 'disabled'}`
    });

  } catch (error) {
    console.error('System integration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}