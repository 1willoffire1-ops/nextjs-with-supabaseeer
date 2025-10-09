// VATANA Design System Generator Plugin for Figma
// Generates beautiful pages with turquoise/teal theme

// Design System Constants
const COLORS = {
  // Turquoise/Teal palette
  primary: { r: 0.078, g: 0.722, b: 0.651 },      // #14b8a6
  primaryLight: { r: 0.361, g: 0.827, b: 0.765 }, // #5cd3c3
  primaryDark: { r: 0.047, g: 0.545, b: 0.502 },  // #0c8b80
  
  // Cyan/Blue accents
  cyan: { r: 0.024, g: 0.714, b: 0.831 },         // #06b6d4
  blue: { r: 0.231, g: 0.510, b: 0.965 },         // #3b82f6
  
  // Dark backgrounds
  bgDark: { r: 0.039, g: 0.055, b: 0.102 },       // #0a0e1a
  bgDarkSecondary: { r: 0.102, g: 0.122, b: 0.208 }, // #1a1f35
  bgCard: { r: 0.125, g: 0.145, b: 0.224 },       // #202539
  
  // Neutral colors
  white: { r: 1, g: 1, b: 1 },
  gray100: { r: 0.945, g: 0.953, b: 0.965 },      // #f1f5f9
  gray300: { r: 0.804, g: 0.835, b: 0.875 },      // #cbd5e1
  gray400: { r: 0.580, g: 0.639, b: 0.722 },      // #94a3b8
  gray600: { r: 0.282, g: 0.337, b: 0.420 },      // #475569
  gray800: { r: 0.118, g: 0.149, b: 0.196 },      // #1e2632
};

const TYPOGRAPHY = {
  heading1: 48,
  heading2: 36,
  heading3: 28,
  heading4: 24,
  heading5: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
};

// Helper Functions
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0, g: 0, b: 0 };
}

function createGradient(node: SceneNode, colors: RGB[], type: 'LINEAR' | 'RADIAL' = 'LINEAR') {
  if ('fills' in node) {
    const gradient: GradientPaint = {
      type: type === 'LINEAR' ? 'GRADIENT_LINEAR' : 'GRADIENT_RADIAL',
      gradientStops: colors.map((color, i) => ({
        color: { ...color, a: 1 },
        position: i / (colors.length - 1),
      })),
      gradientTransform: type === 'LINEAR' 
        ? [[1, 0, 0], [0, 1, 0]]
        : [[1, 0, 0.5], [0, 1, 0.5]],
    };
    node.fills = [gradient];
  }
}

function createGlassEffect(node: RectangleNode) {
  // Glass background with low opacity
  const glassFill: SolidPaint = {
    type: 'SOLID',
    color: COLORS.white,
    opacity: 0.05,
  };
  
  node.fills = [glassFill];
  
  // Border
  node.strokes = [{
    type: 'SOLID',
    color: COLORS.primary,
    opacity: 0.2,
  }];
  node.strokeWeight = 1;
  
  // Effects
  node.effects = [
    {
      type: 'DROP_SHADOW',
      color: { ...COLORS.primary, a: 0.3 },
      offset: { x: 0, y: 4 },
      radius: 12,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { ...COLORS.white, a: 0.1 },
      offset: { x: 0, y: 1 },
      radius: 2,
      visible: true,
      blendMode: 'NORMAL',
    }
  ];
  
  // Rounded corners
  node.cornerRadius = 12;
}

function createText(text: string, fontSize: number, color: RGB = COLORS.white): TextNode {
  const textNode = figma.createText();
  textNode.fontName = { family: "Inter", style: "Regular" };
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fills = [{ type: 'SOLID', color }];
  return textNode;
}

async function loadFonts() {
  try {
    // Try Inter first
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    return { family: "Inter", loaded: true };
  } catch (error) {
    // Fallback to Roboto
    try {
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
      await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
      return { family: "Roboto", loaded: true };
    } catch (error2) {
      // Last resort: Figma's default font
      figma.notify('Using default font. Install Inter or Roboto for best results.', { timeout: 5000 });
      return { family: "Roboto", loaded: false };
    }
  }
}

