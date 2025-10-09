const fs = require('fs').promises;
const path = require('path');

class HTMLUIGenerator {
  constructor() {
    this.outputDir = './generated-ui';
    this.currentHTML = '';
    this.currentCSS = '';
    this.elementCount = 0;
  }

  async initializeOutput(name) {
    this.currentHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .ui-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .frame {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 20px 0;
            position: relative;
            overflow: hidden;
        }
        .button {
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            position: absolute;
        }
        .button:hover {
            background: #0056CC;
            transform: translateY(-1px);
        }
        .text-element {
            position: absolute;
            color: #333;
            font-weight: 400;
        }
        .card {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            position: absolute;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .card-description {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
        }
        .input-field {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 16px;
            transition: border-color 0.2s ease;
            position: absolute;
        }
        .input-field:focus {
            outline: none;
            border-color: #007AFF;
        }
        .login-screen {
            width: 375px;
            height: 812px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-form {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 320px;
        }
    </style>
</head>
<body>
    <div class="ui-container">
        <h1>Generated UI: ${name}</h1>
`;

    // Ensure output directory exists
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
    }
  }

  async createFrame(name, width = 375, height = 812, x = 0, y = 0) {
    const frameId = `frame-${++this.elementCount}`;
    this.currentHTML += `
        <div class="frame" id="${frameId}" style="width: ${width}px; height: ${height}px; left: ${x}px; top: ${y}px;">
            <!-- ${name} -->
`;
    console.log(`✅ Frame "${name}" created successfully!`);
    return { success: true, id: frameId };
  }

  async createButton(text, x = 50, y = 100, width = 120, height = 40) {
    const buttonId = `button-${++this.elementCount}`;
    this.currentHTML += `
            <button class="button" id="${buttonId}" style="left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;">
                ${text}
            </button>
`;
    console.log(`✅ Button "${text}" created successfully!`);
    return { success: true, id: buttonId };
  }

  async createTextElement(text, x = 50, y = 50, fontSize = 16) {
    const textId = `text-${++this.elementCount}`;
    this.currentHTML += `
            <div class="text-element" id="${textId}" style="left: ${x}px; top: ${y}px; font-size: ${fontSize}px;">
                ${text}
            </div>
`;
    console.log(`✅ Text element created successfully!`);
    return { success: true, id: textId };
  }

  async createCard(title, description, x = 50, y = 200, width = 280, height = 180) {
    const cardId = `card-${++this.elementCount}`;
    this.currentHTML += `
            <div class="card" id="${cardId}" style="left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;">
                <div class="card-title">${title}</div>
                <div class="card-description">${description}</div>
            </div>
`;
    console.log(`✅ Card "${title}" created successfully!`);
    return { success: true, id: cardId };
  }

  async createInputField(placeholder, x = 50, y = 200, width = 275, height = 50) {
    const inputId = `input-${++this.elementCount}`;
    this.currentHTML += `
            <input class="input-field" id="${inputId}" type="text" placeholder="${placeholder}" 
                   style="left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px;">
`;
    console.log(`✅ Input field created successfully!`);
    return { success: true, id: inputId };
  }

  closeFrame() {
    this.currentHTML += `
        </div>
`;
  }

  async saveOutput(filename) {
    this.currentHTML += `
    </div>
    
    <script>
        // Add some interactivity
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', () => {
                console.log('Button clicked:', button.textContent);
                button.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    button.style.transform = 'translateY(-1px)';
                }, 150);
            });
        });
        
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.1)';
            });
            input.addEventListener('blur', () => {
                input.style.boxShadow = 'none';
            });
        });
    </script>
</body>
</html>`;

    const filepath = path.join(this.outputDir, `${filename}.html`);
    await fs.writeFile(filepath, this.currentHTML, 'utf8');
    console.log(`💾 HTML UI saved to: ${filepath}`);
    
    return filepath;
  }
}

module.exports = HTMLUIGenerator;