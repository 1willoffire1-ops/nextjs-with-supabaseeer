import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  sanitizeHTML,
  containsCodeInjection,
  sanitizeFilename,
  sanitizeCSVCell
} from '@/lib/security/sanitize'

describe('XSS Protection', () => {
  describe('Basic XSS Prevention', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('&lt;')
      expect(sanitized).toContain('&gt;')
    })

    it('should escape quotes to prevent attribute injection', () => {
      const input = '" onload="alert(\'xss\')'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain('"')
      expect(sanitized).toContain('&quot;')
    })

    it('should escape single quotes', () => {
      const input = "' onmouseover='alert(1)'"
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain("'")
      expect(sanitized).toContain('&#x27;')
    })

    it('should escape forward slashes', () => {
      const input = '</script><script>alert(1)</script>'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).toContain('&#x2F;')
      expect(sanitized).not.toContain('</script>')
    })
  })

  describe('Advanced XSS Prevention', () => {
    it('should remove script tags from HTML', () => {
      const html = '<div><script>alert("xss")</script>Hello</div>'
      const sanitized = sanitizeHTML(html)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    it('should remove event handlers', () => {
      const html = '<div onclick="alert(1)">Click me</div>'
      const sanitized = sanitizeHTML(html)
      
      expect(sanitized).not.toContain('onclick')
      expect(sanitized).not.toContain('alert(1)')
    })

    it('should remove javascript: protocol', () => {
      const html = '<a href="javascript:alert(1)">Link</a>'
      const sanitized = sanitizeHTML(html)
      
      expect(sanitized).not.toContain('javascript:')
    })

    it('should remove data:text/html protocol', () => {
      const html = '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>'
      const sanitized = sanitizeHTML(html)
      
      expect(sanitized).not.toContain('data:text/html')
    })

    it('should handle multiple event handlers', () => {
      const events = [
        'onload', 'onerror', 'onclick', 'onmouseover',
        'onfocus', 'onblur', 'onchange', 'onsubmit'
      ]

      events.forEach(event => {
        const html = `<img ${event}="alert('xss')" src="x.jpg">`
        const sanitized = sanitizeHTML(html)
        expect(sanitized).not.toContain(event)
      })
    })
  })

  describe('Code Injection Detection', () => {
    it('should detect script tags', () => {
      const malicious = '<script>alert(1)</script>'
      expect(containsCodeInjection(malicious)).toBe(true)
    })

    it('should detect javascript: protocol', () => {
      const malicious = 'javascript:void(0)'
      expect(containsCodeInjection(malicious)).toBe(true)
    })

    it('should detect event handlers', () => {
      const malicious = 'onclick=alert(1)'
      expect(containsCodeInjection(malicious)).toBe(true)
    })

    it('should detect iframe tags', () => {
      const malicious = '<iframe src="evil.com"></iframe>'
      expect(containsCodeInjection(malicious)).toBe(true)
    })

    it('should detect eval calls', () => {
      const malicious = 'eval(atob("YWxlcnQoMSk="))'
      expect(containsCodeInjection(malicious)).toBe(true)
    })

    it('should allow safe content', () => {
      const safe = 'This is a normal invoice description'
      expect(containsCodeInjection(safe)).toBe(false)
    })
  })

  describe('Filename Sanitization', () => {
    it('should prevent path traversal in filenames', () => {
      const malicious = '../../../etc/passwd'
      const sanitized = sanitizeFilename(malicious)
      
      expect(sanitized).not.toContain('..')
      expect(sanitized).not.toContain('/')
    })

    it('should remove dangerous characters from filenames', () => {
      const malicious = 'file<script>.txt'
      const sanitized = sanitizeFilename(malicious)
      
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).toMatch(/^[a-zA-Z0-9._-]+$/)
    })

    it('should limit filename length', () => {
      const longFilename = 'a'.repeat(300) + '.txt'
      const sanitized = sanitizeFilename(longFilename)
      
      expect(sanitized.length).toBeLessThanOrEqual(255)
    })

    it('should remove leading dots', () => {
      const hidden = '...hidden.txt'
      const sanitized = sanitizeFilename(hidden)
      
      expect(sanitized).not.toMatch(/^\./)
    })
  })

  describe('CSV Injection Prevention', () => {
    it('should neutralize formula injection in CSV', () => {
      const maliciousCells = [
        '=1+1',
        '+cmd|/c calc',
        '-2+3',
        '@SUM(A1:A10)'
      ]

      maliciousCells.forEach(cell => {
        const sanitized = sanitizeCSVCell(cell)
        expect(sanitized).toMatch(/^'/)
        expect(sanitized).toContain(cell)
      })
    })

    it('should allow normal CSV content', () => {
      const normalCells = [
        'Invoice 123',
        '1000.50',
        'Company Name Ltd',
        'IE1234567X'
      ]

      normalCells.forEach(cell => {
        const sanitized = sanitizeCSVCell(cell)
        expect(sanitized).toBe(cell)
      })
    })
  })

  describe('DOM-based XSS Prevention', () => {
    it('should prevent DOM XSS through URL manipulation', () => {
      const maliciousUrl = 'http://example.com#<script>alert(1)</script>'
      const hash = maliciousUrl.split('#')[1]
      const sanitized = sanitizeInput(hash)
      
      expect(sanitized).not.toContain('<script>')
    })

    it('should prevent XSS through innerHTML', () => {
      const userInput = '<img src=x onerror=alert(1)>'
      const sanitized = sanitizeHTML(userInput)
      
      expect(sanitized).not.toContain('onerror')
    })
  })

  describe('Polyglot XSS Prevention', () => {
    it('should handle polyglot payloads', () => {
      const polyglot = 'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1/+/[*/[]/+alert(1)//'
      
      const sanitized = sanitizeHTML(polyglot)
      
      expect(sanitized).not.toContain('onload')
      expect(sanitized).not.toContain('onmouseover')
      expect(sanitized).not.toContain('javascript:')
    })
  })

  describe('Mutation XSS Prevention', () => {
    it('should prevent mXSS through attribute mutation', () => {
      const mxss = '<noscript><p title="</noscript><img src=x onerror=alert(1)>">'
      const sanitized = sanitizeHTML(mxss)
      
      expect(sanitized).not.toContain('onerror')
    })
  })
})
