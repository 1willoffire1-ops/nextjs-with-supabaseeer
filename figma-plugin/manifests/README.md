# VATANA Manifest System

This folder contains JSON manifests that define the complete specifications for each page type in the VATANA application.

## 📁 Files

### Manifest Files
- **`landing-page-manifest.json`** (655 lines)
  - Complete landing page specifications
  - 8 sections: Navbar, Hero, Features, How It Works, Stats, Pricing, CTA, Footer
  
- **`dashboard-manifest.json`** (948 lines)
  - Complete dashboard specifications
  - 8 sections: Sidebar, Top Bar, KPI Metrics, Charts, Activity, Quick Actions, Deadlines

### Test Files
- **`test-manifest.html`** 
  - Interactive HTML page to validate and test manifest files
  - Load manifests via fetch or file upload
  - Visual JSON validator

## 🎯 What is a Manifest?

A manifest is a complete JSON specification that describes:
- **Design System**: Colors, typography, spacing, effects
- **Page Structure**: All sections and components
- **Content**: Text, icons, data samples
- **Styling**: CSS classes, Tailwind utilities
- **Interactions**: Animations, hover states, micro-interactions
- **Responsive**: Breakpoints and mobile behavior
- **Accessibility**: ARIA labels, keyboard navigation

## 📋 Manifest Structure

```json
{
  "page_type": "landing",
  "page_name": "VATANA Landing Page",
  "version": "1.0.0",
  "framework": "react",
  "styling": "tailwind",
  "description": "...",
  
  "design_system": {
    "theme": "dark",
    "colors": { ... },
    "typography": { ... },
    "spacing": { ... }
  },
  
  "sections": [
    {
      "id": "navbar",
      "name": "Navigation Bar",
      "type": "fixed_header",
      "content": { ... }
    },
    // ... more sections
  ],
  
  "animations": { ... },
  "responsive": { ... },
  "accessibility": { ... }
}
```

## 🚀 How to Use

### 1. Testing Manifests

**Option A: Using the HTML Tester**
```bash
# Start a local server
cd D:\buildvatana\vatana\figma-plugin
npx serve . -l 5500

# Open browser
# http://localhost:5500/test-manifest.html
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('./manifests/landing-page-manifest.json'))"
```

**Option C: Using PowerShell**
```powershell
Get-Content "manifests\landing-page-manifest.json" | ConvertFrom-Json
```

### 2. Loading in Code

**TypeScript/JavaScript:**
```typescript
import { manifestLoader } from './manifest-loader';

// Get a specific manifest
const landingManifest = manifestLoader.getManifest('landing');

// Get all manifests
const allManifests = manifestLoader.getAllManifests();

// Get available page types
const pageTypes = manifestLoader.getPageTypes();

// Parse colors from manifest
const colors = manifestLoader.parseColors(landingManifest);

// Get sections
const sections = manifestLoader.getSections(landingManifest);

// Find specific section
const heroSection = manifestLoader.findSection(landingManifest, 'hero');

// Validate manifest
const validation = manifestLoader.validateManifest(landingManifest);
if (validation.valid) {
  console.log('Manifest is valid!');
} else {
  console.error('Errors:', validation.errors);
}
```

### 3. Using in Figma Plugin

The plugin can generate pages from manifests:

```typescript
// In your plugin UI, select page type
const pageType = 'manifest:landing';  // or 'manifest:dashboard'

// Plugin will automatically load and parse the manifest
// Then generate Figma frames based on specifications
```

## 🎨 Design System

All manifests share a common design system:

### Colors
- **Primary**: `#00D9B4` (Turquoise)
- **Secondary**: `#14F195` (Mint Green)
- **Background**: `#0A0E1A` (Dark)
- **Card**: `#1A1F2E`

### Typography
- **Primary Font**: Manrope
- **Fallbacks**: Inter, Roboto, system-ui

### Effects
- **Glassmorphism**: `backdrop-filter: blur(20px)`
- **Gradients**: Linear gradients from turquoise to mint
- **Glow**: Drop shadows with turquoise tint

## 📊 Manifest Statistics

### Landing Page Manifest
- **File Size**: 17.4 KB
- **Lines**: 655
- **Sections**: 8
- **Components**: 50+
- **Color Definitions**: 15+

### Dashboard Manifest
- **File Size**: 27.8 KB
- **Lines**: 948
- **Sections**: 8
- **Components**: 70+
- **Color Definitions**: 20+

## 🔧 Validation

All manifests are validated for:
- ✅ Valid JSON syntax
- ✅ Required fields present
- ✅ Sections defined
- ✅ Design system complete
- ✅ No encoding issues (UTF-8, no BOM)

## 📝 Creating New Manifests

To create a new manifest:

1. Copy an existing manifest as a template
2. Update `page_type` and `page_name`
3. Define your sections
4. Specify design system colors
5. Add component specifications
6. Validate using test-manifest.html

## 🐛 Troubleshooting

### "Manifest not loading"
- ✅ Check file path is correct
- ✅ Ensure JSON is valid (use test-manifest.html)
- ✅ Verify no CORS issues (serve from local server)
- ✅ Check console for error messages

### "Invalid JSON"
- ✅ Use JSONLint.com to validate
- ✅ Check for missing commas or brackets
- ✅ Ensure strings are properly quoted

### "Colors not rendering"
- ✅ Verify hex colors start with `#`
- ✅ Check color format is 6-digit hex
- ✅ Ensure colors are in design_system.colors

## 📚 Resources

- **JSON Validator**: https://jsonlint.com
- **Tailwind CSS**: https://tailwindcss.com
- **Figma Plugin API**: https://www.figma.com/plugin-docs/
- **Lucide Icons**: https://lucide.dev

## 🤝 Contributing

When adding new manifests:
1. Follow the existing structure
2. Include all required fields
3. Add comprehensive section definitions
4. Test with test-manifest.html
5. Update this README

## 📄 License

Part of the VATANA project. All rights reserved.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: VATANA Development Team