// Component Creators
function createButton(text: string, variant: 'primary' | 'secondary' = 'primary'): FrameNode {
  const button = figma.createFrame();
  button.name = `Button - ${text}`;
  button.resize(200, 48);
  button.cornerRadius = 8;
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.paddingLeft = 24;
  button.paddingRight = 24;
  button.itemSpacing = 8;
  
  if (variant === 'primary') {
    createGradient(button, [COLORS.primary, COLORS.cyan], 'LINEAR');
    button.effects = [{
      type: 'DROP_SHADOW',
      color: { ...COLORS.primary, a: 0.5 },
      offset: { x: 0, y: 4 },
      radius: 16,
      visible: true,
      blendMode: 'NORMAL',
    }];
  } else {
    button.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
    button.strokes = [{ type: 'SOLID', color: COLORS.primary }];
    button.strokeWeight = 1;
  }
  
  const buttonText = figma.createText();
  buttonText.fontName = { family: "Inter", style: "SemiBold" };
  buttonText.characters = text;
  buttonText.fontSize = 16;
  buttonText.fills = [{ type: 'SOLID', color: COLORS.white }];
  
  button.appendChild(buttonText);
  return button;
}

function createCard(width: number, height: number, title?: string): FrameNode {
  const card = figma.createFrame();
  card.name = title || 'Card';
  card.resize(width, height);
  card.layoutMode = 'VERTICAL';
  card.primaryAxisAlignItems = 'MIN';
  card.counterAxisAlignItems = 'MIN';
  card.paddingTop = 24;
  card.paddingBottom = 24;
  card.paddingLeft = 24;
  card.paddingRight = 24;
  card.itemSpacing = 16;
  
  createGlassEffect(card as RectangleNode);
  
  if (title) {
    const titleText = figma.createText();
    titleText.fontName = { family: "Inter", style: "Bold" };
    titleText.characters = title;
    titleText.fontSize = TYPOGRAPHY.heading4;
    titleText.fills = [{ type: 'SOLID', color: COLORS.white }];
    card.appendChild(titleText);
  }
  
  return card;
}

function createStatCard(value: string, label: string, icon: string): FrameNode {
  const card = createCard(280, 140, '');
  
  const iconText = figma.createText();
  iconText.fontName = { family: "Inter", style: "Regular" };
  iconText.characters = icon;
  iconText.fontSize = 32;
  card.appendChild(iconText);
  
  const valueText = figma.createText();
  valueText.fontName = { family: "Inter", style: "Bold" };
  valueText.characters = value;
  valueText.fontSize = TYPOGRAPHY.heading2;
  createGradient(valueText, [COLORS.primary, COLORS.cyan], 'LINEAR');
  card.appendChild(valueText);
  
  const labelText = figma.createText();
  labelText.fontName = { family: "Inter", style: "Regular" };
  labelText.characters = label;
  labelText.fontSize = TYPOGRAPHY.bodySmall;
  labelText.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
  card.appendChild(labelText);
  
  return card;
}

