import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { sendCompletionMessageDirect } from '@/app/lib/integrations/completion-logic';

interface CompletionRequest {
  service_name: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is designed for client-side calls that need HTTP authentication
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('Integration completion - authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CompletionRequest = await request.json();
    const { service_name, user_id } = body;

    if (!service_name || !user_id) {
      return NextResponse.json(
        { error: 'service_name and user_id are required' },
        { status: 400 }
      );
    }

    // Verify the user_id matches the authenticated user
    if (user_id !== user.id) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 403 }
      );
    }

    // Use the shared completion logic
    const result = await sendCompletionMessageDirect(service_name, user_id, supabase);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send integration completion message' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Integration completion endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to send integration completion message' },
      { status: 500 }
    );
  }
}