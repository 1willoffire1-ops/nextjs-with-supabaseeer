import type { Config } from 'tailwindcss'

const config: Config = {
  // Enable dark mode with class strategy
  darkMode: 'class',
  
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
        },
        foreground: {
          DEFAULT: '#1f2937',
          secondary: '#6b7280',
          tertiary: '#9ca3af',
        },
        
        // Dark mode colors (will be applied with dark: prefix)
        dark: {
          background: {
            DEFAULT: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
          },
          foreground: {
            DEFAULT: '#f1f5f9',
            secondary: '#cbd5e1',
            tertiary: '#94a3b8',
          },
        },
        
        // Brand colors (work in both modes)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Status colors optimized for both modes
        success: {
          light: '#10b981',
          dark: '#34d399',
        },
        warning: {
          light: '#f59e0b',
          dark: '#fbbf24',
        },
        error: {
          light: '#ef4444',
          dark: '#f87171',
        },
        info: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
      },
      
      // Shadows for dark mode
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      
      // Background patterns for dark mode
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #1e293b, #0f172a)',
        'gradient-light': 'linear-gradient(to bottom right, #f8fafc, #ffffff)',
      },
    },
  },
  
  plugins: [],
}

export default config
