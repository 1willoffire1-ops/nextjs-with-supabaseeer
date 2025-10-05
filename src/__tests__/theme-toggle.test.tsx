import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeToggleCompact } from '@/components/theme/theme-toggle'

describe('ThemeToggleCompact', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggleCompact />)
    
    // Check if the component renders (button should be in the document)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('has correct aria-label', () => {
    render(<ThemeToggleCompact />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Cycle theme')
  })
})
