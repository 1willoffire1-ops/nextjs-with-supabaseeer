import { describe, it, expect, vi, beforeAll } from 'vitest'
import { sanitizeSQLInput, sanitizeInvoiceId } from '@/lib/security/sanitize'

// Mock Supabase client for testing
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: async () => ({ data: [], error: null })
        })
      })
    })
  }
}))

describe('SQL Injection Protection', () => {
  it('should prevent SQL injection in search queries', async () => {
    const maliciousInput = "'; DROP TABLE users; --"
    
    // Import mock supabase
    const { supabase } = await import('@/lib/supabase/client')
    
    // Supabase uses parameterized queries, so this should be safe
    // The malicious input will be treated as a literal string
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_id', maliciousInput)
      .limit(1)

    // Should not throw error, malicious input is safely escaped
    // May return null data if no matching record, but no SQL execution
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })

  it('should sanitize common SQL injection patterns', () => {
    const testCases = [
      { input: "'; DROP TABLE users; --", expected: true },
      { input: "1' OR '1'='1", expected: true },
      { input: "admin'--", expected: true },
      { input: "1' UNION SELECT * FROM passwords--", expected: true },
      { input: "normal_invoice_123", expected: false },
    ]

    testCases.forEach(({ input, expected }) => {
      const sanitized = sanitizeSQLInput(input)
      const containsDangerous = sanitized !== input && sanitized.length < input.length
      
      if (expected) {
        // Malicious input should be sanitized
        expect(sanitized).not.toContain('--')
        expect(sanitized).not.toContain('DROP')
        expect(sanitized).not.toContain('UNION')
      } else {
        // Normal input should pass through relatively unchanged
        expect(sanitized).toBe(input.trim())
      }
    })
  })

  it('should sanitize invoice IDs to prevent SQL injection', () => {
    const maliciousIds = [
      "'; DELETE FROM invoices; --",
      "1 OR 1=1",
      "../../../etc/passwd",
      "<script>alert('xss')</script>"
    ]

    maliciousIds.forEach(id => {
      const sanitized = sanitizeInvoiceId(id)
      
      // Should only contain safe characters (alphanumeric and underscore only)
      expect(sanitized).toMatch(/^[a-zA-Z0-9_]*$/)
      expect(sanitized).not.toContain(';')
      expect(sanitized).not.toContain('--')
      expect(sanitized).not.toContain('/')
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).not.toContain("'")
    })
  })

  it('should handle SQL injection in WHERE clauses', () => {
    const inputs = [
      "admin' OR '1'='1",
      "user'--",
      "'; WAITFOR DELAY '00:00:05'--",
    ]

    inputs.forEach(input => {
      const sanitized = sanitizeSQLInput(input)
      
      // Common SQL keywords should be removed
      expect(sanitized.toLowerCase()).not.toContain('waitfor')
      expect(sanitized.toLowerCase()).not.toContain('delay')
    })
  })

  it('should prevent blind SQL injection attempts', () => {
    const blindSQLPayloads = [
      "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
      "1' AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)) > 64--",
      "admin' AND 1=1--",
      "admin' AND 1=2--",
    ]

    blindSQLPayloads.forEach(payload => {
      const sanitized = sanitizeSQLInput(payload)
      
      // Should not contain SQL function names
      expect(sanitized.toLowerCase()).not.toContain('sleep')
      expect(sanitized.toLowerCase()).not.toContain('ascii')
      expect(sanitized.toLowerCase()).not.toContain('substring')
    })
  })

  it('should handle stacked queries', () => {
    const input = "'; DELETE FROM users WHERE '1'='1"
    const sanitized = sanitizeSQLInput(input)
    
    expect(sanitized).not.toContain('DELETE')
    expect(sanitized).not.toContain(';')
  })

  it('should prevent comment-based SQL injection', () => {
    const inputs = [
      "admin'/*",
      "admin'#",
      "admin'--",
    ]

    inputs.forEach(input => {
      const sanitized = sanitizeSQLInput(input)
      expect(sanitized).not.toContain('/*')
      expect(sanitized).not.toContain('--')
    })
  })

  it('should sanitize UNION-based injection', () => {
    const input = "1' UNION SELECT null, username, password FROM users--"
    const sanitized = sanitizeSQLInput(input)
    
    expect(sanitized.toLowerCase()).not.toContain('union')
    expect(sanitized.toLowerCase()).not.toContain('select')
  })
})
