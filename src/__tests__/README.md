# VATANA Testing Guide

This directory contains all tests for the VATANA application.

## 📁 Directory Structure

```
src/__tests__/
├── setup.ts              # Test configuration and global mocks
├── *.test.tsx           # Unit and integration tests (Vitest)
└── e2e/
    └── *.spec.ts        # End-to-end tests (Playwright)
```

## 🧪 Testing Stack

- **Unit/Integration Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Coverage**: Vitest with v8 provider

## 🚀 Running Tests

### Unit & Integration Tests

```bash
# Run all unit tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test --run

# Open Vitest UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e homepage.spec.ts
```

### Run All Tests

```bash
# Run both unit and E2E tests
pnpm test:all
```

## 📝 Writing Tests

### Unit Test Example

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

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('user can navigate to homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toBeVisible()
})
```

## 🎯 Test Coverage Goals

- **Unit Tests**: Aim for 80%+ coverage on components and utilities
- **E2E Tests**: Cover critical user flows
- **Integration Tests**: Test API routes and data fetching

## 🔧 Configuration Files

- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `src/__tests__/setup.ts` - Test setup and global mocks

## 📊 Coverage Reports

Coverage reports are generated in the `coverage/` directory after running:

```bash
pnpm test:coverage
```

Open `coverage/index.html` in your browser to view the detailed report.

## 🐛 Debugging Tests

### Debug Vitest Tests

```bash
# Run tests with debugging enabled
pnpm test --inspect-brk
```

### Debug Playwright Tests

```bash
# Run with headed browser
pnpm test:e2e --headed

# Run in debug mode
pnpm test:e2e --debug
```

## ✅ Best Practices

1. **Test Behavior, Not Implementation**: Focus on what users see and do
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep Tests Isolated**: Each test should be independent
4. **Mock External Dependencies**: Mock API calls, third-party services
5. **Write Descriptive Test Names**: Make test failures easy to understand

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
