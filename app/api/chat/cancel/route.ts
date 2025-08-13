import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';
import { serverRequestService } from '@/lib/services/requestService';

interface CancelRequest {
  request_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createSupabaseAppServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CancelRequest = await request.json();
    const { request_id } = body;

    if (!request_id || typeof request_id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request_id' },
        { status: 400 }
      );
    }

    // Check if the request exists and belongs to the user
    const currentStatus = await serverRequestService.getRequestStatus(request_id);
    if (!currentStatus) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check if request is already in a final state
    const finalStates = ['completed', 'failed', 'cancelled'];
    if (finalStates.includes(currentStatus)) {
      return NextResponse.json(
        { 
          error: `Request already ${currentStatus}`,
          current_status: currentStatus 
        },
        { status: 400 }
      );
    }

    try {
      // Create cancellation request record
      await serverRequestService.createCancellationRequest(user.id, request_id);
      
      // Update the main request status to cancelled
      await serverRequestService.updateRequestStatus(request_id, 'cancelled', {
        cancelled_by: user.id,
        cancelled_at: new Date().toISOString(),
        previous_status: currentStatus
      });

      console.log(`Request ${request_id} cancelled successfully`);
      
      return NextResponse.json({
        success: true,
        request_id: request_id,
        message: 'Request cancelled successfully'
      });

    } catch (dbError) {
      console.error('Database error during cancellation:', dbError);
      return NextResponse.json(
        { error: 'Failed to cancel request' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Cancel API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}