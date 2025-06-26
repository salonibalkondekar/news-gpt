# News GPT 🚀

**Truth-First Global Intelligence Platform**

A modern, AI-powered news aggregation platform that provides real-time global news analysis with fact-checking, source verification, and intelligent categorization powered by OpenAI.

![News GPT](https://img.shields.io/badge/Powered%20by-OpenAI-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
̀![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

- 🤖 **AI-Powered Analysis** - Advanced news processing using OpenAI GPT models with web search
- 🔍 **Real-time Web Search** - Powered by OpenAI's web search API with automatic source citations
- 🌍 **Global Coverage** - Technology, Finance, Sports, Science, and Global Affairs
- ✅ **Fact-Checking** - Built-in verification and source credibility scoring
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices
- ⚡ **Smart Caching** - 24-hour intelligent caching system for optimal performance
- � **Source Citations** - Automatic extraction of clickable source links from web search
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

**Option A: Use API Key Setup Tool (Easiest)**
1. Open `setup-api.html` in your browser
2. Click "Load from Server .env" to use your existing API key
3. Test the connection to verify it works
4. Go to the main app

**Option B: Manual Configuration**
Create a `config.js` file in the root directory:
```javascript
window.GPT_NEWS_CONFIG = {
    OPENAI_API_KEY: "sk-your-actual-openai-api-key-here",
    OPENAI_API_BASE: "https://api.openai.com/v1",
    DEBUG: true
};
```

**Option C: Browser Console (Quick Test)**
```javascript
// Open browser console (F12) on the main app and run:
localStorage.setItem('OPENAI_API_KEY', 'sk-your-actual-api-key-here');
// Then refresh the page
```

> ⚠️ **Important**: Never commit your `config.js` file to version control. It's already added to `.gitignore`.

> 💡 **Demo Mode**: If you don't create a `config.js` file or don't provide an API key, the app will run in demo mode with sample data.

### 4. Get Your OpenAI API Key (Optional for Demo)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy the key and paste it into your `config.js` file

> 💡 **Skip this step to use demo mode with sample data**

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
- **AI Integration**: OpenAI GPT API with web search capabilities (gpt-4o-search-preview)
- **Web Search**: OpenAI's web search API with automatic source citations
- **Styling**: Custom CSS with modern gradients and animations
- **Architecture**: Modular ES6 components
- **Caching**: LocalStorage-based intelligent caching
- **Backend** (Optional): Node.js Express server

## 🔧 Development

### Getting Started Quickly

**Option 1: Demo Mode (No API Key Required)**
1. Clone the repository and install dependencies
2. Run `npm run dev`
3. The app will work with sample data

**Option 2: Live News (API Key Required)**
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create `config.js` file with your API key
3. Run `npm run dev` for live news data

### Available Scripts

- **`npm run dev`** - Start development server with hot reload on port 3000
- **`npm start`** - Start production server on port 3000
- **`npm run preview`** - Start Python HTTP server on port 8080 (alternative)
- **`npm run clean`** - Clean and reinstall dependencies

### API Key Setup

The application can work in two modes:

1. **Demo Mode** (No API Key)
   - Automatically enabled when no API key is provided
   - Shows realistic sample news data across all categories
   - Perfect for trying out the UI and features
   - No console errors or API key warnings

2. **Live Mode** (With API Key)
   - Requires valid OpenAI API key
   - Fetches real-time news data
   - Full AI-powered analysis and fact-checking

**Configuration Methods:**

1. **config.js File** (Recommended)
   ```javascript
   window.GPT_NEWS_CONFIG = {
       OPENAI_API_KEY: "your-api-key-here",
       DEBUG: true
   };
   ```

2. **Environment Variable** (Browser Console)
   ```javascript
   window.OPENAI_API_KEY = "your_key_here";
   ```

> **Note**: The application now uses OpenAI's `gpt-4o-search-preview` model for enhanced web search capabilities with automatic source citations.

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
- Intelligent content summarization with enhanced accuracy
- Advanced source credibility analysis using OpenAI web search
- Cross-referencing from multiple reliable sources automatically
- Real-time web search with automatic source citation extraction
- Relevance scoring (70-100%) with fact-checking
- Importance ranking (1-5 scale) based on global impact
- Real-time fact verification with transparency notes
- Enhanced prompt engineering for current news accuracy with web context

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

## 📰 News Sources & Resources

### OpenAI Web Search Integration

The application now uses **OpenAI's advanced web search API** which provides:

**Automatic Source Citations**
- Real-time web search across current news sources
- Automatic extraction of source URLs and titles
- Clickable citation links below each article
- Enhanced credibility verification through multiple sources
- Search context set to "high" for maximum accuracy and comprehensive results

**Web Search Features**
- Model: `gpt-4o-search-preview` with web search capabilities
- Context Size: High (for best quality and most comprehensive results)
- Automatic inline citations in responses
- Source URL extraction with titles and verification
- Real-time access to current news across the web

### Primary News APIs & Sources

**Technology & Innovation**
- [Hacker News API](https://github.com/HackerNews/API) - Tech community-driven news
- [Reddit API](https://www.reddit.com/dev/api/) - r/technology, r/programming
- [TechCrunch RSS](https://techcrunch.com/feed/) - Startup and tech industry news
- [Ars Technica RSS](https://feeds.arstechnica.com/arstechnica/index) - In-depth tech analysis
- [The Verge RSS](https://www.theverge.com/rss/index.xml) - Technology and science news

**Finance & Economy**
- [Alpha Vantage API](https://www.alphavantage.co/) - Financial market data
- [Financial Modeling Prep API](https://financialmodelingprep.com/developer/docs) - Stock market data
- [CoinGecko API](https://www.coingecko.com/en/api) - Cryptocurrency data
- [Yahoo Finance RSS](https://feeds.finance.yahoo.com/rss/2.0/headline) - Financial news
- [MarketWatch RSS](https://feeds.marketwatch.com/marketwatch/topstories/) - Market analysis

**Sports & Competition**
- [ESPN API](https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c) - Sports scores and news
- [SportsData.io API](https://sportsdata.io/) - Comprehensive sports data
- [The Athletic RSS](https://theathletic.com/rss/) - In-depth sports journalism
- [BBC Sport RSS](http://feeds.bbci.co.uk/sport/rss.xml) - Global sports coverage

**Science & Research**
- [NASA Open Data API](https://api.nasa.gov/) - Space and astronomy data
- [arXiv API](https://arxiv.org/help/api) - Scientific paper preprints
- [Nature RSS](https://www.nature.com/nature.rss) - Scientific research news
- [Science Magazine RSS](https://www.science.org/rss/news_current.xml) - Latest scientific discoveries
- [New Scientist RSS](https://www.newscientist.com/feed/home/) - Science and technology news

**Global Affairs & Politics**
- [NewsAPI](https://newsapi.org/) - Global news aggregation
- [Reuters RSS](https://www.reutersagency.com/feed/) - International news
- [BBC World News RSS](http://feeds.bbci.co.uk/news/world/rss.xml) - Global affairs
- [AP News RSS](https://apnews.com/apf-topnews) - Breaking news and politics
- [The Guardian RSS](https://www.theguardian.com/world/rss) - World news and analysis

### AI & Processing Resources

**OpenAI Integration**
- [OpenAI API Documentation](https://platform.openai.com/docs) - Complete API reference
- [OpenAI GPT Models](https://platform.openai.com/docs/models) - Available AI models
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) - JSON response formatting
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/production-best-practices) - Production guidelines

**News Processing Tools**
- [Mercury Web Parser](https://mercury.postlight.com/web-parser/) - Article content extraction
- [Diffbot API](https://www.diffbot.com/) - Web content processing
- [Newspaper3k](https://newspaper.readthedocs.io/) - Python article extraction
- [RSS Feed Validator](https://validator.w3.org/feed/) - RSS feed validation

### Data Sources for Demo Mode

When running without an API key, the application uses carefully curated sample data that represents:

**Realistic News Examples**
- Recent technology breakthroughs (AI, quantum computing, renewable energy)
- Global financial market trends and cryptocurrency developments
- Major sporting events and championship results
- Scientific discoveries and medical breakthroughs
- International political developments and climate initiatives

**Source Attribution**
- All demo articles include realistic source citations
- Credibility scores based on actual news source reputation
- Fact-checking status reflects real-world verification practices
- Importance rankings aligned with global news impact

### RSS Feeds Integration

The application can integrate with various RSS feeds for real-time news:

```javascript
// Example RSS feeds configuration
const NEWS_FEEDS = {
    technology: [
        'https://techcrunch.com/feed/',
        'https://www.theverge.com/rss/index.xml',
        'https://feeds.arstechnica.com/arstechnica/index'
    ],
    finance: [
        'https://feeds.finance.yahoo.com/rss/2.0/headline',
        'https://feeds.marketwatch.com/marketwatch/topstories/'
    ],
    science: [
        'https://www.nature.com/nature.rss',
        'https://www.science.org/rss/news_current.xml'
    ]
};
```

### News Aggregation APIs

**Free Tier APIs**
- [NewsAPI.org](https://newsapi.org/) - 500 requests/day free
- [Currents API](https://currentsapi.services/) - 600 requests/day free
- [GNews API](https://gnews.io/) - 100 requests/day free

**Premium APIs**
- [Bing News Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-news-search-api/) - Microsoft Azure
- [Event Registry](https://eventregistry.org/) - News event analysis
- [GDELT Project](https://www.gdeltproject.org/) - Global news database

> **Note**: The application primarily uses OpenAI's GPT models to process and analyze news content from various sources, ensuring consistent formatting and intelligent categorization regardless of the original source format.

## ❗ Troubleshooting

### Common Issues

**"Invalid or missing OpenAI API key" Error:**
1. **Fixed**: The app now automatically works in demo mode with sample news data
2. **For Live News**: Create a `config.js` file with a valid OpenAI API key
3. **Check Configuration**: Ensure your API key starts with `sk-` and is valid

**App Not Loading:**
- Make sure you're running the development server: `npm run dev`
- Check that port 3000 is not being used by another application
- Try the alternative server: `npm run preview`

**No News Appearing:**
- **Demo mode**: Should now show sample news automatically
- **Live mode**: Verify your OpenAI API key has sufficient credits
- **Still no news**: Check browser console for JavaScript errors

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