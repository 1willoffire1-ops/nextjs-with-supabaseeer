# VATANA PWA Icons

This directory contains all the icons required for the VATANA Progressive Web App.

## Required Icon Sizes

### Standard Icons
- ✅ `icon-96x96.png` - Badge/notification icon
- ✅ `icon-192x192.png` - Standard app icon (Android, Chrome)
- ✅ `icon-512x512.png` - High-resolution app icon (splash screens)

### Maskable Icons (for adaptive icons on Android)
- ✅ `icon-maskable-192x192.png` - Maskable standard size
- ✅ `icon-maskable-512x512.png` - Maskable high-res

### Apple Touch Icons (iOS)
- ✅ `apple-touch-icon.png` - 180x180px (iOS home screen)

### Favicon (Optional but recommended)
- ✅ `favicon.ico` - 32x32px (browser tab icon)

## Design Guidelines

### Standard Icons
- Use the full canvas area
- Include your logo/branding with padding
- Background color: `#2563eb` (VATANA blue) or white
- Ensure logo is clearly visible at small sizes

### Maskable Icons
⚠️ **Important**: Maskable icons must follow the safe zone guidelines:
- **Safe zone**: 40% of the icon (center circle)
- **Minimum safe zone**: 80% of the icon
- All important content (logo, text) must be within the safe zone
- Background must fill the entire canvas (512x512)

**Example structure for 512x512 maskable:**
```
┌────────────────────────────────┐
│        Padding (10%)           │  ← Can be cropped by OS
│   ┌────────────────────┐       │
│   │   Safe Zone (80%)  │       │  ← Logo goes here
│   │                    │       │
│   │     VATANA Logo    │       │
│   │                    │       │
│   └────────────────────┘       │
│        Padding (10%)           │
└────────────────────────────────┘
```

## Generation Tools

### Option 1: Online Generators (Easiest)

#### PWABuilder Image Generator
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 PNG source image
3. Select all platforms (iOS, Android, Windows)
4. Download and extract to this directory

#### RealFaviconGenerator
1. Visit: https://realfavicongenerator.net/
2. Upload your source image (at least 512x512)
3. Customize for each platform
4. Download the favicon package
5. Extract relevant files to this directory

### Option 2: Manual Generation (Using ImageMagick)

If you have ImageMagick installed:

```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# From a 1024x1024 source image (source.png):

# Standard icons
magick source.png -resize 96x96 icon-96x96.png
magick source.png -resize 192x192 icon-192x192.png
magick source.png -resize 512x512 icon-512x512.png

# Maskable icons (add padding for safe zone)
magick source.png -resize 410x410 -gravity center -extent 512x512 -background "#2563eb" icon-maskable-512x512.png
magick source.png -resize 154x154 -gravity center -extent 192x192 -background "#2563eb" icon-maskable-192x192.png

# Apple touch icon
magick source.png -resize 180x180 apple-touch-icon.png

# Favicon
magick source.png -resize 32x32 favicon.ico
```

### Option 3: Using Figma/Sketch/Adobe XD

1. Create a 1024x1024 artboard
2. Design your icon with VATANA branding
3. Export at each required size
4. For maskable icons: Add 10% padding around the logo

## Color Scheme

Use VATANA brand colors:
- **Primary Blue**: `#2563eb`
- **Dark Blue**: `#1e40af`
- **White**: `#ffffff`
- **Gray**: `#6b7280`

## Current Status

📋 **Icon Checklist:**
- ⏳ icon-96x96.png (pending)
- ⏳ icon-192x192.png (pending)
- ⏳ icon-512x512.png (pending)
- ⏳ icon-maskable-192x192.png (pending)
- ⏳ icon-maskable-512x512.png (pending)
- ⏳ apple-touch-icon.png (pending)
- ⏳ favicon.ico (optional)

## Quick Start

**Fastest way to get started:**

1. Create a simple logo design at 1024x1024:
   - White or colored background
   - "VATANA" text or "V" logo
   - Use VATANA blue (#2563eb)

2. Use PWABuilder Image Generator:
   - Upload your 1024x1024 image
   - Download the generated package
   - Copy all files here

3. Update `public/manifest.json` if needed

## Validation

After adding your icons, test them:

1. **Local testing:**
   ```bash
   pnpm build
   pnpm start
   ```

2. **Chrome DevTools:**
   - Open DevTools → Application → Manifest
   - Check if all icons are loading
   - Look for warnings

3. **Lighthouse PWA Audit:**
   - DevTools → Lighthouse
   - Run PWA audit
   - Should score 100 if icons are correct

## References

- [PWA Icon Requirements](https://web.dev/add-manifest/#icons)
- [Maskable Icons Guide](https://web.dev/maskable-icon/)
- [Apple Touch Icon Specs](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Favicon Best Practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons)

## Need Help?

If you need assistance creating icons:
1. Provide a source image (SVG or high-res PNG)
2. Specify your preferred style (flat, gradient, etc.)
3. Ask the AI agent: "Generate PWA icons for VATANA"

---

**Note**: Until icons are generated, the PWA will still work but may show placeholder icons or warnings in DevTools.
