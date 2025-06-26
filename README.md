# News GPT 🚀

**Truth-First Global Intelligence Platform**

A modern, AI-powered news aggregation platform that provides real-time global news analysis with fact-checking, source verification, and intelligent categorization powered by OpenAI.

![News GPT](https://img.shields.io/badge/Powered%20by-OpenAI-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

- 🤖 **AI-Powered Analysis** - Advanced news processing using OpenAI GPT models
- 🌍 **Global Coverage** - Technology, Finance, Sports, Science, and Global Affairs
- ✅ **Fact-Checking** - Built-in verification and source credibility scoring
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices
- ⚡ **Smart Caching** - 24-hour intelligent caching system for optimal performance
- 🔍 **Source Citations** - Transparent source attribution and verification
- 📊 **Real-time Stats** - Live statistics and performance metrics

## � Prerequisites

- **Node.js** (v14.0.0 or higher) - for development server
- **Modern web browser** with ES6 module support
- **OpenAI API key** - get one from [OpenAI Platform](https://platform.openai.com/api-keys)

## �🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/news-gpt.git
cd news-gpt
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `config.js` file in the root directory:
```javascript
window.GPT_NEWS_CONFIG = {
    OPENAI_API_KEY: "sk-your-actual-openai-api-key-here",
    OPENAI_API_BASE: "https://api.openai.com/v1",
    DEBUG: true
};
```

> ⚠️ **Important**: Never commit your `config.js` file to version control. It's already added to `.gitignore`.

### 4. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy the key and paste it into your `config.js` file

### 5. Start the Development Server
```bash
npm run dev
```
This will start a local server at `http://localhost:3000` and automatically open the application in your browser.

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
news-gpt/
├── index.html                # Main application entry point
├── config.js                 # Configuration file (not in repo)
├── .env.example              # Environment variables template
├── package.json              # Project dependencies and scripts
├── LICENSE                   # MIT license
├── README.md                 # This file
├── .gitignore               # Git ignore rules
├── assets/
│   └── favicon.svg          # Site favicon
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── PROJECT_STRUCTURE.md # Detailed project structure
│   └── SETUP.md             # Setup instructions
├── src/
│   ├── css/
│   │   └── styles.css       # Application styles
│   └── js/
│       ├── app.js           # Main application logic
│       └── config.js        # Configuration module
└── server/                  # Backend server (optional)
    ├── .env                 # Server environment variables (not in repo)
    └── package.json         # Server dependencies
```

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Development Server**: live-server with hot reload
- **AI Integration**: OpenAI GPT API with structured output
- **Styling**: Custom CSS with modern gradients and animations
- **Architecture**: Modular ES6 components
- **Caching**: LocalStorage-based intelligent caching
- **Backend** (Optional): Node.js Express server

## 🔧 Development

### Available Scripts

- **`npm run dev`** - Start development server with hot reload on port 3000
- **`npm start`** - Start production server on port 3000
- **`npm run preview`** - Start Python HTTP server on port 8080 (alternative)
- **`npm run clean`** - Clean and reinstall dependencies

### API Key Setup

The application requires an OpenAI API key. You can configure it in several ways:

1. **config.js File** (Recommended)
   ```javascript
   window.GPT_NEWS_CONFIG = {
       OPENAI_API_KEY: "your-api-key-here",
       OPENAI_API_BASE: "https://api.openai.com/v1",
       DEBUG: true
   };
   ```

2. **Environment Variable** (Browser Console)
   ```javascript
   window.OPENAI_API_KEY = "your_key_here";
   ```

### Customization

- **Categories**: Modify the `categories` object in `src/js/app.js`
- **Styling**: Update CSS variables in `src/css/styles.css`
- **Cache Duration**: Adjust settings in `src/js/config.js`

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
4. Your app will be available at `https://yourusername.github.io/news-gpt`

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: (none needed - static HTML)
3. Set publish directory: `/` (root)
4. Deploy!

### Vercel
1. Connect repository to Vercel
2. No build configuration needed
3. Deploy automatically

> **Note**: For production deployments, you'll need to configure API keys through environment variables or build-time configuration.

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment options
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed project organization

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

**Made with ❤️ and AI by Saloni** | [⭐ Star this repo](https://github.com/yourusername/news-gpt) if you find it useful!