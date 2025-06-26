# News GPT 🚀

**Truth-First Global Intelligence Platform**

A modern, AI-powered news aggregation platform that provides real-time global news analysis with fact-checking, source verification, and intelligent categorization powered by OpenAI.

![News GPT](https://img.shields.io/badge/Powered%20by-OpenAI-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- 🤖 **AI-Powered Analysis** - Advanced news processing using OpenAI GPT models
- � **Global Coverage** - Technology, Finance, Sports, Science, and Global Affairs
- ✅ **Fact-Checking** - Built-in verification and source credibility scoring
- � **Responsive Design** - Beautiful, modern UI that works on all devices
- ⚡ **Smart Caching** - 24-hour intelligent caching system for optimal performance
- 🔍 **Source Citations** - Transparent source attribution and verification
- 📊 **Real-time Stats** - Live statistics and performance metrics

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/news-gpt.git
cd news-gpt
```

### 2. Configure API Key
Create a `config.js` file in the root directory:
```javascript
window.GPT_NEWS_CONFIG = {
    OPENAI_API_KEY: "sk-your-actual-openai-api-key-here",
    OPENAI_API_BASE: "https://api.openai.com/v1",
    DEBUG: true
};
```

> ⚠️ **Important**: Never commit your `config.js` file to version control. It's already added to `.gitignore`.

### 3. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy the key and paste it into your `config.js` file

### 4. Open the Application
Simply open `index.html` in your web browser or serve it with a local server.

## 📝 Configuration Options

### Using config.js (Recommended)
```javascript
window.GPT_NEWS_CONFIG = {
    OPENAI_API_KEY: "your-api-key-here",      // Required
    OPENAI_API_BASE: "https://api.openai.com/v1",  // Optional
    DEBUG: true                               // Optional
};
```

### Alternative: Browser Console
You can also set the API key directly in the browser console:
```javascript
window.OPENAI_API_KEY = "your-api-key-here";
```

## 🏗️ Project Structure

```
gpt-news/
├── index.html          # Main application (self-contained)
├── favicon.svg         # Site favicon
├── package.json        # Project configuration
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: OpenAI GPT API with structured output
- **Styling**: Custom CSS with modern gradients and animations
- **Architecture**: Single-page application with modular components
- **Caching**: LocalStorage-based intelligent caching

## 🔧 Configuration

### API Key Setup

The application requires an OpenAI API key. You can configure it in several ways:

1. **Environment Variable** (Most Secure)
   ```javascript
   window.OPENAI_API_KEY = "your_key_here";
   ```

2. **Direct Edit** (Development Only)
   - Edit the `API_KEY` constant in `index.html`

### Customization

- **Categories**: Modify the `categories` object in the script section
- **Styling**: Update CSS variables in the `<style>` section
- **Cache Duration**: Adjust `CACHE_DURATION` constant (default: 24 hours)

## 📊 Features Overview

### News Categories
- **Technology & Innovation**: AI, startups, digital transformation
- **Finance & Economy**: Markets, crypto, economic indicators
- **Sports & Competition**: Global sports, championships, athlete news
- **Science & Research**: Scientific discoveries, medical breakthroughs
- **Global Affairs**: Politics, climate, international relations

### AI Capabilities
- Intelligent content summarization
- Source credibility analysis
- Relevance scoring (70-100%)
- Importance ranking (1-5 scale)
- Real-time fact verification

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Your app will be available at `https://yourusername.github.io/gpt-news`

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: (none needed - static HTML)
3. Set publish directory: `/` (root)
4. Deploy!

### Vercel
1. Connect repository to Vercel
2. No build configuration needed
3. Deploy automatically

## 🔐 Security Considerations

- **API Keys**: Never commit API keys to version control
- **CORS**: The app makes direct API calls - consider proxy for production
- **Rate Limiting**: OpenAI API has rate limits - implement retry logic if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the GPT API
- [Inter Font](https://rsms.me/inter/) for typography
- [JetBrains Mono](https://www.jetbrains.com/mono/) for code elements

## 📧 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the [OpenAI API documentation](https://platform.openai.com/docs)

---

**Made with ❤️ and AI** | [⭐ Star this repo](https://github.com/yourusername/gpt-news) if you find it useful!
   - Click "📤 Export Context" to download a JSON file
   - Contains all selected elements, comments, and page context
   - Use this data with AI tools for deeper analysis

### Development vs Production

- **Development**: Stagewise toolbar is automatically loaded and visible
- **Production**: Toolbar is completely disabled and doesn't load
- **Detection**: Automatically detects localhost, file://, and custom ports

## Getting Started

### Prerequisites

- Node.js (for development server)
- Modern web browser with ES6 module support

### Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   This will:
   - Start a local server on http://localhost:3000
   - Automatically open the application in your browser
   - Enable the Stagewise toolbar for development

### Alternative Development Methods

**Using Python (if Node.js not available)**:
```bash
npm run preview
# or directly:
python3 -m http.server 8080
```

**Direct File Access**:
- Open `index.html` directly in browser
- Stagewise will detect file:// protocol and enable toolbar

## Project Structure

```
├── index.html              # Main application file
├── stagewise-toolbar.js    # Stagewise toolbar integration
├── package.json           # Dependencies and scripts
├── .vscode/
│   └── extensions.json    # Recommended VS Code extensions
└── README.md             # This file
```

## Stagewise Integration Details

### Custom Implementation

Since stagewise packages aren't yet available, this project includes a custom implementation that:

- ✅ Provides element selection capabilities
- ✅ Enables AI comment functionality  
- ✅ Offers context export for AI analysis
- ✅ Only loads in development mode
- ✅ Includes modern UI with dark theme
- ✅ Supports keyboard shortcuts (Escape to exit selection)

### VS Code Extension

The project includes the stagewise VS Code extension in the recommended extensions list (`.vscode/extensions.json`). Install it for enhanced development experience.

## Usage Examples

### Basic Development Workflow

1. Start the dev server: `npm run dev`
2. Open the application at http://localhost:3000
3. Use the stagewise toolbar to:
   - Select news cards or sections
   - Add comments about UI improvements
   - Export context for AI analysis
   - Get suggestions for enhancements

### AI-Powered Development

1. Select multiple elements (e.g., all news cards)
2. Add comment: "These cards need better loading states"
3. Export context to get detailed element information
4. Use exported data with AI tools for code generation

## Troubleshooting

### Stagewise Toolbar Not Appearing

- Ensure you're running on localhost (not file://)
- Check browser console for any JavaScript errors
- Verify the development server is running on a custom port

### Selection Mode Issues

- Press `Escape` to exit selection mode
- Refresh the page if selection gets stuck
- Check that JavaScript modules are enabled in your browser

## License

MIT License - feel free to use and modify for your projects.

Made by Saloni with ❤️ and AI