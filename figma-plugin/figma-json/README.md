# Figma-Compatible JSON Files

These JSON files are specifically formatted to work with the "JSON to Figma" plugin and other Figma import tools.

## 📁 Files

- **`landing-page-figma.json`** - Landing page with Header, Hero, Features, and Stats sections

## 🎯 What's the Difference?

### Manifest Files (in `/manifests`)
- **Purpose**: Documentation and specifications
- **Format**: Custom structure with design system, sections, animations, etc.
- **Use**: AI generation, documentation, developer reference
- **Cannot be imported into Figma directly**

### Figma JSON Files (in `/figma-json`)
- **Purpose**: Direct import into Figma
- **Format**: Figma node tree structure (FRAME, TEXT, etc.)
- **Use**: Import with "JSON to Figma" plugin
- **Creates actual Figma layers**

## 🚀 How to Use with "JSON to Figma" Plugin

### Step 1: Install Plugin
1. Open Figma
2. Go to **Plugins** → **Browse plugins in Community**
3. Search for **"JSON to Figma"**
4. Click **Install**

### Step 2: Import JSON
1. Open Figma file
2. Run **Plugins** → **JSON to Figma**
3. Click **"Choose File"** or paste JSON
4. Select `landing-page-figma.json`
5. Click **Import**

### Step 3: Result
You'll get a complete Figma frame with:
- ✅ Header section with logo and navigation
- ✅ Hero section with headlines and CTAs
- ✅ Features section with 3 feature cards
- ✅ Stats section with 3 stat cards
- ✅ All text, colors, and styling applied

## 📋 JSON Structure

The JSON follows Figma's node structure:

```json
{
  "name": "Frame Name",
  "type": "FRAME",              // or "TEXT", "RECTANGLE", etc.
  "width": 1440,
  "height": 800,
  "x": 0,
  "y": 0,
  "backgroundColor": {
    "r": 0.039,
    "g": 0.055,
    "b": 0.102,
    "a": 1
  },
  "children": [                 // Nested elements
    {
      "name": "Child Element",
      "type": "TEXT",
      "characters": "Text content",
      "fontSize": 24,
      "fontName": {
        "family": "Manrope",
        "style": "Bold"
      }
    }
  ]
}
```

## 🎨 Supported Properties

### Frame Properties
- `name` - Layer name
- `type` - `"FRAME"`
- `width`, `height` - Dimensions
- `x`, `y` - Position
- `backgroundColor` - Fill color (r, g, b, a)
- `cornerRadius` - Rounded corners
- `strokeWeight` - Border thickness
- `strokes` - Border colors
- `children` - Child elements

### Text Properties
- `type` - `"TEXT"`
- `characters` - Text content
- `fontSize` - Font size in pixels
- `fontName` - `{ family, style }`
- `textAlignHorizontal` - `"LEFT"`, `"CENTER"`, `"RIGHT"`
- `lineHeight` - Line height settings
- `fills` - Text color

## 🎭 Colors in Figma JSON

Colors use 0-1 range (not 0-255):

```json
{
  "r": 0.078,    // Red: 20/255
  "g": 0.722,    // Green: 184/255
  "b": 0.651,    // Blue: 166/255
  "a": 1         // Alpha: 1 (fully opaque)
}
```

### VATANA Color Palette
- **Primary Turquoise**: `{ r: 0.078, g: 0.722, b: 0.651 }` (#14B8A6)
- **Blue**: `{ r: 0.231, g: 0.510, b: 0.965 }` (#3B82F6)
- **Dark BG**: `{ r: 0.039, g: 0.055, b: 0.102 }` (#0A0E1A)
- **Card BG**: `{ r: 0.125, g: 0.145, b: 0.224 }` (#202539)
- **White**: `{ r: 1, g: 1, b: 1 }` (#FFFFFF)
- **Gray**: `{ r: 0.580, g: 0.639, b: 0.722 }` (#94A3B8)

## ⚠️ Important Notes

### Font Requirements
The JSON uses **Manrope** font:
- Make sure Manrope is installed in Figma
- If not available, Figma will prompt you to substitute

### Text Width
Text elements don't have explicit `width` property:
- Text auto-sizes based on content
- Use `textAlignHorizontal` for alignment

### Positioning
- All positions (`x`, `y`) are relative to parent
- Root frame starts at (0, 0)

## 🐛 Troubleshooting

### "Check the structure" Error
✅ **Fixed!** The files in this folder are correctly formatted.

**If you still get errors:**
1. Make sure you're using files from `/figma-json` folder
2. Don't use files from `/manifests` (those are documentation only)
3. Verify the plugin is "JSON to Figma" (not another JSON plugin)

### Font Not Found
- Install Manrope font in Figma
- Or accept Figma's font substitution

### Colors Look Wrong
- Make sure colors are in 0-1 range (not 0-255)
- Check alpha channel is included

### Elements Not Positioning Correctly
- Verify parent-child relationships
- Check x, y coordinates are correct
- Make sure parent frame has proper dimensions

## 📚 Creating Your Own Figma JSON

### 1. Export from Figma
```javascript
// Select a frame in Figma
// Run this in Figma console:
console.log(JSON.stringify(figma.currentPage.selection[0], null, 2));
```

### 2. Manual Creation
Follow the structure shown in the example files:
- Start with a root FRAME
- Add children as nested objects
- Use proper Figma property names
- Keep colors in 0-1 range

### 3. Validation
Before importing:
- Check JSON is valid (use jsonlint.com)
- Verify all `type` values are valid Figma types
- Ensure font families exist
- Check color values are 0-1 range

## 🔗 Resources

- **JSON to Figma Plugin**: https://www.figma.com/community/plugin/789839703871161985
- **Figma API Docs**: https://www.figma.com/plugin-docs/
- **VATANA Manifests**: `../manifests/` (for specifications)

---

**Quick Tip**: If you want to create more complex layouts, export an existing Figma frame as JSON (using the plugin or Figma API) and use it as a template! 🚀