// Page Generators
async function generateLandingPage(frame: FrameNode, options: any) {
  frame.name = '🏠 Landing Page';
  frame.resize(1440, 3000);
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.itemSpacing = 0;
  
  // Background gradient
  createGradient(frame, [COLORS.bgDark, COLORS.bgDarkSecondary], 'LINEAR');
  
  // Hero Section
  const hero = figma.createFrame();
  hero.name = 'Hero Section';
  hero.resize(1440, 700);
  hero.layoutMode = 'VERTICAL';
  hero.primaryAxisAlignItems = 'CENTER';
  hero.counterAxisAlignItems = 'CENTER';
  hero.paddingTop = 120;
  hero.paddingBottom = 80;
  hero.itemSpacing = 32;
  hero.fills = [];
  
  const heroTitle = figma.createText();
  heroTitle.fontName = { family: "Inter", style: "Bold" };
  heroTitle.characters = 'VATANA VAT Analysis Platform';
  heroTitle.fontSize = TYPOGRAPHY.heading1;
  heroTitle.textAlignHorizontal = 'CENTER';
  createGradient(heroTitle, [COLORS.primary, COLORS.cyan, COLORS.blue], 'LINEAR');
  hero.appendChild(heroTitle);
  
  const heroSubtitle = figma.createText();
  heroSubtitle.fontName = { family: "Inter", style: "Regular" };
  heroSubtitle.characters = 'Streamline VAT compliance with AI-powered analysis and automation';
  heroSubtitle.fontSize = TYPOGRAPHY.heading5;
  heroSubtitle.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
  heroSubtitle.textAlignHorizontal = 'CENTER';
  heroSubtitle.resize(700, heroSubtitle.height);
  hero.appendChild(heroSubtitle);
  
  const ctaButton = createButton('Get Started →', 'primary');
  hero.appendChild(ctaButton);
  
  frame.appendChild(hero);
  
  // Features Section
  const featuresSection = figma.createFrame();
  featuresSection.name = 'Features';
  featuresSection.resize(1440, 600);
  featuresSection.layoutMode = 'VERTICAL';
  featuresSection.primaryAxisAlignItems = 'CENTER';
  featuresSection.paddingTop = 80;
  featuresSection.paddingBottom = 80;
  featuresSection.itemSpacing = 48;
  featuresSection.fills = [];
  
  const featuresTitle = figma.createText();
  featuresTitle.fontName = { family: "Inter", style: "Bold" };
  featuresTitle.characters = 'Powerful Features';
  featuresTitle.fontSize = TYPOGRAPHY.heading2;
  featuresTitle.fills = [{ type: 'SOLID', color: COLORS.white }];
  featuresSection.appendChild(featuresTitle);
  
  // Feature cards row
  const featuresRow = figma.createFrame();
  featuresRow.name = 'Features Row';
  featuresRow.resize(1200, 200);
  featuresRow.layoutMode = 'HORIZONTAL';
  featuresRow.itemSpacing = 24;
  featuresRow.fills = [];
  
  const features = [
    { icon: '🤖', title: 'AI Analysis', desc: 'Automated VAT detection' },
    { icon: '📊', title: 'Real-time Dashboard', desc: 'Track all metrics' },
    { icon: '🔒', title: 'Secure & Compliant', desc: 'Enterprise-grade security' },
  ];
  
  for (const feature of features) {
    const card = createCard(380, 200, '');
    
    const icon = figma.createText();
    icon.fontName = { family: "Inter", style: "Regular" };
    icon.characters = feature.icon;
    icon.fontSize = 40;
    card.appendChild(icon);
    
    const title = figma.createText();
    title.fontName = { family: "Inter", style: "Bold" };
    title.characters = feature.title;
    title.fontSize = TYPOGRAPHY.heading4;
    title.fills = [{ type: 'SOLID', color: COLORS.white }];
    card.appendChild(title);
    
    const desc = figma.createText();
    desc.fontName = { family: "Inter", style: "Regular" };
    desc.characters = feature.desc;
    desc.fontSize = TYPOGRAPHY.body;
    desc.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
    card.appendChild(desc);
    
    featuresRow.appendChild(card);
  }
  
  featuresSection.appendChild(featuresRow);
  frame.appendChild(featuresSection);
  
  // Stats Section
  const statsSection = figma.createFrame();
  statsSection.name = 'Stats';
  statsSection.resize(1440, 400);
  statsSection.layoutMode = 'HORIZONTAL';
  statsSection.primaryAxisAlignItems = 'CENTER';
  statsSection.counterAxisAlignItems = 'CENTER';
  statsSection.paddingLeft = 120;
  statsSection.paddingRight = 120;
  statsSection.itemSpacing = 32;
  statsSection.fills = [];
  
  const stats = [
    { value: '10k+', label: 'Active Users', icon: '👥' },
    { value: '99.9%', label: 'Accuracy Rate', icon: '✨' },
    { value: '24/7', label: 'Support', icon: '💬' },
  ];
  
  for (const stat of stats) {
    const statCard = createStatCard(stat.value, stat.label, stat.icon);
    statsSection.appendChild(statCard);
  }
  
  frame.appendChild(statsSection);
}

