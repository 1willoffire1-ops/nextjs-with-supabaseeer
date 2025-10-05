import { test, expect } from '@playwright/test'

test.describe('VATANA Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check for the VATANA heading
    await expect(page.getByRole('heading', { name: 'VATANA' })).toBeVisible()
    
    // Check for the subtitle
    await expect(page.getByText('AI-Powered VAT Issue Detection & Compliance Analysis')).toBeVisible()
  })

  test('should have file upload area', async ({ page }) => {
    await page.goto('/')
    
    // Check for upload section
    await expect(page.getByText('Upload Your Invoice Data')).toBeVisible()
    await expect(page.getByText('Drag & drop your invoice file here')).toBeVisible()
  })

  test('should have theme toggle', async ({ page }) => {
    await page.goto('/')
    
    // Check for theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i })
    await expect(themeToggle).toBeVisible()
  })
})
