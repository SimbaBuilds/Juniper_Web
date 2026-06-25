import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAppServerClient } from '@/lib/utils/supabase/server'

// Proxy to the Python backend, which owns validation of confirmation settings
// (shared with the config agent — single validator, no drift). We only attach
// the user's access token; all validation/merge happens server-side in FastAPI.
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'https://juniper-python-backend.onrender.com'

async function getAccessToken() {
  const supabase = await createSupabaseAppServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function GET() {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const res = await fetch(`${PYTHON_BACKEND_URL}/api/user/confirmation-settings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const res = await fetch(`${PYTHON_BACKEND_URL}/api/user/confirmation-settings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