async function generateDashboardPage(frame: FrameNode, options: any) {
  frame.name = '📊 Dashboard';
  frame.resize(1440, 1024);
  frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
  
  // Header
  const header = figma.createFrame();
  header.name = 'Header';
  header.resize(1440, 80);
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisAlignItems = 'CENTER';
  header.counterAxisAlignItems = 'CENTER';
  header.paddingLeft = 40;
  header.paddingRight = 40;
  header.itemSpacing = 16;
  header.fills = [{ type: 'SOLID', color: COLORS.bgCard, opacity: 0.5 }];
  header.y = 0;
  
  const logo = figma.createText();
  logo.fontName = { family: "Inter", style: "Bold" };
  logo.characters = 'VATANA';
  logo.fontSize = 24;
  createGradient(logo, [COLORS.primary, COLORS.cyan]);
  header.appendChild(logo);
  
  frame.appendChild(header);
  
  // Main content
  const content = figma.createFrame();
  content.name = 'Content';
  content.resize(1440, 944);
  content.layoutMode = 'VERTICAL';
  content.paddingTop = 40;
  content.paddingLeft = 40;
  content.paddingRight = 40;
  content.itemSpacing = 32;
  content.fills = [];
  content.y = 80;
  
  // Page title
  const pageTitle = figma.createText();
  pageTitle.fontName = { family: "Inter", style: "Bold" };
  pageTitle.characters = 'Dashboard Overview';
  pageTitle.fontSize = TYPOGRAPHY.heading2;
  pageTitle.fills = [{ type: 'SOLID', color: COLORS.white }];
  content.appendChild(pageTitle);
  
  // KPI Cards Row
  const kpiRow = figma.createFrame();
  kpiRow.name = 'KPI Cards';
  kpiRow.resize(1360, 140);
  kpiRow.layoutMode = 'HORIZONTAL';
  kpiRow.itemSpacing = 24;
  kpiRow.fills = [];
  
  const kpis = [
    { value: '€45.2K', label: 'Total VAT Processed', icon: '💰' },
    { value: '234', label: 'Documents Analyzed', icon: '📄' },
    { value: '12', label: 'Pending Reviews', icon: '⏳' },
    { value: '98%', label: 'Accuracy', icon: '✓' },
  ];
  
  for (const kpi of kpis) {
    const card = createStatCard(kpi.value, kpi.label, kpi.icon);
    card.resize(320, 140);
    kpiRow.appendChild(card);
  }
  
  content.appendChild(kpiRow);
  
  // Chart placeholder
  const chartCard = createCard(1360, 400, 'VAT Analysis Chart');
  const chartPlaceholder = figma.createRectangle();
  chartPlaceholder.resize(1312, 300);
  chartPlaceholder.fills = [{ type: 'SOLID', color: COLORS.bgDark, opacity: 0.5 }];
  chartPlaceholder.cornerRadius = 8;
  chartCard.appendChild(chartPlaceholder);
  content.appendChild(chartCard);
  
  frame.appendChild(content);
}

