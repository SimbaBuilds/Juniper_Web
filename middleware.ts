import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/utils/supabase/middleware'
import { rateLimit, getClientIP } from '@/lib/utils/rate-limiter'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Apply rate limiting to signup-related endpoints
  if (pathname.includes('/signup') || 
      (pathname.startsWith('/api/') && pathname.includes('signUp'))) {
    
    const clientIP = getClientIP(request)
    
    // Rate limit: 5 signup attempts per 15 minutes per IP
    const isAllowed = rateLimit(clientIP, { limit: 5, windowMs: 900000 })
    
    if (!isAllowed) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.',
          code: 'RATE_LIMITED'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '900' // 15 minutes in seconds
          }
        }
      )
    }
  }
  
  // Continue with existing Supabase authentication middleware
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}