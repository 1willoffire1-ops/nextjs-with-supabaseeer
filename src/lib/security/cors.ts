/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * Protects against unauthorized cross-origin requests
 */

const isDevelopment = process.env.NODE_ENV === 'development'

// Allowed origins in production
const ALLOWED_ORIGINS = [
  'https://vatana.ie',
  'https://www.vatana.ie',
  'https://app.vatana.ie',
  ...(isDevelopment ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : [])
]

/**
 * Get CORS headers for API responses
 */
export function getCorsHeaders(origin?: string | null): HeadersInit {
  // Check if origin is allowed
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    (isDevelopment && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')))
  )

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
    'Access-Control-Allow-Credentials': 'true',
  }
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleCorsPreflightRequest(request: Request): Response {
  const origin = request.headers.get('Origin')
  const corsHeaders = getCorsHeaders(origin)

  return new Response(null, {
    status: 204,
    headers: corsHeaders
  })
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: Response, request: Request): Response {
  const origin = request.headers.get('Origin')
  const corsHeaders = getCorsHeaders(origin)

  // Clone response and add CORS headers
  const newHeaders = new Headers(response.headers)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value as string)
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}

/**
 * Validate origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false

  return ALLOWED_ORIGINS.includes(origin) ||
    (isDevelopment && (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1')
    ))
}

/**
 * Get security headers for all responses
 */
export function getSecurityHeaders(): HeadersInit {
  return {
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // For Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'"
    ].join('; '),
    
    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()'
    ].join(', '),
    
    // Strict Transport Security (HTTPS only)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    })
  }
}

/**
 * Combine CORS and security headers
 */
export function getAllSecurityHeaders(origin?: string | null): HeadersInit {
  return {
    ...getCorsHeaders(origin),
    ...getSecurityHeaders()
  }
}
