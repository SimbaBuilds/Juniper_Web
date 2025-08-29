import { NextRequest } from 'next/server'

// Simple in-memory rate limiting
// In production, consider using Redis or a database for distributed systems
const rateLimitMap = new Map<string, number[]>()

interface RateLimitOptions {
  limit: number      // Maximum number of attempts
  windowMs: number   // Time window in milliseconds
}

export function rateLimit(
  identifier: string, 
  options: RateLimitOptions = { limit: 5, windowMs: 900000 } // Default: 5 attempts per 15 minutes
): boolean {
  const now = Date.now()
  const windowStart = now - options.windowMs
  
  // Get or create attempts array for this identifier
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const attempts = rateLimitMap.get(identifier)!
  
  // Filter out attempts outside the current window
  const recentAttempts = attempts.filter(time => time > windowStart)
  
  // Check if limit exceeded
  if (recentAttempts.length >= options.limit) {
    return false
  }
  
  // Add current attempt and update the map
  recentAttempts.push(now)
  rateLimitMap.set(identifier, recentAttempts)
  
  return true
}

export function getRateLimitStatus(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 900000 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - options.windowMs
  
  if (!rateLimitMap.has(identifier)) {
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetTime: now + options.windowMs
    }
  }
  
  const attempts = rateLimitMap.get(identifier)!
  const recentAttempts = attempts.filter(time => time > windowStart)
  
  const remaining = Math.max(0, options.limit - recentAttempts.length)
  const oldestAttempt = recentAttempts[0]
  const resetTime = oldestAttempt ? oldestAttempt + options.windowMs : now + options.windowMs
  
  return {
    allowed: recentAttempts.length < options.limit,
    remaining,
    resetTime
  }
}

export function getClientIP(request: NextRequest): string {
  // Try to get the real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  // Fallback to request IP
  return request.ip || 'unknown'
}

// Cleanup function to remove old entries (call periodically)
export function cleanupRateLimit(): void {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  
  for (const [identifier, attempts] of rateLimitMap.entries()) {
    const recentAttempts = attempts.filter(time => time > now - maxAge)
    
    if (recentAttempts.length === 0) {
      rateLimitMap.delete(identifier)
    } else {
      rateLimitMap.set(identifier, recentAttempts)
    }
  }
}
