#!/usr/bin/env node

const HTMLUIGenerator = require('./html-ui-generator');
require('dotenv').config();

async function createUIFromPrompt(prompt) {
  const uiGenerator = new HTMLUIGenerator();
  
  console.log(`🎨 Creating UI from prompt: "${prompt}"`);
  console.log('─'.repeat(50));

  try {
    // Parse the prompt and create appropriate UI elements
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('login') || lowerPrompt.includes('sign in')) {
      await createLoginUI(uiGenerator, prompt);
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      await createDashboardUI(uiGenerator, prompt);
    } else if (lowerPrompt.includes('card') || lowerPrompt.includes('product')) {
      await createCardUI(uiGenerator, prompt);
    } else if (lowerPrompt.includes('button')) {
      await createButtonUI(uiGenerator, prompt);
    } else if (lowerPrompt.includes('form')) {
      await createFormUI(uiGenerator, prompt);
    } else {
      await createGenericUI(uiGenerator, prompt);
    }
    
    console.log('\n✨ UI creation completed! Check the generated HTML file.');
    
  } catch (error) {
    console.error('❌ Error creating UI:', error.message);
  }
}

async function createLoginUI(uiGenerator, prompt) {
  console.log('🔐 Creating login UI...');
  
  // Initialize the UI
  await uiGenerator.initializeOutput('Login Screen');
  
  // Create main frame
  await uiGenerator.createFrame('Login Screen', 375, 812);
  
  // Title
  await uiGenerator.createTextElement('Welcome Back', 50, 50, 28);
  
  // Email input
  await uiGenerator.createInputField('Enter your email address', 50, 120, 275, 50);
  
  // Password input  
  await uiGenerator.createInputField('Enter your password', 50, 190, 275, 50);
  
  // Login button
  await uiGenerator.createButton('Sign In', 50, 270, 275, 50);
  
  // Forgot password link
  await uiGenerator.createTextElement('Forgot Password?', 50, 340, 14);
  
  // Close frame and save
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('login-screen');
}

async function createDashboardUI(uiGenerator, prompt) {
  console.log('📊 Creating dashboard UI...');
  
  await uiGenerator.initializeOutput('Dashboard');
  
  // Create main frame
  await uiGenerator.createFrame('Dashboard', 1200, 800);
  
  // Header
  await uiGenerator.createCard('Header', 'Dashboard Navigation', 0, 0, 1200, 80);
  
  // Stats cards
  await uiGenerator.createCard('Total Users', '2,543 active users', 50, 120, 280, 120);
  await uiGenerator.createCard('Revenue', '$45,678 this month', 360, 120, 280, 120);
  await uiGenerator.createCard('Orders', '156 new orders', 670, 120, 280, 120);
  
  // Chart placeholder
  await uiGenerator.createCard('Analytics Chart', 'Revenue trends and analytics visualization', 50, 280, 900, 300);
  
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('dashboard');
}

async function createCardUI(uiGenerator, prompt) {
  console.log('🎴 Creating card UI...');
  
  // Extract title from prompt or use default
  const title = extractTitle(prompt) || 'Product Card';
  const description = extractDescription(prompt) || 'Product description and details';
  
  await uiGenerator.initializeOutput('Card Layout');
  await uiGenerator.createFrame('Card Layout', 400, 600);
  await uiGenerator.createCard(title, description, 50, 100, 300, 200);
  await uiGenerator.createButton('Buy Now', 50, 320, 120, 40);
  
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('card-layout');
}

async function createButtonUI(uiGenerator, prompt) {
  console.log('🔘 Creating button UI...');
  
  const buttonText = extractButtonText(prompt) || 'Click Me';
  
  await uiGenerator.initializeOutput('Button Collection');
  await uiGenerator.createFrame('Button Collection', 400, 300);
  await uiGenerator.createButton(buttonText, 50, 50, 150, 45);
  await uiGenerator.createButton(buttonText + ' (Secondary)', 50, 120, 150, 45);
  await uiGenerator.createButton(buttonText + ' (Outline)', 50, 190, 150, 45);
  
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('button-collection');
}

async function createFormUI(uiGenerator, prompt) {
  console.log('📝 Creating form UI...');
  
  await uiGenerator.initializeOutput('Contact Form');
  await uiGenerator.createFrame('Contact Form', 400, 600);
  await uiGenerator.createTextElement('Contact Us', 50, 30, 24);
  
  // Form fields
  await uiGenerator.createInputField('Enter your full name', 50, 80, 300, 50);
  await uiGenerator.createInputField('Enter your email', 50, 150, 300, 50);
  await uiGenerator.createInputField('Enter your message', 50, 220, 300, 100);
  
  // Submit button
  await uiGenerator.createButton('Send Message', 50, 350, 150, 45);
  
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('contact-form');
}

async function createGenericUI(uiGenerator, prompt) {
  console.log('🎯 Creating custom UI from prompt...');
  
  await uiGenerator.initializeOutput('Custom UI');
  await uiGenerator.createFrame('Custom UI', 400, 600);
  await uiGenerator.createTextElement('Custom Design', 50, 30, 20);
  await uiGenerator.createTextElement(prompt, 50, 70, 14);
  await uiGenerator.createCard('Element 1', 'Generated from your prompt', 50, 120, 300, 80);
  await uiGenerator.createButton('Action Button', 50, 230, 120, 40);
  
  uiGenerator.closeFrame();
  await uiGenerator.saveOutput('custom-ui');
}

// Helper functions
function extractTitle(prompt) {
  const titleMatch = prompt.match(/title[:\s]+([^,.]+)/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractDescription(prompt) {
  const descMatch = prompt.match(/description[:\s]+([^,.]+)/i);
  return descMatch ? descMatch[1].trim() : null;
}

function extractButtonText(prompt) {
  const buttonMatch = prompt.match(/button[:\s]+["']?([^"',.]+)["']?/i);
  return buttonMatch ? buttonMatch[1].trim() : null;
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const prompt = args.join(' ');
  
  if (!prompt) {
    console.log(`
🎨 Figma UI Creator for Vatana

Usage: node ui-prompt.js "your UI description"

Examples:
  node ui-prompt.js "create a login screen with email and password"
  node ui-prompt.js "make a dashboard with stats cards"
  node ui-prompt.js "design a product card with buy button"
  node ui-prompt.js "create a contact form"

Setup required:
1. Install dependencies:
   npm install

2. Generated HTML files will be saved in the 'generated-ui' directory
    `);
    process.exit(1);
  }
  
  createUIFromPrompt(prompt);
}

module.exports = { createUIFromPrompt };