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
        // VATANA Turquoise Theme - Background Colors
        background: {
          DEFAULT: '#0A0E1A',      // Deep navy black
          secondary: '#0F1419',     // Slightly lighter
          tertiary: '#1A1F2E',      // Card background
          elevated: '#212838',      // Elevated surfaces
        },
        foreground: {
          DEFAULT: '#F8FAFC',       // Pure white text
          secondary: '#CBD5E1',     // Gray text
          tertiary: '#94A3B8',      // Muted gray
        },
        
        // Turquoise/Green Accent Colors
        primary: {
          DEFAULT: '#00D9B4',       // Bright turquoise
          50: '#E5FFF9',
          100: '#CCFFF4',
          200: '#99FFE8',
          300: '#66FFDD',
          400: '#33FFD1',
          500: '#00D9B4',
          600: '#00BFA6',
          700: '#009981',
          800: '#00735C',
          900: '#004D37',
        },
        accent: {
          DEFAULT: '#00D9B4',       // Bright turquoise
          secondary: '#00BFA6',     // Deeper turquoise
          tertiary: '#14F195',      // Mint green
          glow: '#00FFD1',          // Bright cyan glow
        },
        
        // Status colors
        success: {
          DEFAULT: '#14F195',       // Mint green
          light: '#34F1A5',
          dark: '#00BFA6',
        },
        warning: {
          DEFAULT: '#FFB800',       // Warm yellow
          light: '#FFC933',
          dark: '#E6A600',
        },
        error: {
          DEFAULT: '#FF4757',       // Coral red
          light: '#FF6B7A',
          dark: '#E62E3E',
        },
        info: {
          DEFAULT: '#00D9B4',       // Turquoise
          light: '#00FFD1',
          dark: '#00BFA6',
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
      
      // Background patterns
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #1e293b, #0f172a)',
        'gradient-light': 'linear-gradient(to bottom right, #f8fafc, #ffffff)',
        'gradient-turquoise': 'linear-gradient(135deg, #00D9B4 0%, #14F195 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 50%, rgba(0, 217, 180, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(20, 241, 149, 0.15) 0%, transparent 50%)',
      },
      
      // Animations
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 180, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 180, 0.6)' },
        },
        'shimmer': {
          '100%': { left: '100%' },
        },
        'fadeInUp': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  
  plugins: [],
}

export default config
