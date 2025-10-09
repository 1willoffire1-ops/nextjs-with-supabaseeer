# 🎨 VATANA Figma Page Creator - Setup Guide

Create full interactive pages in Figma with your turquoise design system!

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Figma Access Token

1. Go to [Figma Settings → Personal Access Tokens](https://www.figma.com/settings)
2. Scroll down to "Personal access tokens"
3. Click "Create new token"
4. Name it "VATANA Creator"
5. Click "Create token"
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Get Your Figma File Key

1. Create a new Figma file or open an existing one
2. Look at the URL in your browser:
   ```
   https://www.figma.com/file/ABC123DEF456/My-File-Name
                             ^^^^^^^^^^^^
                             This is your file key!
   ```
3. Copy the file key (the part between `/file/` and the next `/`)

### Step 3: Add to .env File

Add these lines to your `.env` file:

```bash
# Figma API Credentials
FIGMA_TOKEN=figd_your_actual_token_here
FIGMA_FILE_KEY=ABC123DEF456
```

### Step 4: Install Dependencies (if needed)

```bash
npm install axios dotenv
```

## 🎯 Usage

### Create Full Pages in Figma

```bash
# Create Dashboard page
node create-figma-page.js dashboard

# Create Settings page
node create-figma-page.js settings

# Create Landing page
node create-figma-page.js landing
```

### What Gets Created:

#### 📊 Dashboard Page
- ✅ Full page layout (1440x1024px)
- ✅ Glass cards with turquoise borders
- ✅ Sidebar with navigation
- ✅ 3 stat cards (VAT Saved, Compliance Score, Integrations)
- ✅ Header with export button
- ✅ Main content area
- ✅ All using VATANA design system colors

#### ⚙️ Settings Page
- ✅ Full settings layout (1440x1200px)
- ✅ Tab navigation (Team, Knowledge, Integrations, Compliance, Mobile)
- ✅ Glass card content area
- ✅ "Invite Member" button
- ✅ Professional spacing and typography

#### 🏠 Landing Page
- ✅ Complete landing page (1440x3000px)
- ✅ Hero section with gradient orbs
- ✅ Headlines with turquoise gradient
- ✅ Primary + glass buttons
- ✅ 6 feature cards in grid
- ✅ CTA section at bottom

## 🎨 Design System Features

All pages automatically use:

### Colors
- Deep Navy Background (#0A0E1A)
- Turquoise Primary (#00D9B4)
- Mint Green Accent (#14F195)
- Professional text hierarchy

### Components
- **Glass Cards**: Frosted glass effect with turquoise border
- **Primary Buttons**: Turquoise gradient with glow shadow
- **Typography**: Proper h1/h2/h3/body/small hierarchy
- **Navigation**: Active/inactive states
- **Stat Cards**: Value, label, and change indicator

### Effects
- Drop shadows
- Inner shadows for depth
- Turquoise glows on buttons
- Border accents

## 📋 Checklist Before Running

- [ ] Figma token added to `.env`
- [ ] File key added to `.env`
- [ ] `npm install` completed
- [ ] Have edit access to the Figma file

## 🔧 Troubleshooting

### Error: "Missing Figma credentials"
**Solution**: Make sure `FIGMA_TOKEN` and `FIGMA_FILE_KEY` are in your `.env` file

### Error: "403 Forbidden"
**Solution**: 
- Check your token is valid
- Make sure you have edit access to the Figma file
- Token might be expired - create a new one

### Error: "404 Not Found"
**Solution**: Double-check your `FIGMA_FILE_KEY` is correct from the Figma URL

### Nothing shows up in Figma
**Solution**:
- Refresh your Figma file (Cmd/Ctrl + R)
- Check the layers panel on the left
- Look for frames named like "📊 Dashboard - VATANA"

## 💡 Pro Tips

1. **Organize Pages**: Create pages run in separate Figma pages for better organization

2. **Customize Before Running**: Edit the script to change:
   - Page dimensions
   - Content text
   - Component positions
   - Colors (though they match your design system)

3. **Iterate**: Run the script multiple times with different content to build variations

4. **Combine**: Create all three pages, then mix and match components in Figma

5. **Export**: Once in Figma, you can:
   - Export as PNG/SVG for mockups
   - Share with stakeholders
   - Iterate on the designs
   - Generate dev-ready assets

## 🎨 Customization

Want to create a custom page? Edit `create-figma-page.js`:

```javascript
// Add a new method
async createCustomPage() {
  console.log('Creating Custom Page...');
  
  const nodes = [
    {
      type: 'FRAME',
      name: 'My Custom Page',
      // ... your page structure
    }
  ];
  
  return await this.createNodes(nodes);
}

// Add to switch statement in main()
case 'custom':
  result = await creator.createCustomPage();
  break;
```

## 📚 Component Reference

### Available Helper Methods:

```javascript
// Glass card with turquoise border
createGlassCard(name, x, y, width, height, children)

// Primary button with glow
createPrimaryButton(text, x, y, width, height)

// Text element with typography scale
createText(text, x, y, style, color)
// Styles: 'h1', 'h2', 'h3', 'body', 'small'
// Colors: 'foreground', 'foregroundSecondary', 'foregroundTertiary', 'primary', 'success', 'error'

// Stat card (label, value, change indicator)
createStatCard(label, value, change, x, y)

// Navigation item
createNavItem(icon, label, x, y, isActive)
```

## ✨ Next Steps

After creating pages in Figma:

1. **Refine the designs** - Add more details, adjust spacing
2. **Create components** - Turn repeating elements into Figma components
3. **Add interactions** - Use Figma prototyping for clickable demos
4. **Export assets** - Generate icons, images for development
5. **Hand off to dev** - Use Figma's dev mode for specs

---

**Questions?** Check the code in `create-figma-page.js` - it's well-commented!

**Happy designing! 🎨✨**
