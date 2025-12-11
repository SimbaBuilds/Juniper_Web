import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

// GET - Fetch automation records for the user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query the automation_records table in the automations schema
    const { data: automations, error } = await supabase
      .schema('automations')
      .from('automation_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching automations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch automations' },
        { status: 500 }
      );
    }

    // Parse JSON fields
    const parsedAutomations = (automations || []).map(automation => ({
      ...automation,
      trigger_config: typeof automation.trigger_config === 'string'
        ? JSON.parse(automation.trigger_config)
        : automation.trigger_config,
      actions: typeof automation.actions === 'string'
        ? JSON.parse(automation.actions)
        : automation.actions,
      execution_params: typeof automation.execution_params === 'string'
        ? JSON.parse(automation.execution_params)
        : automation.execution_params,
      variables: typeof automation.variables === 'string'
        ? JSON.parse(automation.variables)
        : automation.variables,
    }));

    return NextResponse.json({ automations: parsedAutomations });

  } catch (error) {
    console.error('Error fetching automations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update automation (toggle active, update config)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { automation_id, updates } = await request.json();

    if (!automation_id) {
      return NextResponse.json({ error: 'automation_id is required' }, { status: 400 });
    }

    // Validate that the automation belongs to this user
    const { data: existing, error: fetchError } = await supabase
      .schema('automations')
      .from('automation_records')
      .select('id, user_id')
      .eq('id', automation_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    // Prepare update payload - only allow certain fields to be updated
    const allowedFields = ['active', 'name', 'description', 'trigger_config', 'actions', 'variables'];
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        // Stringify JSON fields if they're objects
        if (['trigger_config', 'actions', 'variables'].includes(field) && typeof updates[field] === 'object') {
          updatePayload[field] = JSON.stringify(updates[field]);
        } else {
          updatePayload[field] = updates[field];
        }
      }
    }

    // Update the automation
    const { data: updated, error: updateError } = await supabase
      .schema('automations')
      .from('automation_records')
      .update(updatePayload)
      .eq('id', automation_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating automation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update automation' },
        { status: 500 }
      );
    }

    // Parse JSON fields in response
    const parsedAutomation = {
      ...updated,
      trigger_config: typeof updated.trigger_config === 'string'
        ? JSON.parse(updated.trigger_config)
        : updated.trigger_config,
      actions: typeof updated.actions === 'string'
        ? JSON.parse(updated.actions)
        : updated.actions,
      execution_params: typeof updated.execution_params === 'string'
        ? JSON.parse(updated.execution_params)
        : updated.execution_params,
      variables: typeof updated.variables === 'string'
        ? JSON.parse(updated.variables)
        : updated.variables,
    };

    return NextResponse.json({
      success: true,
      automation: parsedAutomation
    });

  } catch (error) {
    console.error('Error updating automation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
