#!/usr/bin/env node

/**
 * VATANA Figma Page Creator
 * Creates complete pages with turquoise design system in Figma
 * 
 * Usage: node create-figma-page.js "dashboard" or "settings" or "landing"
 */

require('dotenv').config();
const axios = require('axios');

// VATANA Turquoise Design System
const DESIGN_SYSTEM = {
  colors: {
    background: { r: 0.039, g: 0.055, b: 0.102, a: 1 }, // #0A0E1A
    backgroundSecondary: { r: 0.059, g: 0.078, b: 0.098, a: 1 }, // #0F1419
    backgroundTertiary: { r: 0.102, g: 0.122, b: 0.18, a: 1 }, // #1A1F2E
    primary: { r: 0, g: 0.851, b: 0.706, a: 1 }, // #00D9B4
    primaryLight: { r: 0.078, g: 0.945, b: 0.584, a: 1 }, // #14F195
    foreground: { r: 0.973, g: 0.98, b: 0.988, a: 1 }, // #F8FAFC
    foregroundSecondary: { r: 0.796, g: 0.835, b: 0.882, a: 1 }, // #CBD5E1
    foregroundTertiary: { r: 0.58, g: 0.639, b: 0.722, a: 1 }, // #94A3B8
    success: { r: 0.078, g: 0.945, b: 0.584, a: 1 }, // #14F195
    warning: { r: 1, g: 0.722, b: 0, a: 1 }, // #FFB800
    error: { r: 1, g: 0.278, b: 0.341, a: 1 }, // #FF4757
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  typography: {
    h1: { size: 48, weight: 700 },
    h2: { size: 36, weight: 700 },
    h3: { size: 24, weight: 600 },
    body: { size: 16, weight: 400 },
    small: { size: 14, weight: 400 },
  }
};

class VatanaFigmaCreator {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.baseURL = 'https://api.figma.com/v1';
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  // Create glassmorphism card
  createGlassCard(name, x, y, width, height, children = []) {
    return {
      type: 'FRAME',
      name: `Glass Card - ${name}`,
      x, y, width, height,
      backgroundColor: { ...DESIGN_SYSTEM.colors.backgroundTertiary, a: 0.8 },
      cornerRadius: DESIGN_SYSTEM.borderRadius.lg,
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.4 },
          offset: { x: 0, y: 8 },
          radius: 32,
          spread: 0
        },
        {
          type: 'INNER_SHADOW',
          color: { r: 1, g: 1, b: 1, a: 0.05 },
          offset: { x: 0, y: 1 },
          radius: 0,
          spread: 0
        }
      ],
      strokes: [{
        type: 'SOLID',
        color: { ...DESIGN_SYSTEM.colors.primary, a: 0.15 }
      }],
      strokeWeight: 1,
      children: children
    };
  }

  // Create primary button
  createPrimaryButton(text, x, y, width = 180, height = 48) {
    return {
      type: 'FRAME',
      name: `Button - ${text}`,
      x, y, width, height,
      backgroundColor: DESIGN_SYSTEM.colors.primary,
      cornerRadius: DESIGN_SYSTEM.borderRadius.md,
      effects: [{
        type: 'DROP_SHADOW',
        color: { ...DESIGN_SYSTEM.colors.primary, a: 0.4 },
        offset: { x: 0, y: 8 },
        radius: 24
      }],
      children: [{
        type: 'TEXT',
        name: 'Label',
        characters: text,
        fontSize: 16,
        fontWeight: 600,
        textAlignHorizontal: 'CENTER',
        textAlignVertical: 'CENTER',
        fills: [{ type: 'SOLID', color: DESIGN_SYSTEM.colors.background }],
        x: 0,
        y: 0,
        width,
        height
      }]
    };
  }

  // Create text element
  createText(text, x, y, style = 'body', color = 'foreground') {
    const typography = DESIGN_SYSTEM.typography[style];
    const textColor = DESIGN_SYSTEM.colors[color];
    
    return {
      type: 'TEXT',
      name: `Text - ${text.substring(0, 30)}`,
      characters: text,
      fontSize: typography.size,
      fontWeight: typography.weight,
      fills: [{ type: 'SOLID', color: textColor }],
      x,
      y,
      width: 600,
      height: typography.size * 1.4
    };
  }

  // Create stat card
  createStatCard(label, value, change, x, y) {
    return this.createGlassCard(label, x, y, 280, 140, [
      this.createText(label, 24, 24, 'small', 'foregroundTertiary'),
      {
        ...this.createText(value, 24, 50, 'h2', 'primary'),
        width: 232
      },
      this.createText(change, 24, 100, 'small', 'success')
    ]);
  }

  // Create navigation item
  createNavItem(icon, label, x, y, isActive = false) {
    const bgColor = isActive 
      ? { ...DESIGN_SYSTEM.colors.primary, a: 0.1 }
      : { r: 0, g: 0, b: 0, a: 0 };
    
    return {
      type: 'FRAME',
      name: `Nav - ${label}`,
      x, y,
      width: 240,
      height: 48,
      backgroundColor: bgColor,
      cornerRadius: DESIGN_SYSTEM.borderRadius.sm,
      children: [
        this.createText(`${icon} ${label}`, 16, 14, 'body', 
          isActive ? 'primary' : 'foregroundSecondary')
      ]
    };
  }

  // Create complete dashboard page
  async createDashboardPage() {
    console.log('🎨 Creating Dashboard Page in Figma...\n');
    
    const pageWidth = 1440;
    const pageHeight = 1024;
    
    const nodes = [
      // Main container
      {
        type: 'FRAME',
        name: '📊 Dashboard - VATANA',
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        backgroundColor: DESIGN_SYSTEM.colors.background,
        children: [
          // Header
          this.createGlassCard('Header', 280, 32, pageWidth - 320, 80, [
            this.createText('VAT Analytics Dashboard', 32, 26, 'h3', 'foreground'),
            this.createPrimaryButton('Export Report', pageWidth - 520, 16, 160, 48)
          ]),
          
          // Stat Cards Row
          this.createStatCard('VAT Saved', '€127,450', '+12.5%', 280, 144),
          this.createStatCard('Compliance Score', '98.2%', '+2.1%', 588, 144),
          this.createStatCard('Active Integrations', '6/27', 'EU Countries', 896, 144),
          
          // Main Content Card
          this.createGlassCard('Content', 280, 316, pageWidth - 320, 500, [
            this.createText('Recent Activity', 32, 32, 'h3', 'foreground'),
            this.createText('No activity to display', 32, 80, 'body', 'foregroundTertiary')
          ]),
          
          // Sidebar
          {
            type: 'FRAME',
            name: 'Sidebar',
            x: 0,
            y: 0,
            width: 256,
            height: pageHeight,
            backgroundColor: DESIGN_SYSTEM.colors.backgroundSecondary,
            children: [
              // Logo
              {
                ...this.createText('VATANA', 32, 32, 'h3', 'primary'),
                width: 192
              },
              
              // Navigation
              this.createNavItem('📊', 'Dashboard', 16, 120, true),
              this.createNavItem('📈', 'Analytics', 16, 176),
              this.createNavItem('📄', 'Filing', 16, 232),
              this.createNavItem('⚙️', 'Settings', 16, 288),
              this.createNavItem('👥', 'Team', 16, 344),
            ]
          }
        ]
      }
    ];

    return await this.createNodes(nodes);
  }

  // Create settings page
  async createSettingsPage() {
    console.log('⚙️ Creating Settings Page in Figma...\n');
    
    const pageWidth = 1440;
    const pageHeight = 1200;
    
    const tabs = ['Team', 'Knowledge', 'Integrations', 'Compliance', 'Mobile'];
    
    const nodes = [
      {
        type: 'FRAME',
        name: '⚙️ Settings - VATANA',
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        backgroundColor: DESIGN_SYSTEM.colors.background,
        children: [
          // Header
          this.createText('Settings', 64, 64, 'h1', 'foreground'),
          this.createText('Manage your account, team, and preferences', 64, 128, 'body', 'foregroundSecondary'),
          
          // Tab Bar
          {
            type: 'FRAME',
            name: 'Tabs',
            x: 64,
            y: 192,
            width: pageWidth - 128,
            height: 56,
            backgroundColor: { ...DESIGN_SYSTEM.colors.backgroundSecondary, a: 0.5 },
            cornerRadius: DESIGN_SYSTEM.borderRadius.md,
            children: tabs.map((tab, i) => ({
              ...this.createPrimaryButton(tab, 8 + (i * 180), 8, 164, 40),
              backgroundColor: i === 0 
                ? DESIGN_SYSTEM.colors.primary 
                : { r: 0, g: 0, b: 0, a: 0 }
            }))
          },
          
          // Content Area
          this.createGlassCard('Content', 64, 280, pageWidth - 128, 800, [
            this.createText('Team Management', 48, 48, 'h2', 'foreground'),
            this.createText('Manage team members and permissions', 48, 96, 'body', 'foregroundSecondary'),
            this.createPrimaryButton('+ Invite Member', pageWidth - 300, 48, 180, 48)
          ])
        ]
      }
    ];

    return await this.createNodes(nodes);
  }

  // Create landing page
  async createLandingPage() {
    console.log('🏠 Creating Landing Page in Figma...\n');
    
    const pageWidth = 1440;
    const pageHeight = 3000;
    
    const nodes = [
      {
        type: 'FRAME',
        name: '🏠 Landing Page - VATANA',
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        backgroundColor: DESIGN_SYSTEM.colors.background,
        children: [
          // Hero Section
          {
            type: 'FRAME',
            name: 'Hero',
            x: 0,
            y: 0,
            width: pageWidth,
            height: 800,
            backgroundColor: DESIGN_SYSTEM.colors.background,
            children: [
              // Gradient Orbs
              {
                type: 'ELLIPSE',
                name: 'Gradient Orb 1',
                x: 200,
                y: 100,
                width: 400,
                height: 400,
                fills: [{ type: 'SOLID', color: { ...DESIGN_SYSTEM.colors.primary, a: 0.2 } }],
                effects: [{ type: 'LAYER_BLUR', radius: 100 }]
              },
              
              // Headline
              this.createText('Simplify VAT Compliance', 
                (pageWidth - 800) / 2, 250, 'h1', 'foreground'),
              this.createText('Across Europe', 
                (pageWidth - 800) / 2, 320, 'h1', 'primary'),
              
              // Subheadline
              this.createText(
                'Automate VAT calculations, submissions, and compliance monitoring for 27+ EU countries.',
                (pageWidth - 700) / 2, 420, 'body', 'foregroundSecondary'
              ),
              
              // CTAs
              this.createPrimaryButton('Start Free Trial', 
                (pageWidth - 400) / 2, 520, 180, 56),
              {
                ...this.createGlassCard('Watch Demo Button', 
                  (pageWidth + 200) / 2, 520, 180, 56, [
                    this.createText('Watch Demo', 40, 18, 'body', 'primary')
                  ])
              }
            ]
          },
          
          // Features Section
          ...Array.from({ length: 6 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = 100 + (col * 400);
            const y = 1000 + (row * 280);
            
            return this.createGlassCard(`Feature ${i + 1}`, x, y, 360, 220, [
              this.createText('🚀', 32, 32, 'h2', 'primary'),
              this.createText('Feature Title', 32, 100, 'h3', 'foreground'),
              this.createText('Feature description goes here', 32, 140, 'small', 'foregroundSecondary')
            ]);
          }),
          
          // CTA Section
          this.createGlassCard('CTA', 320, 1800, pageWidth - 640, 280, [
            this.createText('Ready to simplify your VAT compliance?', 
              180, 60, 'h2', 'foreground'),
            this.createPrimaryButton('Start Your Free Trial', 
              (pageWidth - 880) / 2, 160, 220, 56)
          ])
        ]
      }
    ];

    return await this.createNodes(nodes);
  }

  // Send nodes to Figma
  async createNodes(nodes) {
    try {
      console.log('📤 Sending to Figma API...');
      
      const response = await axios.post(
        `${this.baseURL}/files/${this.fileKey}/nodes`,
        { nodes },
        { headers: this.headers }
      );
      
      console.log('✅ Success! Check your Figma file:\n');
      console.log(`   https://figma.com/file/${this.fileKey}\n`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating in Figma:');
      console.error(error.response?.data || error.message);
      console.error('\n💡 Make sure your FIGMA_TOKEN and FIGMA_FILE_KEY are correct in .env\n');
      return null;
    }
  }
}

// Main execution
async function main() {
  const pageType = process.argv[2] || 'dashboard';
  
  const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
  const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
  
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('❌ Missing Figma credentials!');
    console.error('Please set FIGMA_TOKEN and FIGMA_FILE_KEY in your .env file\n');
    console.error('Get your token at: https://www.figma.com/developers/api#access-tokens\n');
    process.exit(1);
  }
  
  const creator = new VatanaFigmaCreator(FIGMA_TOKEN, FIGMA_FILE_KEY);
  
  console.log('🎨 VATANA Figma Page Creator\n');
  console.log(`Creating: ${pageType}\n`);
  
  let result;
  
  switch (pageType.toLowerCase()) {
    case 'dashboard':
      result = await creator.createDashboardPage();
      break;
    case 'settings':
      result = await creator.createSettingsPage();
      break;
    case 'landing':
      result = await creator.createLandingPage();
      break;
    default:
      console.error(`❌ Unknown page type: ${pageType}`);
      console.error('Available: dashboard, settings, landing\n');
      process.exit(1);
  }
  
  if (result) {
    console.log('✨ Page created successfully!\n');
  }
}

main();