async function generateSettingsPage(frame: FrameNode, options: any) {
  frame.name = '⚙️ Settings';
  frame.resize(1440, 1024);
  frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
  
  // Header (same as dashboard)
  const header = figma.createFrame();
  header.name = 'Header';
  header.resize(1440, 80);
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisAlignItems = 'CENTER';
  header.paddingLeft = 40;
  header.paddingRight = 40;
  header.fills = [{ type: 'SOLID', color: COLORS.bgCard, opacity: 0.5 }];
  
  const logo = figma.createText();
  logo.fontName = { family: "Inter", style: "Bold" };
  logo.characters = 'VATANA';
  logo.fontSize = 24;
  createGradient(logo, [COLORS.primary, COLORS.cyan]);
  header.appendChild(logo);
  
  frame.appendChild(header);
  
  // Settings content
  const content = figma.createFrame();
  content.name = 'Settings Content';
  content.resize(1440, 944);
  content.layoutMode = 'HORIZONTAL';
  content.paddingTop = 40;
  content.paddingLeft = 40;
  content.paddingRight = 40;
  content.itemSpacing = 32;
  content.fills = [];
  content.y = 80;
  
  // Sidebar
  const sidebar = figma.createFrame();
  sidebar.name = 'Settings Navigation';
  sidebar.resize(280, 600);
  sidebar.layoutMode = 'VERTICAL';
  sidebar.itemSpacing = 8;
  sidebar.fills = [];
  
  const menuItems = ['Profile', 'Notifications', 'Security', 'Billing', 'API Keys', 'Team'];
  for (const item of menuItems) {
    const menuItem = figma.createFrame();
    menuItem.name = item;
    menuItem.resize(280, 48);
    menuItem.layoutMode = 'HORIZONTAL';
    menuItem.primaryAxisAlignItems = 'CENTER';
    menuItem.paddingLeft = 16;
    menuItem.cornerRadius = 8;
    menuItem.fills = item === 'Profile' 
      ? [{ type: 'SOLID', color: COLORS.primary, opacity: 0.1 }]
      : [];
    
    const text = figma.createText();
    text.fontName = { family: "Inter", style: item === 'Profile' ? "SemiBold" : "Regular" };
    text.characters = item;
    text.fontSize = TYPOGRAPHY.body;
    text.fills = [{ type: 'SOLID', color: item === 'Profile' ? COLORS.primary : COLORS.gray300 }];
    
    menuItem.appendChild(text);
    sidebar.appendChild(menuItem);
  }
  
  content.appendChild(sidebar);
  
  // Settings panel
  const panel = createCard(1048, 600, 'Profile Settings');
  
  const description = figma.createText();
  description.fontName = { family: "Inter", style: "Regular" };
  description.characters = 'Manage your account settings and preferences';
  description.fontSize = TYPOGRAPHY.bodySmall;
  description.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
  panel.appendChild(description);
  
  // Form fields placeholder
  const formFields = ['Full Name', 'Email Address', 'Company', 'Role'];
  for (const field of formFields) {
    const fieldFrame = figma.createFrame();
    fieldFrame.name = field;
    fieldFrame.resize(1000, 80);
    fieldFrame.layoutMode = 'VERTICAL';
    fieldFrame.itemSpacing = 8;
    fieldFrame.fills = [];
    
    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Medium" };
    label.characters = field;
    label.fontSize = TYPOGRAPHY.bodySmall;
    label.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    fieldFrame.appendChild(label);
    
    const input = figma.createRectangle();
    input.resize(1000, 48);
    input.fills = [{ type: 'SOLID', color: COLORS.bgDark, opacity: 0.5 }];
    input.strokes = [{ type: 'SOLID', color: COLORS.gray600 }];
    input.strokeWeight = 1;
    input.cornerRadius = 8;
    fieldFrame.appendChild(input);
    
    panel.appendChild(fieldFrame);
  }
  
  const saveButton = createButton('Save Changes', 'primary');
  panel.appendChild(saveButton);
  
  content.appendChild(panel);
  frame.appendChild(content);
}

async function generateTeamPage(frame: FrameNode, options: any) {
  frame.name = '👥 Team Management';
  frame.resize(1440, 1024);
  frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
  
  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Bold" };
  title.characters = 'Team Management';
  title.fontSize = TYPOGRAPHY.heading2;
  title.fills = [{ type: 'SOLID', color: COLORS.white }];
  title.x = 40;
  title.y = 40;
  frame.appendChild(title);
  
  const teamCard = createCard(1360, 600, 'Team Members');
  teamCard.x = 40;
  teamCard.y = 120;
  frame.appendChild(teamCard);
}

