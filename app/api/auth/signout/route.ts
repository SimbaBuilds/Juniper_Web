import { createClient } from '@/lib/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const supabase = createClient(cookies())
  
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL('/', request.url))
}