# 🎨 VATANA Design System Generator - Figma Plugin

Generate beautiful, production-ready pages with your turquoise design system directly in Figma!

## ✨ Features

- **🏠 Landing Page**: Hero section, features, stats, and CTA
- **📊 Dashboard**: KPI cards, charts, and analytics layouts
- **⚙️ Settings**: Profile management, form fields, navigation
- **👥 Team Management**: Team member layouts
- **🧩 Component Library**: Reusable UI components (buttons, cards, etc.)

All with your signature turquoise/teal design system featuring:
- Gradient backgrounds and text
- Glassmorphism effects
- Smooth animations
- Professional typography
- Consistent spacing and layout

## 📦 Installation

### Step 1: Open Figma Desktop App

Make sure you're using the **Figma Desktop App** (not the browser version) for the best plugin development experience.

### Step 2: Import the Plugin

1. Open Figma Desktop
2. Go to **Menu** (top-left) → **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to this folder: `D:\buildvatana\vatana\figma-plugin`
4. Select the `manifest.json` file
5. Click **Open**

### Step 3: Verify Installation

1. Go to **Menu** → **Plugins** → **Development**
2. You should see **"VATANA Design System Generator"** in the list

## 🚀 Usage

### Running the Plugin

1. Create a new file or open an existing one in Figma
2. Go to **Menu** → **Plugins** → **Development** → **VATANA Design System Generator**
3. The plugin interface will appear!

### Generating Pages

1. **Select Pages**: Check the pages you want to generate:
   - 🏠 Landing Page
   - 📊 Dashboard
   - ⚙️ Settings
   - 👥 Team Management
   - 🧩 Component Library

2. **Choose Options**:
   - ✅ Include sample content (recommended)
   - ✅ Add design annotations (optional)

3. **Click "Generate Selected Pages"**

4. Watch as your pages are created with the full design system!

### What Gets Generated

Each page includes:
- **Proper spacing and layout** using auto-layout
- **Turquoise gradient colors** (#14b8a6, #06b6d4, #3b82f6)
- **Glass-effect cards** with backdrop blur
- **Professional typography** using Inter font
- **Interactive components** (buttons, cards, forms)
- **Sample content** to visualize the design

## 🎨 Design System

### Colors

```
Primary: #14b8a6 (Turquoise)
Cyan: #06b6d4
Blue: #3b82f6
Background Dark: #0a0e1a
Background Card: #202539
```

### Typography

- **Heading 1**: 48px Bold
- **Heading 2**: 36px Bold
- **Heading 3**: 28px Bold
- **Heading 4**: 24px Bold
- **Body**: 16px Regular
- **Small**: 14px Regular

### Effects

- **Glass Cards**: White 5% opacity with turquoise border
- **Gradients**: Linear gradients from turquoise to cyan
- **Shadows**: Soft glows with turquoise tint
- **Corner Radius**: 8-12px

## 📝 Customization

### Modifying Colors

Edit `code.ts` and change the `COLORS` object:

```typescript
const COLORS = {
  primary: { r: 0.078, g: 0.722, b: 0.651 },  // Your color here
  // ... other colors
};
```

Then recompile:

```bash
cd D:\buildvatana\vatana\figma-plugin
npx tsc code.ts --target ES2017 --lib ES2017,DOM --skipLibCheck
```

### Adding New Pages

1. Create a new function in `code.ts`:
```typescript
async function generateMyPage(frame: FrameNode, options: any) {
  frame.name = '📄 My Page';
  // ... your page code
}
```

2. Add it to the switch statement in the message handler
3. Add a checkbox in `ui.html`
4. Recompile

## 🔧 Troubleshooting

### Plugin doesn't appear

- Make sure you're using Figma Desktop (not browser)
- Try **Menu** → **Plugins** → **Development** → **Reload** → Select the plugin

### Fonts not loading

- The plugin uses "Inter" font family
- Make sure Inter is installed in Figma or on your system
- You can change fonts in `code.ts` in the `loadFonts()` function

### Changes not reflecting

After editing `code.ts` or `ui.html`:

1. Recompile if you edited TypeScript:
   ```bash
   npx tsc code.ts --target ES2017 --lib ES2017,DOM --skipLibCheck
   ```

2. In Figma: **Menu** → **Plugins** → **Development** → Find your plugin → Click the **↻** icon

### Type errors during compilation

This is normal! Figma provides types at runtime. The `code.js` file will still be generated and work perfectly.

## 📁 File Structure

```
figma-plugin/
├── manifest.json    # Plugin configuration
├── ui.html          # Plugin interface
├── code.ts          # Main plugin logic (TypeScript)
├── code.js          # Compiled JavaScript (generated)
└── README.md        # This file
```

## 🎯 Tips & Best Practices

1. **Start with Components**: Generate the Component Library first to see all available UI elements

2. **Iterate Quickly**: Make changes to `code.ts`, recompile, and reload the plugin in Figma

3. **Use Auto-Layout**: All generated frames use Auto-Layout for easy resizing

4. **Create Styles**: After generating, you can create Figma styles from the colors and text for reusability

5. **Convert to Components**: Turn repeated elements into Figma components for better workflow

6. **Export Assets**: Use File → Export to get images of your designs

## 🚀 Next Steps

1. **Generate your pages** using the plugin
2. **Customize layouts** in Figma using the generated base
3. **Create components** from repeated elements
4. **Export designs** to share with your team
5. **Implement in React** using the same design system

## 💡 Pro Tips

- **Batch Generate**: Select all pages at once for a complete design system
- **Duplicate & Modify**: Use generated pages as templates
- **Style Guide**: Use the Component Library page as your style guide reference
- **Responsive**: All frames use auto-layout, making them easy to resize
- **Prototyping**: Connect pages together for interactive prototypes

## 📞 Support

If you encounter issues:

1. Check this README for troubleshooting steps
2. Verify all files are in the correct locations
3. Ensure Figma Desktop is up to date
4. Try reimporting the plugin from manifest

## 🎉 Enjoy!

You now have a powerful Figma plugin that generates your entire VATANA design system at the click of a button! Use it to:
- Quickly prototype new pages
- Maintain design consistency
- Share designs with stakeholders
- Speed up your design workflow

Happy designing! 🚀✨
