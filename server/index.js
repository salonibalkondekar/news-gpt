const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

// Server-side cache
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const newsCache = new Map();

// Cache management functions
function getCacheKey(category, query) {
    return `${category}_${query}`;
}

function isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
}

function getCachedNews(category, query) {
    const cacheKey = getCacheKey(category, query);
    const cacheEntry = newsCache.get(cacheKey);
    
    if (isCacheValid(cacheEntry)) {
        console.log(`Cache HIT for ${category} (age: ${Math.round((Date.now() - cacheEntry.timestamp) / (60 * 60 * 1000) * 10) / 10}h)`);
        return cacheEntry.data;
    }
    
    console.log(`Cache MISS for ${category}`);
    return null;
}

function setCachedNews(category, query, data) {
    const cacheKey = getCacheKey(category, query);
    newsCache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
    });
    console.log(`Cached news for ${category}`);
}

// Cleanup expired cache entries periodically
setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of newsCache.entries()) {
        if (now - entry.timestamp >= CACHE_DURATION) {
            newsCache.delete(key);
            cleanedCount++;
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`Cleaned ${cleanedCount} expired cache entries`);
    }
}, 60 * 60 * 1000); // Check every hour

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        hasApiKey: !!API_KEY,
        cacheStats: {
            entriesCount: newsCache.size,
            entries: Array.from(newsCache.keys()).map(key => ({
                key,
                age: Math.round((Date.now() - newsCache.get(key).timestamp) / (60 * 60 * 1000) * 10) / 10
            }))
        }
    });
});

app.post('/api/news', async (req, res) => {
    const { category, query } = req.body;

    console.log(`Received request for category: ${category}, query: ${query}`);

    if (!API_KEY) {
        return res.status(500).json({ 
            error: { 
                message: 'OpenAI API key is missing. Please set OPENAI_API_KEY in your .env file.' 
            } 
        });
    }

    try {
        // Check cache first
        const cachedResult = getCachedNews(category, query);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        console.log(`Making fresh API call for ${category}`);

        const systemPrompt = `You are a professional news analyst. Generate exactly 3 current news articles for the ${category} category. 

IMPORTANT: Return ONLY a valid JSON object in this exact format:
{
  "category": "${category}",
  "articles": [
    {
      "title": "Clear, engaging headline",
      "summary": "Comprehensive 2-3 sentence summary of the news",
      "importance": 4,
      "verification_note": "Brief note about source credibility",
      "relevance_score": 85
    }
  ]
}

Requirements:
- importance: integer 1-5 (global impact rating)
- relevance_score: integer 70-100 (credibility score)
- Make articles realistic and current
- Focus on factual, verifiable content
- No markdown, just plain JSON`;

        const userPrompt = `Generate 3 current news articles for: ${query}`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        console.log('Raw OpenAI response:', content);

        // Parse the JSON response
        let newsData;
        try {
            newsData = JSON.parse(content);
        } catch (parseError) {
            console.error('Failed to parse OpenAI response as JSON:', parseError);
            // Fallback response
            newsData = {
                category: category,
                articles: [
                    {
                        title: `Latest ${category} updates`,
                        summary: "Unable to fetch specific news at this time. Please try again later.",
                        importance: 3,
                        verification_note: "System-generated fallback response",
                        relevance_score: 75
                    }
                ]
            };
        }

        // Cache the result
        setCachedNews(category, query, newsData);

        console.log('Processed news data:', newsData);
        res.json(newsData);

    } catch (error) {
        console.error('Error fetching news:', error);
        
        let errorMessage = 'Failed to fetch news';
        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({ 
            error: { 
                message: errorMessage 
            } 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`API Key configured: ${!!API_KEY}`);
});
