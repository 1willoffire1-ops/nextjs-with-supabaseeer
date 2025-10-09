# VATANA Design System
## Turquoise/Green Minimal Modern Theme

This document contains the complete design system for the VATANA VAT compliance platform.

## 🎨 Color Palette

### Primary Background Colors
```css
--bg-primary: #0A0E1A;       /* Deep navy black */
--bg-secondary: #0F1419;     /* Slightly lighter black */
--bg-tertiary: #1A1F2E;      /* Card background */
--bg-elevated: #212838;      /* Elevated surfaces */
```

### Turquoise/Green Accent Colors
```css
--accent-primary: #00D9B4;   /* Bright turquoise */
--accent-secondary: #00BFA6; /* Deeper turquoise */
--accent-tertiary: #14F195;  /* Mint green */
--accent-glow: #00FFD1;      /* Bright cyan glow */
```

### Text Colors
```css
--text-primary: #F8FAFC;     /* Pure white text */
--text-secondary: #CBD5E1;   /* Gray text */
--text-tertiary: #94A3B8;    /* Muted gray */
--text-accent: #00D9B4;      /* Turquoise text */
```

### Status Colors
```css
--success: #14F195;          /* Mint green */
--warning: #FFB800;          /* Warm yellow */
--error: #FF4757;            /* Coral red */
--info: #00D9B4;             /* Turquoise */
```

## ✨ Key Design Principles

1. **Glassmorphism**: Use frosted glass effects with blur and transparency
2. **Turquoise Accents**: Primary brand color for CTAs and highlights
3. **Dark Navy Base**: Deep, sophisticated dark backgrounds
4. **Smooth Animations**: All transitions use cubic-bezier easing
5. **Glow Effects**: Subtle turquoise glows on interactive elements

## 📦 CSS Classes

### Utility Classes
- `.glass-card` - Glassmorphism card container
- `.glass-button` - Glass button with hover effects
- `.glass-input` - Glass input field
- `.gradient-text` - Turquoise gradient text
- `.gradient-bg` - Animated gradient background
- `.hover-lift` - Lift animation on hover
- `.glow-pulse` - Pulsing glow effect
- `.shimmer` - Shimmer animation
- `.fade-in-up` - Fade in from bottom

### Component Classes
- `.btn-primary` - Primary button with gradient
- `.badge` - Status badge with pulse dot
- `.card` - Standard card container
- `.navbar` - Navigation bar
- `.hero` - Hero section with gradient orbs

## 🎬 Animations

All animations use cubic-bezier(0.4, 0, 0.2, 1) for smooth, natural motion.

- **gradient-shift**: 15s infinite background animation
- **pulse-glow**: 2s infinite glow pulse
- **shimmer**: 2s infinite shimmer effect
- **fadeInUp**: 0.6s fade in from bottom

## 📱 Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

## 🔤 Typography

- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Base Size**: 16px
- **Scale**: 0.75rem → 3.75rem (xs → 6xl)
- **Weights**: 300 (light) → 800 (extrabold)

## 💡 Usage Examples

### Glass Card
```jsx
<div className="glass-card hover-lift p-6">
  <h3 className="gradient-text text-2xl font-bold">Title</h3>
  <p className="text-secondary mt-2">Content</p>
</div>
```

### Primary Button
```jsx
<button className="btn-primary px-8 py-4">
  Get Started
</button>
```

### Status Badge
```jsx
<span className="badge">Active</span>
```

## 🎨 Tailwind CSS Extensions

The design system integrates with Tailwind CSS through custom color definitions and animation keyframes. See `tailwind.config.ts` for the full configuration.

## 📄 Files

- `/src/styles/design-system.css` - Core CSS variables and classes
- `/tailwind.config.ts` - Tailwind configuration
- `/ DESIGN_SYSTEM.md` - This documentation

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Maintainer**: VATANA Team
