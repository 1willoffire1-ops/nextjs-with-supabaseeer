# 🎨 Figma UI Creator for Vatana

Create Figma UI components directly from text prompts via the terminal!

## 🚀 Quick Start

### 1. Setup Figma API Access

1. **Get your Figma Personal Access Token**:
   - Go to [Figma Settings > Personal Access Tokens](https://www.figma.com/developers/api#access-tokens)
   - Click "Create new token"
   - Copy the token

2. **Get your Figma File Key**:
   - Open your Figma file in browser
   - Copy the file key from the URL: `https://www.figma.com/file/FILE_KEY_HERE/File-Name`

### 2. Configure Environment

Copy the Figma credentials to your `.env` file:

```bash
# Copy from .env.figma to .env or create new .env
FIGMA_TOKEN=your_actual_figma_token_here
FIGMA_FILE_KEY=your_actual_file_key_here
```

### 3. Usage

```bash
# Basic usage
node ui-prompt.js "create a login screen with email and password"

# More examples
node ui-prompt.js "make a dashboard with stats cards"
node ui-prompt.js "design a product card with buy button"
node ui-prompt.js "create a contact form"
```

## 📋 Available Templates

The system automatically detects UI patterns and creates appropriate layouts:

### 🔐 Login Screens
```bash
node ui-prompt.js "login screen"
node ui-prompt.js "sign in page with email and password"
```
**Creates**: Login frame, email/password inputs, sign-in button, forgot password link

### 📊 Dashboards
```bash
node ui-prompt.js "admin dashboard"
node ui-prompt.js "dashboard with analytics"
```
**Creates**: Header, stats cards, chart placeholders

### 🎴 Product Cards
```bash
node ui-prompt.js "product card"
node ui-prompt.js "card with title: My Product description: Amazing features"
```
**Creates**: Card layout, product info, action button

### 🔘 Button Collections
```bash
node ui-prompt.js "button: Subscribe Now"
node ui-prompt.js "button collection"
```
**Creates**: Multiple button variations (primary, secondary, outline)

### 📝 Forms
```bash
node ui-prompt.js "contact form"
node ui-prompt.js "form with name and email"
```
**Creates**: Form fields, labels, submit button

### 🎯 Custom UI
Any other prompt creates a generic UI with your text as inspiration.

## 🛠 Advanced Usage

### Custom Parameters
You can include specific details in your prompts:

```bash
# Extract titles and descriptions
node ui-prompt.js "card with title: Product Name description: This is amazing"

# Custom button text
node ui-prompt.js "button: Start Free Trial"
```

### Multiple UI Elements
Run multiple commands to build complex interfaces:

```bash
node ui-prompt.js "dashboard header"
node ui-prompt.js "stats cards for revenue"
node ui-prompt.js "user profile card"
```

## 🔧 Troubleshooting

### Common Issues

1. **"Error creating UI"**
   - Check your FIGMA_TOKEN is valid
   - Ensure FIGMA_FILE_KEY is correct
   - Verify you have edit access to the Figma file

2. **"Module not found"**
   - Run `npm install` to ensure dependencies are installed

3. **"File not found"**
   - Make sure you're running from the vatana project directory
   - Check that `figma-creator.js` exists

### Debug Mode
Add error logging by modifying the console.error lines in `figma-creator.js` to see detailed API responses.

## 📁 Files Created

- `figma-creator.js` - Core Figma API client
- `ui-prompt.js` - CLI interface and prompt parser
- `.env.figma` - Environment template
- `FIGMA_UI_CREATOR.md` - This documentation

## 🚀 Workflow Example

Here's a complete workflow for creating a landing page:

```bash
# 1. Create main layout
node ui-prompt.js "landing page header with navigation"

# 2. Add hero section
node ui-prompt.js "hero section with title: Welcome to Vatana description: Build amazing experiences"

# 3. Add feature cards
node ui-prompt.js "feature card with title: Fast Performance description: Lightning-fast load times"

# 4. Add call-to-action
node ui-prompt.js "button: Get Started Free"

# 5. Add contact form
node ui-prompt.js "contact form with name, email, and message"
```

## 🎨 Design System

The components follow these design principles:
- **Colors**: Blue primary (#3366FF), neutral grays
- **Typography**: Clean, readable fonts with proper hierarchy  
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle drop shadows for depth
- **Borders**: Rounded corners (8-12px radius)

## 💡 Tips

- **Be specific**: More detailed prompts create better results
- **Iterate**: Run multiple commands to build complex UIs
- **Check Figma**: Always verify results in your Figma file
- **Combine**: Mix different UI types for complete interfaces
- **Experiment**: Try different prompt variations

---

**Happy designing! 🎨✨**