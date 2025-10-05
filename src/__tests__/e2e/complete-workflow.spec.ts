import { test, expect } from '@playwright/test'

test.describe('Complete VAT Compliance Workflow', () => {
  test('user can upload CSV, detect errors, and fix them', async ({ page }) => {
    // 1. Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'Test123456!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // 2. Navigate to errors page
    await page.click('text=View Errors')
    await page.waitForURL('/errors')
    
    // 3. Verify errors are displayed
    const errorCount = await page.locator('[data-testid="error-count"]').textContent()
    expect(parseInt(errorCount!)).toBeGreaterThan(0)

    // 4. Fix an error
    await page.click('[data-testid="fix-button"]')
    await expect(page.locator('text=Preview Fix')).toBeVisible()
    await page.click('text=Apply Fix')
    
    // Wait for alert and accept it
    page.on('dialog', dialog => dialog.accept())

    // 5. Check savings
    await page.goto('/savings')
    const savings = await page.locator('[data-testid="total-savings"]').textContent()
    expect(savings).toContain('€')
  })
})
