/**
 * Security utilities for input sanitization and validation
 * Protects against XSS, SQL Injection, and other common attacks
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes or escapes potentially dangerous HTML/JavaScript
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Sanitize HTML content - more aggressive sanitization
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '')
  
  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format and protocol
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed'

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255) // Limit length
}

/**
 * Validate file extension against whitelist
 */
export function isAllowedFileType(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? allowedExtensions.includes(ext) : false
}

/**
 * Sanitize SQL-like input (additional layer on top of parameterized queries)
 */
export function sanitizeSQLInput(input: string): string {
  if (!input) return ''

  // Remove common SQL injection patterns
  const dangerous = [
    '--', ';--', '/\*', '\*/', '@@', '@', ';',
    'char', 'nchar', 'varchar', 'nvarchar',
    'alter', 'begin', 'cast', 'create', 'cursor',
    'declare', 'delete', 'drop', 'end', 'exec',
    'execute', 'fetch', 'insert', 'kill', 'select',
    'sys', 'sysobjects', 'syscolumns', 'table', 'update',
    'union', 'from', 'where', 'join', 'having',
    'waitfor', 'delay', 'sleep', 'ascii', 'substring'
  ]

  let sanitized = input
  dangerous.forEach(keyword => {
    // Escape special regex characters
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  return sanitized.trim()
}

/**
 * Validate and sanitize VAT number format
 */
export function sanitizeVATNumber(vat: string): string {
  if (!vat) return ''

  // Remove all non-alphanumeric characters
  return vat.replace(/[^A-Z0-9]/gi, '').toUpperCase()
}

/**
 * Validate Irish VAT number format
 */
export function isValidIrishVAT(vat: string): boolean {
  const sanitized = sanitizeVATNumber(vat)
  // Irish VAT format: IE + 7 digits + 1-2 letters OR IE + 7 digits + W + letter
  const ieVatRegex = /^IE\d{7}[A-Z]{1,2}$/
  const ieVatRegexW = /^IE\d{7}W[A-Z]$/
  
  return ieVatRegex.test(sanitized) || ieVatRegexW.test(sanitized)
}

/**
 * Sanitize CSV content to prevent CSV injection
 */
export function sanitizeCSVCell(cell: string): string {
  if (!cell) return ''

  const str = String(cell)
  
  // If cell starts with special chars that could trigger formula execution
  if (/^[=+\-@]/.test(str)) {
    return `'${str}` // Prefix with single quote to neutralize
  }

  return str
}

/**
 * Rate limit key generator for user/IP
 */
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}:${Math.floor(Date.now() / 60000)}` // Per minute
}

/**
 * Validate JWT token format (basic check)
 */
export function isValidJWTFormat(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return ''

  // Remove control characters and normalize whitespace
  return query
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 200) // Limit length
}

/**
 * Check if string contains potential code injection
 */
export function containsCodeInjection(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
    /import\(/i,
    /require\(/i
  ]

  return dangerousPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate pagination parameters
 */
export function sanitizePaginationParams(page?: number, limit?: number): {
  page: number
  limit: number
} {
  const sanitizedPage = Math.max(1, Math.floor(Number(page) || 1))
  const sanitizedLimit = Math.min(100, Math.max(1, Math.floor(Number(limit) || 10)))

  return {
    page: sanitizedPage,
    limit: sanitizedLimit
  }
}

/**
 * Sanitize invoice ID
 */
export function sanitizeInvoiceId(id: string): string {
  if (!id) return ''
  
  // First remove SQL comments and dangerous patterns
  let sanitized = id.replace(/--|;|'|"|<|>|\//g, '')
  
  // Then allow only alphanumeric, hyphens, and underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9_]/g, '')
  
  return sanitized.substring(0, 50)
}

/**
 * Validate amount/currency value
 */
export function sanitizeAmount(amount: any): number {
  const num = parseFloat(amount)
  if (isNaN(num) || num < 0 || num > 999999999) {
    throw new Error('Invalid amount')
  }
  return Math.round(num * 100) / 100 // Round to 2 decimal places
}
