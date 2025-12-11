import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

// GET - Fetch execution logs for an automation
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const automationId = searchParams.get('automation_id');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query for execution logs
    let query = supabase
      .schema('automations')
      .from('automation_execution_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by automation if specified
    if (automationId) {
      query = query.eq('automation_id', automationId);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching execution logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch execution logs' },
        { status: 500 }
      );
    }

    // Parse JSON fields in logs
    const parsedLogs = (logs || []).map(log => ({
      ...log,
      trigger_data: typeof log.trigger_data === 'string'
        ? JSON.parse(log.trigger_data)
        : log.trigger_data,
      action_results: typeof log.action_results === 'string'
        ? JSON.parse(log.action_results)
        : log.action_results,
    }));

    return NextResponse.json({
      logs: parsedLogs,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    });

  } catch (error) {
    console.error('Error fetching execution logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
