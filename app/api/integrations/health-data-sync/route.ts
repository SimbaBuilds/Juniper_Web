import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, user_id, service_name, days } = await request.json();

    // Validate that the user_id matches the authenticated user
    if (user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log(`Health data sync request: ${action} for ${service_name} (${days} days)`);

    // Call the Supabase edge function for health data sync
    const edgeResponse = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/health-data-sync`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action,
          user_id,
          service_name,
          days
        }),
      }
    );

    if (!edgeResponse.ok) {
      const errorText = await edgeResponse.text();
      console.error('Edge function call failed:', errorText);
      return NextResponse.json(
        { error: 'Health data sync failed' },
        { status: edgeResponse.status }
      );
    }

    const result = await edgeResponse.json();
    console.log('Health data sync completed:', result);

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error('Error in health data sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}