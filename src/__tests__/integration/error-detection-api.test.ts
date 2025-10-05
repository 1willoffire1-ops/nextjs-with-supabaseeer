import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/errors/detect/route'

describe('Error Detection API', () => {
  it('should detect errors in uploaded invoices', async () => {
    const request = new Request('http://localhost:3000/api/errors/detect', {
      method: 'POST',
      body: JSON.stringify({
        uploadId: 'test-upload-id'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('errors')
    expect(Array.isArray(data.errors)).toBe(true)
  })

  it('should return 400 for missing uploadId', async () => {
    const request = new Request('http://localhost:3000/api/errors/detect', {
      method: 'POST',
      body: JSON.stringify({})
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
