import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/fix/route'

describe('Auto-Fix API', () => {
  it('should fix error and return result', async () => {
    const request = new Request('http://localhost:3000/api/fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errorId: 'test-error-id'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success')
    expect(data).toHaveProperty('penaltyAvoided')
  })

  it('should handle bulk fixes', async () => {
    const request = new Request('http://localhost:3000/api/fix', {
      method: 'POST',
      body: JSON.stringify({
        bulk: true,
        errorIds: ['error-1', 'error-2', 'error-3']
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('successful')
    expect(data).toHaveProperty('failed')
    expect(data).toHaveProperty('totalSavings')
  })
})
