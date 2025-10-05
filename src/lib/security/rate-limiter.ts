/**
 * Rate Limiting Implementation for API Protection
 * Prevents abuse and DoS attacks
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Default rate limit configurations
export const RATE_LIMITS = {
  strict: { windowMs: 60000, maxRequests: 10 }, // 10 requests per minute
  standard: { windowMs: 60000, maxRequests: 60 }, // 60 requests per minute
  relaxed: { windowMs: 60000, maxRequests: 300 }, // 300 requests per minute
  auth: { windowMs: 900000, maxRequests: 5 }, // 5 login attempts per 15 minutes
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.standard
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = `${identifier}:${config.windowMs}`
  const now = Date.now()

  let record = rateLimitStore.get(key)

  // Create new record or reset if window expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(key, record)
  }

  // Increment count
  record.count++

  const allowed = record.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - record.count)

  return {
    allowed,
    remaining,
    resetTime: record.resetTime
  }
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function createRateLimiter(config: RateLimitConfig = RATE_LIMITS.standard) {
  return async (req: Request): Promise<Response | null> => {
    // Get identifier (IP address or user ID)
    const identifier = getIdentifier(req)

    const { allowed, remaining, resetTime } = checkRateLimit(identifier, config)

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    return null // Allow request to proceed
  }
}

/**
 * Get identifier from request (IP or user ID)
 */
function getIdentifier(req: Request): string {
  // Try to get user ID from authorization header
  const authHeader = req.headers.get('authorization')
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')
      // In production, decode JWT to get user ID
      return `user:${token.substring(0, 10)}`
    } catch {
      // Fall through to IP-based identification
    }
  }

  // Get IP address
  const forwardedFor = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
  
  return `ip:${ip}`
}

/**
 * Clean up expired rate limit records
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 300000)
}

/**
 * Get current rate limit status for identifier
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.standard
): { count: number; remaining: number; resetTime: number } {
  const key = `${identifier}:${config.windowMs}`
  const record = rateLimitStore.get(key)
  const now = Date.now()

  if (!record || now > record.resetTime) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs
    }
  }

  return {
    count: record.count,
    remaining: Math.max(0, config.maxRequests - record.count),
    resetTime: record.resetTime
  }
}
