# GPT-News Setup Instructions

## Quick Start

### Option 1: Use Demo Mode (No API Key Required)
- Simply open the app and click "🚀 Fetch Live Global Intelligence"
- Demo mode will show sample news articles to demonstrate the interface
- Perfect for testing the UI and functionality

### Option 2: Add Your OpenAI API Key for Live News

#### Method 1: Browser Console (Temporary)
1. Open the app in your browser
2. Press `F12` or right-click → "Inspect" to open Developer Tools
3. Go to the "Console" tab
4. Type: `window.OPENAI_API_KEY = "your-api-key-here"`
5. Press Enter
6. Click "🚀 Fetch Live Global Intelligence" to fetch real news

#### Method 2: Edit the Code (Permanent)
1. Open `index.html` in a text editor
2. Find line ~553: `const API_KEY = window.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE";`
3. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key
4. Save the file

#### Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

## What's Fixed

✅ **Demo Mode**: Works without API key - shows sample news  
✅ **Model Fix**: Changed from invalid "gpt-4.1-nano" to "gpt-4o-mini"  
✅ **Error Handling**: Better error messages and warnings  
✅ **Search Time Fix**: Fixed the large search time display issue  
✅ **API Key Validation**: Checks if API key is properly configured  

## Troubleshooting

### No News Displaying?
- Check if you see "DEMO MODE" message - this means it's working but using sample data
- Check browser console (F12) for error messages
- Verify your API key is correct and has sufficient credits

### API Errors?
- Ensure your OpenAI API key is valid
- Check you have sufficient API credits
- Try refreshing the page

### Still Having Issues?
- Clear your browser cache
- Check the browser console for detailed error messages
- Make sure you're using a modern browser

## Security Note
⚠️ **Never commit API keys to version control**  
⚠️ **For production use, implement server-side API key handling**
