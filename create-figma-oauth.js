#!/usr/bin/env node

/**
 * VATANA Figma Page Creator - OAuth Version
 * Uses OAuth credentials instead of Personal Access Token
 */

require('dotenv').config();
const axios = require('axios');
const http = require('http');
const { URL } = require('url');

const CLIENT_ID = process.env.FIGMA_CLIENT_ID;
const CLIENT_SECRET = process.env.FIGMA_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';
const PORT = 3000;

class FigmaOAuthCreator {
  constructor() {
    this.accessToken = null;
  }

  // Step 1: Get authorization URL
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'file_write',
      state: 'vatana_creator',
      response_type: 'code'
    });
    
    return `https://www.figma.com/oauth?${params.toString()}`;
  }

  // Step 2: Exchange code for access token
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post('https://www.figma.com/api/oauth/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: 'authorization_code'
      });
      
      this.accessToken = response.data.access_token;
      console.log('✅ Successfully authenticated with Figma!\n');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error exchanging code for token:', error.response?.data || error.message);
      return null;
    }
  }

  // Step 3: Start local server to receive OAuth callback
  async authenticate() {
    return new Promise((resolve, reject) => {
      const authUrl = this.getAuthUrl();
      
      console.log('🔐 Opening browser for Figma authentication...\n');
      console.log('👉 Please visit this URL in your browser:\n');
      console.log(`   ${authUrl}\n`);
      console.log('Waiting for authentication...\n');

      const server = http.createServer(async (req, res) => {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        
        if (url.pathname === '/callback') {
          const code = url.searchParams.get('code');
          
          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>✅ Authentication successful!</h1><p>You can close this window and return to the terminal.</p>');
            
            const token = await this.exchangeCodeForToken(code);
            server.close();
            
            if (token) {
              resolve(token);
            } else {
              reject(new Error('Failed to get access token'));
            }
          } else {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<h1>❌ Authentication failed</h1><p>No code received.</p>');
            server.close();
            reject(new Error('No code received'));
          }
        }
      });

      server.listen(PORT, () => {
        console.log(`🌐 Local server running on http://localhost:${PORT}`);
      });

      // Auto-open browser (Windows)
      const { exec } = require('child_process');
      exec(`start ${authUrl}`);
    });
  }

  async createInFigma(fileKey, nodes) {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      const response = await axios.post(
        `https://api.figma.com/v1/files/${fileKey}/nodes`,
        { nodes },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Successfully created in Figma!\n');
      console.log(`🔗 View your file: https://figma.com/file/${fileKey}\n`);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating in Figma:');
      console.error(error.response?.data || error.message);
      return null;
    }
  }
}

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing OAuth credentials!');
    console.error('Please set FIGMA_CLIENT_ID and FIGMA_CLIENT_SECRET in .env\n');
    process.exit(1);
  }

  console.log('🎨 VATANA Figma OAuth Creator\n');
  
  const creator = new FigmaOAuthCreator();
  
  try {
    // Authenticate
    await creator.authenticate();
    
    // Now you can create designs
    console.log('Ready to create designs!\n');
    console.log('💡 Tip: Save this access token for future use\n');
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = FigmaOAuthCreator;
