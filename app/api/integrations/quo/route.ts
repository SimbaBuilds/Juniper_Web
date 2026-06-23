import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'https://juniper-python-backend.onrender.com';

/**
 * Quo (formerly OpenPhone) SMS connect proxy.
 *
 * Unlike Textbelt (which writes creds straight to Supabase), Quo MUST be
 * connected through the FastAPI backend, because the server registers the
 * inbound webhook with Quo and stores the returned signing key.
 *
 * This route is a thin proxy: it pulls the user's Supabase session token
 * server-side (same mechanism the rest of the web app uses to talk to the
 * FastAPI backend) and forwards the request to:
 *   POST {PYTHON_BACKEND_URL}/api/integrations/quo/connect
 */
export async function POST(request: NextRequest) {
  try {
    const { api_key, from_number } = await request.json();

    if (!api_key || typeof api_key !== 'string' || !api_key.trim()) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
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

    // Forward to FastAPI. The backend registers the inbound webhook with Quo
    // and persists the signing key, then returns the connect state.
    const body: { api_key: string; from_number?: string } = {
      api_key: api_key.trim(),
    };
    if (from_number && typeof from_number === 'string' && from_number.trim()) {
      body.from_number = from_number.trim();
    }

    const backendResponse = await fetch(`${PYTHON_BACKEND_URL}/api/integrations/quo/connect`, {
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
          error: data?.detail || data?.message || data?.error || 'Failed to connect Quo',
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
    console.error('Quo connect error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Quo disconnect proxy.
 *
 * Quo MUST be disconnected through the FastAPI backend so the server can delete
 * the inbound webhook registered on the user's Quo account (it holds the API
 * key) and remove the webhook config + integration record. Forwards to:
 *   POST {PYTHON_BACKEND_URL}/api/integrations/quo/disconnect
 */
export async function DELETE() {
  try {
    const supabase = await createSupabaseAppServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${PYTHON_BACKEND_URL}/api/integrations/quo/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.detail || data?.message || data?.error || 'Failed to disconnect Quo',
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Quo disconnect error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
