# Deployment Guide

This guide covers different ways to deploy GPT-News to various platforms.

## 🌐 GitHub Pages (Recommended for Static Sites)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Clean project for deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Your site will be available at: `https://yourusername.github.io/gpt-news`

3. **Configure API Key**
   - Since GitHub Pages is static hosting, you'll need to set the API key in the browser
   - Open browser console and run: `window.OPENAI_API_KEY = "your_key_here"`
   - Or modify the index.html directly (not recommended for security)

## 🚀 Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: (leave empty)
   - Publish directory: `/` (root)
   - No build process needed - it's a static HTML file

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add `OPENAI_API_KEY` with your API key value
   - The app will automatically use it

## ⚡ Vercel

1. **Deploy from GitHub**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - No build configuration needed

2. **Environment Variables**
   - In project settings, add `OPENAI_API_KEY`
   - The app will automatically use it

## 🐳 Docker (Optional)

If you want to containerize the app:

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY favicon.svg /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Security Notes

- **Never commit API keys to version control**
- For production, consider implementing a backend proxy to handle API calls
- The current implementation makes direct calls to OpenAI API from the browser
- Rate limiting: OpenAI API has usage limits - monitor your usage

## 🌍 Custom Domain

After deploying to any platform:

1. **Purchase a domain** (e.g., from Namecheap, GoDaddy)
2. **Configure DNS**
   - For GitHub Pages: Create CNAME record pointing to `yourusername.github.io`
   - For Netlify: Add domain in site settings, follow DNS instructions
   - For Vercel: Add domain in project settings

3. **SSL Certificate**
   - All platforms provide free SSL certificates automatically
   - Your site will be available via HTTPS

## 📊 Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- Add before closing </head> tag in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 Troubleshooting

**API Key Issues:**
- Ensure your OpenAI API key has sufficient credits
- Check browser console for error messages
- Verify CORS settings if using a proxy

**Loading Issues:**
- Ensure all files are properly uploaded
- Check browser network tab for failed requests
- Verify the domain is accessible

**Performance:**
- The app uses 24-hour caching by default
- Consider implementing server-side caching for better performance
- Monitor OpenAI API usage to avoid rate limits