async function generateComponentLibrary(frame: FrameNode, options: any) {
  frame.name = '🧩 Component Library';
  frame.resize(1440, 2000);
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.paddingTop = 40;
  frame.paddingLeft = 40;
  frame.paddingRight = 40;
  frame.itemSpacing = 48;
  frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
  
  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Bold" };
  title.characters = 'VATANA Component Library';
  title.fontSize = TYPOGRAPHY.heading2;
  title.fills = [{ type: 'SOLID', color: COLORS.white }];
  frame.appendChild(title);
  
  // Buttons section
  const buttonsSection = figma.createFrame();
  buttonsSection.name = 'Buttons';
  buttonsSection.resize(1360, 200);
  buttonsSection.layoutMode = 'VERTICAL';
  buttonsSection.itemSpacing = 24;
  buttonsSection.fills = [];
  
  const btnTitle = figma.createText();
  btnTitle.fontName = { family: "Inter", style: "Bold" };
  btnTitle.characters = 'Buttons';
  btnTitle.fontSize = TYPOGRAPHY.heading4;
  btnTitle.fills = [{ type: 'SOLID', color: COLORS.primary }];
  buttonsSection.appendChild(btnTitle);
  
  const btnRow = figma.createFrame();
  btnRow.layoutMode = 'HORIZONTAL';
  btnRow.itemSpacing = 16;
  btnRow.fills = [];
  btnRow.resize(1360, 48);
  
  btnRow.appendChild(createButton('Primary Button', 'primary'));
  btnRow.appendChild(createButton('Secondary Button', 'secondary'));
  
  buttonsSection.appendChild(btnRow);
  frame.appendChild(buttonsSection);
  
  // Cards section
  const cardsSection = figma.createFrame();
  cardsSection.name = 'Cards';
  cardsSection.resize(1360, 400);
  cardsSection.layoutMode = 'VERTICAL';
  cardsSection.itemSpacing = 24;
  cardsSection.fills = [];
  
  const cardTitle = figma.createText();
  cardTitle.fontName = { family: "Inter", style: "Bold" };
  cardTitle.characters = 'Cards';
  cardTitle.fontSize = TYPOGRAPHY.heading4;
  cardTitle.fills = [{ type: 'SOLID', color: COLORS.primary }];
  cardsSection.appendChild(cardTitle);
  
  const cardRow = figma.createFrame();
  cardRow.layoutMode = 'HORIZONTAL';
  cardRow.itemSpacing = 24;
  cardRow.fills = [];
  cardRow.resize(1360, 300);
  
  cardRow.appendChild(createCard(420, 280, 'Glass Card'));
  cardRow.appendChild(createStatCard('2.5K', 'Sample Stat', '📊'));
  cardRow.appendChild(createCard(420, 280, 'Another Card'));
  
  cardsSection.appendChild(cardRow);
  frame.appendChild(cardsSection);
}

// Main plugin logic
figma.showUI(__html__, { width: 420, height: 680 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    try {
      await loadFonts();
      
      const pages = msg.pages;
      const options = msg.options;
      let createdCount = 0;
      
      for (const pageName of pages) {
        const frame = figma.createFrame();
        frame.x = createdCount * 1500;
        frame.y = 0;
        
        switch (pageName) {
          case 'landing':
            await generateLandingPage(frame, options);
            break;
          case 'dashboard':
            await generateDashboardPage(frame, options);
            break;
          case 'settings':
            await generateSettingsPage(frame, options);
            break;
          case 'team':
            await generateTeamPage(frame, options);
            break;
          case 'components':
            await generateComponentLibrary(frame, options);
            break;
        }
        
        figma.currentPage.appendChild(frame);
        createdCount++;
      }
      
      figma.viewport.scrollAndZoomIntoView([figma.currentPage.children[figma.currentPage.children.length - createdCount]]);
      
      figma.ui.postMessage({ type: 'complete', count: createdCount });
      
    } catch (error) {
      console.error('Error generating pages:', error);
      figma.ui.postMessage({ type: 'error', message: error.message });
    }
  }
};
