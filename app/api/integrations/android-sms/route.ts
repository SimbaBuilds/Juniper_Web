import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'https://juniper-python-backend.onrender.com';

/**
 * Android SMS (capcom6 SMS Gateway) connect proxy.
 *
 * Like Quo, Android SMS MUST be connected through the FastAPI backend, because
 * the server validates the gateway credentials and registers the inbound
 * webhook with the SMS Gateway so Juniper can receive replies.
 *
 * This route is a thin proxy: it pulls the user's Supabase session token
 * server-side (same mechanism the rest of the web app uses to talk to the
 * FastAPI backend) and forwards the request to:
 *   POST {PYTHON_BACKEND_URL}/api/integrations/android-sms/connect
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password, base_url } = await request.json();

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get authenticated user + session token (the same way the web app
    // authenticates to the FastAPI backend elsewhere).
    const supabase = await createSupabaseAppServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Forward to FastAPI. The backend validates the gateway credentials,
    // registers the inbound webhook, and returns the connect state.
    const body: { username: string; password: string; base_url?: string } = {
      username: username.trim(),
      password: password.trim(),
    };
    if (base_url && typeof base_url === 'string' && base_url.trim()) {
      body.base_url = base_url.trim();
    }

    const backendResponse = await fetch(`${PYTHON_BACKEND_URL}/api/integrations/android-sms/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.detail || data?.message || data?.error || 'Failed to connect Android SMS',
        },
        { status: backendResponse.status }
      );
    }

    // Pass the backend connect-state through unchanged so the client can show
    // the EXACT state (outbound_active / inbound_state / message / inbound_error).
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('Android SMS connect error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
