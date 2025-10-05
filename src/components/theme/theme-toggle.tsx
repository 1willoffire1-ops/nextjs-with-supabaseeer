'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Full theme toggle with three options: Light, System, Dark
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`
          p-2 rounded-md transition-all
          ${theme === 'light'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`
          p-2 rounded-md transition-all
          ${theme === 'system'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        aria-label="System mode"
        title="System mode"
      >
        <Monitor className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`
          p-2 rounded-md transition-all
          ${theme === 'dark'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  )
}

/**
 * Simple theme toggle - switches between light and dark only
 */
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all shadow-sm"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  )
}

/**
 * Compact theme toggle for mobile/header
 */
export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => {
        const themes = ['light', 'system', 'dark']
        const currentIndex = themes.indexOf(theme || 'system')
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
      }}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Cycle theme"
      title={`Current: ${theme}`}
    >
      {theme === 'light' && <Sun className="w-5 h-5 text-yellow-600" />}
      {theme === 'system' && <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
      {theme === 'dark' && <Moon className="w-5 h-5 text-indigo-500" />}
    </button>
  )
}

export default ThemeToggle
