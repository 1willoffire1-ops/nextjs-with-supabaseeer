# VATANA Dark Mode Implementation Guide

## Overview

VATANA now supports **light mode**, **dark mode**, and **system preference detection** using `next-themes`. The implementation includes smooth transitions, comprehensive color schemes, and three toggle component variants.

---

## 🎨 Features

✅ **Three Theme Modes**
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light environments
- **System Mode**: Automatically matches OS preference

✅ **Smooth Transitions**
- 200ms color transitions on theme changes
- No flashing or jarring switches
- Hydration-safe (no mismatch errors)

✅ **Comprehensive Styling**
- All components support dark mode
- Custom scrollbar styling
- Optimized selection colors
- Dark mode shadows and borders

✅ **Multiple Toggle Components**
- **Full Toggle**: 3-button selector (Light, System, Dark)
- **Simple Toggle**: 2-state switch (Light ↔ Dark)
- **Compact Toggle**: Cycling single button

---

## 📦 Dependencies

```json
{
  "next-themes": "^0.4.6",
  "lucide-react": "^0.544.0"
}
```

Already installed! ✅

---

## 🎨 Color Palette

### Background Colors

#### Light Mode
```css
Layer 1 (Base):      #ffffff  (white)
Layer 2 (Secondary): #f9fafb  (gray-50)
Layer 3 (Tertiary):  #f3f4f6  (gray-100)
```

#### Dark Mode
```css
Layer 1 (Base):      #0f172a  (slate-900)
Layer 2 (Secondary): #1e293b  (slate-800)
Layer 3 (Tertiary):  #334155  (slate-700)
```

### Text Colors

#### Light Mode
```css
Primary:   #1f2937  (gray-800)
Secondary: #6b7280  (gray-500)
Tertiary:  #9ca3af  (gray-400)
```

#### Dark Mode
```css
Primary:   #f1f5f9  (slate-100)
Secondary: #cbd5e1  (slate-300)
Tertiary:  #94a3b8  (slate-400)
```

### Brand Colors (Work in Both Modes)

```css
Primary Blue: #2563eb (blue-600) in light / #60a5fa (blue-400) in dark
```

### Status Colors

```css
Success: #10b981 (light) / #34d399 (dark)
Warning: #f59e0b (light) / #fbbf24 (dark)
Error:   #ef4444 (light) / #f87171 (dark)
Info:    #3b82f6 (light) / #60a5fa (dark)
```

---

## 🚀 Usage

### 1. Theme Toggle Components

Import and use in your components:

```tsx
import { ThemeToggle, ThemeToggleSimple, ThemeToggleCompact } from '@/components/theme/theme-toggle'

// In your header/navbar:
export function Header() {
  return (
    <header className="p-4">
      <div className="flex items-center justify-between">
        <h1>VATANA</h1>
        
        {/* Full 3-button toggle */}
        <ThemeToggle />
        
        {/* OR Simple 2-state toggle */}
        <ThemeToggleSimple />
        
        {/* OR Compact cycling toggle */}
        <ThemeToggleCompact />
      </div>
    </header>
  )
}
```

### 2. Using Themes in Components

#### Basic Example

```tsx
// Before (light mode only)
<div className="bg-white border rounded-lg shadow-lg">
  <h2 className="text-gray-900 font-bold">Title</h2>
  <p className="text-gray-600">Content</p>
</div>

// After (dark mode support)
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-dark-lg">
  <h2 className="text-gray-900 dark:text-gray-100 font-bold">Title</h2>
  <p className="text-gray-600 dark:text-gray-400">Content</p>
</div>
```

#### Advanced Example with Gradients

```tsx
<div className="bg-gradient-light dark:bg-gradient-dark min-h-screen">
  <div className="max-w-7xl mx-auto p-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-dark-xl p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Welcome to your analytics dashboard
      </p>
    </div>
  </div>
</div>
```

### 3. Programmatic Theme Access

```tsx
'use client'

import { useTheme } from 'next-themes'

export function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  )
}
```

---

## 🔧 Customization Patterns

### Common Tailwind Dark Mode Patterns

#### Backgrounds
```css
bg-white           → bg-white dark:bg-gray-800
bg-gray-50         → bg-gray-50 dark:bg-gray-900
bg-gray-100        → bg-gray-100 dark:bg-gray-800
```

#### Text
```css
text-gray-900      → text-gray-900 dark:text-gray-100
text-gray-600      → text-gray-600 dark:text-gray-400
text-gray-500      → text-gray-500 dark:text-gray-500
```

#### Borders
```css
border-gray-200    → border-gray-200 dark:border-gray-700
border-gray-300    → border-gray-300 dark:border-gray-600
```

#### Shadows
```css
shadow-lg          → shadow-lg dark:shadow-dark-lg
shadow-md          → shadow-md dark:shadow-dark-md
```

#### Hover States
```css
hover:bg-gray-100  → hover:bg-gray-100 dark:hover:bg-gray-700
hover:text-gray-900 → hover:text-gray-900 dark:hover:text-gray-100
```

### Custom Components

