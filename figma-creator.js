const axios = require('axios');

class FigmaCreator {
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.baseURL = 'https://api.figma.com/v1';
    
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  async createFrame(name, width = 375, height = 812, x = 0, y = 0) {
    const frameData = {
      type: 'FRAME',
      name: name,
      width: width,
      height: height,
      x: x,
      y: y,
      backgroundColor: { r: 1, g: 1, b: 1, a: 1 }, // White background
      children: []
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/files/${this.fileKey}/nodes`,
        { nodes: [frameData] },
        { headers: this.headers }
      );
      
      console.log(`✅ Frame "${name}" created successfully!`);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating frame:', error.response?.data || error.message);
      return null;
    }
  }

  async createButton(text, x = 50, y = 100, width = 120, height = 40) {
    const buttonData = {
      type: 'FRAME',
      name: `Button - ${text}`,
      width: width,
      height: height,
      x: x,
      y: y,
      backgroundColor: { r: 0.2, g: 0.4, b: 1, a: 1 }, // Blue background
      cornerRadius: 8,
      children: [{
        type: 'TEXT',
        name: text,
        characters: text,
        fontSize: 16,
        fontWeight: 500,
        textAlignHorizontal: 'CENTER',
        textAlignVertical: 'CENTER',
        fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }], // White text
        x: 0,
        y: 0,
        width: width,
        height: height
      }]
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/files/${this.fileKey}/nodes`,
        { nodes: [buttonData] },
        { headers: this.headers }
      );
      
      console.log(`✅ Button "${text}" created successfully!`);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating button:', error.response?.data || error.message);
      return null;
    }
  }

  async createTextElement(text, x = 50, y = 50, fontSize = 16) {
    const textData = {
      type: 'TEXT',
      name: `Text - ${text.substring(0, 20)}...`,
      characters: text,
      fontSize: fontSize,
      fontWeight: 400,
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }], // Black text
      x: x,
      y: y,
      width: 300,
      height: fontSize * 1.2
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/files/${this.fileKey}/nodes`,
        { nodes: [textData] },
        { headers: this.headers }
      );
      
      console.log(`✅ Text element created successfully!`);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating text:', error.response?.data || error.message);
      return null;
    }
  }

  async createCard(title, description, x = 50, y = 200, width = 280, height = 180) {
    const cardData = {
      type: 'FRAME',
      name: `Card - ${title}`,
      width: width,
      height: height,
      x: x,
      y: y,
      backgroundColor: { r: 0.98, g: 0.98, b: 0.98, a: 1 }, // Light gray
      cornerRadius: 12,
      effects: [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 8
      }],
      children: [
        {
          type: 'TEXT',
          name: 'Title',
          characters: title,
          fontSize: 20,
          fontWeight: 600,
          fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }],
          x: 20,
          y: 20,
          width: width - 40,
          height: 30
        },
        {
          type: 'TEXT',
          name: 'Description',
          characters: description,
          fontSize: 14,
          fontWeight: 400,
          fills: [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }],
          x: 20,
          y: 60,
          width: width - 40,
          height: height - 80
        }
      ]
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/files/${this.fileKey}/nodes`,
        { nodes: [cardData] },
        { headers: this.headers }
      );
      
      console.log(`✅ Card "${title}" created successfully!`);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating card:', error.response?.data || error.message);
      return null;
    }
  }
}

module.exports = FigmaCreator;