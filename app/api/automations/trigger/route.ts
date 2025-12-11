import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

// POST - Manually trigger an automation via the script-executor edge function
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { automation_id, trigger_data = {} } = await request.json();

    if (!automation_id) {
      return NextResponse.json({ error: 'automation_id is required' }, { status: 400 });
    }

    // Verify the automation exists and belongs to this user
    const { data: automation, error: fetchError } = await supabase
      .schema('automations')
      .from('automation_records')
      .select('id, user_id, name, active')
      .eq('id', automation_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    // Get user's session token to authenticate with edge function
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json({ error: 'Failed to get session' }, { status: 401 });
    }

    // Call the script-executor edge function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 });
    }

    const executorUrl = `${supabaseUrl}/functions/v1/script-executor/manual`;

    const manualTriggerData = {
      trigger_type: 'manual',
      triggered_at: new Date().toISOString(),
      triggered_by: 'web_ui',
      ...trigger_data
    };

    console.log(`Triggering automation ${automation_id} (${automation.name}) via script-executor`);

    const response = await fetch(executorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        automation_id,
        trigger_data: manualTriggerData,
        test_mode: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Script executor error: ${response.status} - ${errorText}`);

      // Try to parse error response
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.error || errorJson.message || 'Execution failed' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: `Execution failed: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const result = await response.json();
    console.log(`Automation ${automation_id} executed successfully:`, result.execution_id);

    return NextResponse.json({
      success: true,
      execution_id: result.execution_id || result.data?.execution_id,
      result: result.data || result
    });

  } catch (error) {
    console.error('Error triggering automation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