#### Button Example

```tsx
export function Button({ children, variant = 'primary' }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",
    outline: "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
  }
  
  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  )
}
```

#### Card Example

```tsx
export function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-dark-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </div>
  )
}
```

---

## 🔍 Testing Dark Mode

### Manual Testing

1. **Toggle Each Mode**
   ```
   - Click Light mode → Verify bright colors
   - Click System mode → Verify follows OS preference
   - Click Dark mode → Verify dark colors
   ```

2. **Check All Pages**
   - Dashboard
   - Settings
   - Forms
   - Modals/Dialogs
   - Charts/Visualizations

3. **Test Transitions**
   - Switch between modes rapidly
   - Verify smooth transitions (no flash)
   - Check for hydration warnings in console

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme/theme-provider'

test('renders in dark mode', () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <MyComponent />
    </ThemeProvider>
  )
  
  const element = screen.getByTestId('my-element')
  expect(element).toHaveClass('dark:bg-gray-800')
})
```

---

## 📊 Integration with Existing Components

### PWA Components

The PWA components (OfflineIndicator, InstallPrompt) already include dark mode support:

```tsx
// Already dark mode ready! ✅
<OfflineIndicator />
<InstallPrompt />
```

### Analytics Components

Update your analytics charts with dark mode support:

```tsx
import { useTheme } from 'next-themes'
import { Chart } from 'chart.js'

export function AnalyticsChart() {
  const { theme } = useTheme()
  
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#f1f5f9' : '#1f2937'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#cbd5e1' : '#6b7280'
        },
        grid: {
          color: theme === 'dark' ? '#334155' : '#e5e7eb'
        }
      }
    }
  }
  
  return <Chart options={chartOptions} />
}
```

---

## 🎯 Best Practices

### 1. Always Use Semantic Classes

❌ **Don't:**
```tsx
<div className="bg-[#1e293b]">
```

✅ **Do:**
```tsx
<div className="bg-gray-800 dark:bg-gray-700">
```

### 2. Consider Contrast Ratios

- Maintain WCAG AA compliance (4.5:1 for normal text)
- Test with contrast checkers
- Use darker shades in dark mode for better readability

### 3. Test in Both Modes

Always verify:
- Text is readable
- Borders are visible
- Shadows don't disappear
- Hover states work
- Focus indicators show

### 4. Images and Icons

```tsx
// For images that need different versions
<img 
  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'} 
  alt="Logo"
/>

// For icons, use Lucide icons with dynamic colors
<Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
```

### 5. Gradients

```tsx
// Use the predefined gradients
<div className="bg-gradient-light dark:bg-gradient-dark">
```

---

## 🐛 Troubleshooting

### Issue: Hydration Mismatch

**Problem**: Console shows hydration errors

**Solution**: Ensure `suppressHydrationWarning` is on `<html>` tag
```tsx
<html lang="en" suppressHydrationWarning>
```

### Issue: Theme Not Persisting

**Problem**: Theme resets on page reload

**Solution**: `next-themes` automatically saves to localStorage. Check if cookies are enabled.

### Issue: Flash of Unstyled Content

**Problem**: Brief flash of light mode before dark mode loads

**Solution**: Already handled by ThemeProvider's mounting logic. If still occurring, add this to your `<head>`:

```tsx
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `
}} />
```

### Issue: Slow Transitions

**Problem**: Theme switching feels sluggish

**Solution**: Reduce transition duration in `globals.css`:
```css
* {
  @apply transition-colors duration-100; /* Changed from 200ms */
}
```

---

## 📚 Component Library

### Pre-styled Components

Create a `components/ui` directory with reusable dark-mode-ready components:

```tsx
// components/ui/button.tsx
export function Button({ variant = 'primary', children, ...props }) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800"
  }
  
  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}

// components/ui/card.tsx
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-dark-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {children}
    </div>
  )
}

// components/ui/input.tsx
export function Input({ ...props }) {
  return (
    <input
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
      {...props}
    />
  )
}
```

---

## 🚀 Next Steps

1. ✅ **Test in Production**
   - Deploy and verify on all devices
   - Check system theme detection works

2. ✅ **User Preferences**
   - Save theme preference to user profile (database)
   - Sync across devices

3. ✅ **Analytics**
   - Track theme usage (light vs dark vs system)
   - Identify popular preference

4. ✅ **Accessibility**
   - Run WAVE or axe DevTools
   - Verify keyboard navigation
   - Test with screen readers

---

## 📖 Additional Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Dark Mode Design Guidelines](https://material.io/design/color/dark-theme.html)

---

## ✅ Checklist

- ✅ `next-themes` installed
- ✅ Tailwind config updated with `darkMode: 'class'`
- ✅ Theme provider created
- ✅ Theme toggle components created (3 variants)
- ✅ Root layout updated
- ✅ Global CSS updated with dark mode support
- ✅ Color palette defined
- ✅ Documentation complete

**Status**: Dark mode fully implemented! 🎉

---

**Questions or issues?**  
Ask the AI agent: "Help with dark mode" or "Update [component] for dark mode"
