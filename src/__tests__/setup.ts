import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: any) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))
