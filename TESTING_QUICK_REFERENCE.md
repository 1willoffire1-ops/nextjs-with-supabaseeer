# 🧪 VATANA Testing - Quick Reference

## 🚀 Common Commands

### Unit Tests (Vitest)
```powershell
pnpm test                    # Watch mode - auto-runs on file changes
pnpm test --run              # Run once (CI mode)
pnpm test:ui                 # Open beautiful UI dashboard
pnpm test:coverage           # Generate coverage report
pnpm test -- myfile.test.tsx # Run specific test file
```

### E2E Tests (Playwright)
```powershell
pnpm test:e2e                # Run all E2E tests
pnpm test:e2e:ui             # Open Playwright UI (interactive)
pnpm test:e2e --headed       # Run with visible browser
pnpm test:e2e --debug        # Debug mode (step through tests)
pnpm test:e2e homepage.spec  # Run specific E2E test
```

### All Tests
```powershell
pnpm test:all                # Run unit tests + E2E tests
```

---

## 📁 File Locations

```
vatana/
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── src/
│   └── __tests__/
│       ├── setup.ts              # Test setup & mocks
│       ├── *.test.tsx            # Unit tests (Vitest)
│       ├── e2e/
│       │   └── *.spec.ts         # E2E tests (Playwright)
│       └── README.md             # Full testing guide
└── coverage/                     # Coverage reports (after running)
```

---

## ✍️ Quick Test Templates

### Unit Test
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test
```typescript
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toBeVisible()
})
```

---

## 🎯 Current Status

✅ **2 unit tests passing**  
✅ **1 E2E test ready**  
✅ **Coverage configured**  
✅ **UI dashboards available**  

---

## 🔗 Documentation

- Full Guide: `src/__tests__/README.md`
- Setup Details: `TESTING_SETUP_COMPLETE.md`
- Vitest: https://vitest.dev
- Playwright: https://playwright.dev

---

## 💡 Pro Tips

1. **Use watch mode** during development: `pnpm test`
2. **Open UI** to see test results visually: `pnpm test:ui`
3. **Check coverage** regularly: `pnpm test:coverage`
4. **Debug E2E** with headed mode: `pnpm test:e2e --headed`
5. **Write tests first** (TDD) for critical features

---

**Need help?** Check `src/__tests__/README.md` for detailed guides!
