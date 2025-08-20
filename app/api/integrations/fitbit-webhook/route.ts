import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, user_id, collection } = await request.json();

    // Validate that the user_id matches the authenticated user
    if (user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log(`Fitbit webhook request: ${action} for ${collection} collection`);

    // Call the Supabase edge function for Fitbit webhook management
    const webhookUrl = `${process.env.SUPABASE_URL}/functions/v1/webhook-handler/fitbit/${user_id}`;
    
    const edgeResponse = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/fitbit-webhook-manager`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action,
          user_id,
          collection,
          webhook_url: webhookUrl
        }),
      }
    );

    if (!edgeResponse.ok) {
      const errorText = await edgeResponse.text();
      console.error('Fitbit webhook edge function call failed:', errorText);
      return NextResponse.json(
        { error: 'Fitbit webhook setup failed' },
        { status: edgeResponse.status }
      );
    }

    const result = await edgeResponse.json();
    console.log('Fitbit webhook setup completed:', result);

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error('Error in Fitbit webhook setup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}