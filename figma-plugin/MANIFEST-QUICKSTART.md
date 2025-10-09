# 🚀 Manifest System Quick Start

This guide will get you up and running with the VATANA manifest system in 5 minutes.

## What You Have

✅ **2 Complete Manifests**
- `manifests/landing-page-manifest.json` - Landing page specs
- `manifests/dashboard-manifest.json` - Dashboard specs

✅ **Loader System**
- `manifest-loader.ts` - TypeScript loader utility
- Automatic JSON parsing and validation

✅ **Testing Tools**
- `test-manifest.html` - Interactive manifest validator
- `manifests/README.md` - Complete documentation

## Quick Test (30 seconds)

### Option 1: Open HTML Tester
1. Double-click `test-manifest.html`
2. Click "Load Landing Page Manifest"
3. See ✅ if valid, ❌ if errors

### Option 2: Command Line
```bash
# PowerShell
Get-Content "manifests\landing-page-manifest.json" | ConvertFrom-Json

# Node.js
node -e "console.log(require('./manifests/landing-page-manifest.json'))"
```

## Using in Your Code (2 minutes)

### 1. Import the Loader
```typescript
import { manifestLoader } from './manifest-loader';
```

### 2. Load a Manifest
```typescript
// Get landing page manifest
const landingManifest = manifestLoader.getManifest('landing');

// Get dashboard manifest
const dashboardManifest = manifestLoader.getManifest('dashboard');

// Get all manifests
const allManifests = manifestLoader.getAllManifests();
```

### 3. Access Data
```typescript
// Get page metadata
const meta = manifestLoader.getMetadata(landingManifest);
console.log(meta.pageName);  // "VATANA Landing Page"
console.log(meta.sectionCount);  // 8

// Get sections
const sections = manifestLoader.getSections(landingManifest);
sections.forEach(section => {
  console.log(`${section.name} (${section.type})`);
});

// Find specific section
const heroSection = manifestLoader.findSection(landingManifest, 'hero');
console.log(heroSection.content.headline.text);

// Parse colors
const colors = manifestLoader.parseColors(landingManifest);
const primary = colors.get('primary');  // { r: 0.078, g: 0.722, b: 0.651 }
```

### 4. Validate
```typescript
const validation = manifestLoader.validateManifest(landingManifest);
if (validation.valid) {
  console.log('✅ Manifest is valid!');
} else {
  console.error('❌ Errors:', validation.errors);
}
```

## Using in Figma Plugin (1 minute)

The plugin already has manifest support built-in!

### In UI:
```typescript
// Send message with manifest page type
figma.ui.postMessage({
  type: 'generate',
  pages: ['manifest:landing']  // or 'manifest:dashboard'
});
```

### The Plugin Will:
1. Load the manifest JSON
2. Parse colors and sections
3. Generate a Figma frame scaffold
4. Add metadata text nodes

## Manifest Structure Cheat Sheet

```json
{
  "page_type": "landing",           // Page identifier
  "page_name": "VATANA Landing",    // Display name
  "version": "1.0.0",               // Version number
  
  "design_system": {
    "colors": {
      "primary": "#00D9B4",         // Hex colors
      "background": { ... }
    },
    "typography": { ... },
    "spacing": { ... }
  },
  
  "sections": [                     // Array of page sections
    {
      "id": "navbar",               // Unique section ID
      "name": "Navigation Bar",     // Display name
      "type": "fixed_header",       // Section type
      "content": { ... }            // Section data
    }
  ]
}
```

## Common Tasks

### Get All Page Types
```typescript
const pageTypes = manifestLoader.getPageTypes();
// ['landing', 'dashboard']
```

### Get Sections by Type
```typescript
const grids = manifestLoader.getSectionsByType(landingManifest, 'grid');
// Returns all grid-type sections
```

### Access Nested Data
```typescript
const manifest = manifestLoader.getManifest('landing');

// Access hero content
const hero = manifestLoader.findSection(manifest, 'hero');
const headline = hero.content.headline.text;
const subheadline = hero.content.subheadline.text;

// Access button styles
const buttons = hero.content.cta_buttons;
buttons.forEach(btn => {
  console.log(`${btn.text}: ${btn.variant}`);
});
```

## Testing Your Own Manifests

### 1. Create New Manifest
```bash
# Copy existing as template
cp manifests/landing-page-manifest.json manifests/my-page-manifest.json
```

### 2. Edit Properties
```json
{
  "page_type": "my-page",
  "page_name": "My Custom Page",
  "sections": [ ... ]
}
```

### 3. Register in Loader
```typescript
// In manifest-loader.ts, add to loadManifests():
import myPageManifest from './manifests/my-page-manifest.json';

private loadManifests() {
  this.manifests.set('landing', landingManifest);
  this.manifests.set('dashboard', dashboardManifest);
  this.manifests.set('my-page', myPageManifest);  // Add this
}
```

### 4. Test
```typescript
const myManifest = manifestLoader.getManifest('my-page');
const validation = manifestLoader.validateManifest(myManifest);
```

## Troubleshooting

### ❌ "Cannot find module"
- Check import path is correct
- Ensure JSON files exist in `manifests/` folder
- Run `npm install` if needed

### ❌ "Invalid JSON"
- Validate at jsonlint.com
- Check for missing commas
- Ensure all strings are quoted

### ❌ "Manifest not loading in browser"
- Use a local server: `npx serve . -l 5500`
- CORS blocks file:// access
- Or use file upload in test-manifest.html

## Next Steps

1. ✅ Read `manifests/README.md` for full documentation
2. ✅ Explore existing manifests to see structure
3. ✅ Create your own manifest for custom pages
4. ✅ Extend the Figma plugin generator functions

## Support

- 📖 Full docs: `manifests/README.md`
- 🧪 Test tool: `test-manifest.html`
- 💡 Examples: Check `landing-page-manifest.json`

---

**Ready to build?** Start by opening `test-manifest.html` and exploring the manifests! 🚀
