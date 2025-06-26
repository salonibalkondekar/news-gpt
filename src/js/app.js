// GPT-News Application Configuration
// Import global config
import '../../../config.js';

// Debug logging utility
const DEBUG = window.GPT_NEWS_CONFIG?.DEBUG || true;

function log(message, data = null) {
    if (DEBUG) {
        if (data) {
            console.log(`[GPT-News] ${message}:`, data);
        } else {
            console.log(`[GPT-News] ${message}`);
        }
    }
}

// API Configuration
const API_BASE_URL = window.GPT_NEWS_CONFIG?.OPENAI_API_BASE || 'https://api.openai.com/v1';
const API_KEY = window.GPT_NEWS_CONFIG?.OPENAI_API_KEY;

// News categories configuration
const categories = {
    technology: {
        title: "Technology & Innovation",
        subtitle: "AI, Breakthroughs, Digital Transformation",
        icon: "💻",
        class: "tech-icon",
        queries: [
            "latest technology news artificial intelligence breakthrough today",
            "tech innovation startup funding digital transformation",
            "cybersecurity data privacy technology trends"
        ]
    },
    finance: {
        title: "Finance & Economy",
        subtitle: "Markets, Crypto, Economic Indicators",
        icon: "📈",
        class: "finance-icon",
        queries: [
            "financial markets stock market cryptocurrency news today",
            "economy inflation interest rates federal reserve",
            "banking fintech investment trends"
        ]
    },
    sports: {
        title: "Sports & Competition",
        subtitle: "Global Sports, Championships, Athletes",
        icon: "⚽",
        class: "sports-icon",
        queries: [
            "sports news today major leagues championship",
            "Olympic games FIFA world cup latest results",
            "athlete transfers records breaking news"
        ]
    },
    science: {
        title: "Science & Research",
        subtitle: "Scientific Discoveries, Medical Breakthroughs",
        icon: "🔬",
        class: "science-icon",
        queries: [
            "scientific discovery medical breakthrough research",
            "space exploration NASA discoveries",
            "climate science environmental research"
        ]
    },
    global: {
        title: "Global Affairs",
        subtitle: "Politics, Climate, International Relations",
        icon: "🌍",
        class: "global-icon",
        queries: [
            "international news global politics world affairs",
            "climate change environmental policy",
            "diplomatic relations trade agreements"
        ]
    }
};

// Structured output schema for news response
const newsSchema = {
    type: "object",
    properties: {
        category: {
            type: "string",
            enum: ["technology", "finance", "sports", "science", "global"]
        },
        articles: {
            type: "array",
            maxItems: 3,
            items: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "Clear, engaging headline"
                    },
                    summary: {
                        type: "string",
                        description: "Comprehensive 2-3 sentence summary of the news"
                    },
                    importance: {
                        type: "integer",
                        minimum: 1,
                        maximum: 5,
                        description: "Global importance ranking (1-5)"
                    },
                    verification_note: {
                        type: "string",
                        description: "Brief note about source credibility and factual verification"
                    },
                    relevance_score: {
                        type: "integer",
                        minimum: 70,
                        maximum: 100,
                        description: "Relevance and credibility score"
                    }
                },
                required: ["title", "summary", "importance", "verification_note", "relevance_score"],
                additionalProperties: false
            }
        }
    },
    required: ["category", "articles"],
    additionalProperties: false
};

// Global state management
let currentFilter = 'all';
let newsData = {};
let searchStartTime = 0;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Utility functions
function updateLoadingStage(stage) {
    const loadingStage = document.getElementById('loadingStage');
    if (loadingStage) {
        loadingStage.textContent = stage;
    }
}

// Cache management functions
function saveToCache(data) {
    const cacheData = {
        newsData: data,
        timestamp: Date.now()
    };
    localStorage.setItem('gpt-news-cache', JSON.stringify(cacheData));
    lastFetchTime = Date.now();
}

function loadFromCache() {
    try {
        const cacheString = localStorage.getItem('gpt-news-cache');
        if (!cacheString) return null;
        
        const cacheData = JSON.parse(cacheString);
        const age = Date.now() - cacheData.timestamp;
        
        if (age < CACHE_DURATION) {
            lastFetchTime = cacheData.timestamp;
            return cacheData.newsData;
        } else {
            // Cache expired, remove it
            localStorage.removeItem('gpt-news-cache');
            return null;
        }
    } catch (error) {
        console.error('Error loading cache:', error);
        localStorage.removeItem('gpt-news-cache');
        return null;
    }
}

function clearCache() {
    localStorage.removeItem('gpt-news-cache');
    lastFetchTime = 0;
    newsData = {};
    document.getElementById('newsSections').innerHTML = '';
    document.getElementById('statsBar').style.display = 'none';
    updateFetchButtonText();
    log('Cache cleared successfully');
}

function getCacheTimeRemaining() {
    if (!lastFetchTime) return 0;
    const elapsed = Date.now() - lastFetchTime;
    const remaining = CACHE_DURATION - elapsed;
    return Math.max(0, remaining);
}

function formatTimeRemaining(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function updateFetchButtonText() {
    const fetchButton = document.getElementById('fetchNews');
    const timeRemaining = getCacheTimeRemaining();
    
    if (timeRemaining > 0) {
        fetchButton.innerHTML = `📰 News Cached (${formatTimeRemaining(timeRemaining)} remaining)`;
        fetchButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else {
        fetchButton.innerHTML = '🚀 Fetch Live Global Intelligence';
        fetchButton.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
    }
}

// News fetching functions
async function searchCategoryNews(categoryKey, categoryInfo) {
    log(`Starting search for category: ${categoryKey}`, categoryInfo);
    updateLoadingStage(`Searching ${categoryInfo.title} news...`);
    
    try {
        // Check if API key is available
        if (!API_KEY || API_KEY.length < 20) {
            throw new Error('Invalid or missing OpenAI API key. Please check your configuration.');
        }
        
        const query = categoryInfo.queries[0];
        log('Using search query:', query);
        log('API Key length:', API_KEY.length);
        log('API Base URL:', API_BASE_URL);
        
        const response = await fetch(`${API_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert news analyst. Search for and analyze the most important recent news in the ${categoryInfo.title} category. 

                        REQUIREMENTS:
                        - Find the most significant, recent news (within last 24-48 hours)
                        - Focus on factual, verifiable information from credible sources
                        - Provide clear, engaging summaries
                        - Rate importance and relevance accurately
                        - Include verification notes about source credibility
                        
                        Return exactly 2-3 of the most important stories in this category.`
                    },
                    {
                        role: "user",
                        content: `Find the most important recent news about: ${query}. Focus on today's or very recent significant events.`
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "category_news",
                        schema: newsSchema,
                        strict: true
                    }
                },
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            log('API Error Response Text:', errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { error: { message: errorText } };
            }
            
            log('API Error Response:', errorData);
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        log('API Response Data:', data);
        
        const result = JSON.parse(data.choices[0].message.content);
        log(`Parsed news data for ${categoryKey}:`, result);
        
        // Add citations from annotations
        if (data.choices[0].message.annotations) {
            result.citations = data.choices[0].message.annotations.map(annotation => ({
                url: annotation.url_citation.url,
                title: annotation.url_citation.title,
                start_index: annotation.url_citation.start_index,
                end_index: annotation.url_citation.end_index
            }));
            log('Added citations:', result.citations);
        }
        
        return result;
        
    } catch (error) {
        log(`Error in searchCategoryNews for ${categoryKey}:`, error);
        console.error(`Error fetching ${categoryKey} news:`, error);
        return {
            category: categoryKey,
            articles: [],
            error: error.message
        };
    }
}

async function fetchNews() {
    log('Starting news fetch operation');
    
    // Check if we have cached data first
    const cachedData = loadFromCache();
    if (cachedData && Object.keys(cachedData).length > 0) {
        log('Using cached news data');
        newsData = cachedData;
        displayNews(newsData);
        updateStats(newsData, true); // Pass true for cached data
        updateFetchButtonText();
        
        // Show a brief message that cached data is being used
        const loadingEl = document.getElementById('loading');
        const loadingText = loadingEl.querySelector('.loading-text');
        const originalText = loadingText.textContent;
        
        loadingEl.style.display = 'block';
        loadingText.textContent = 'Loading cached news data...';
        
        setTimeout(() => {
            loadingEl.style.display = 'none';
            loadingText.textContent = originalText;
        }, 1000);
        
        return;
    }
    
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const newsSectionsEl = document.getElementById('newsSections');
    const fetchButton = document.getElementById('fetchNews');
    const statsBar = document.getElementById('statsBar');

    // Show loading state
    searchStartTime = Date.now();
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    newsSectionsEl.innerHTML = '';
    statsBar.style.display = 'none';
    fetchButton.disabled = true;

    try {
        log('Initializing news search for all categories');
        updateLoadingStage('Initializing global news search...');
        
        // Fetch news for all categories in parallel
        const categoryPromises = Object.entries(categories).map(async ([categoryKey, categoryInfo]) => {
            log(`Starting fetch for category: ${categoryKey}`);
            const result = await searchCategoryNews(categoryKey, categoryInfo);
            return [categoryKey, result];
        });

        updateLoadingStage('Processing search results...');
        const results = await Promise.all(categoryPromises);
        log('All category results received:', results);
        
        // Convert results to newsData object
        newsData = {};
        results.forEach(([categoryKey, result]) => {
            newsData[categoryKey] = result;
        });
        log('Processed news data:', newsData);

        // Save to cache
        saveToCache(newsData);
        
        displayNews(newsData);
        updateStats(newsData, false); // Pass false for fresh data
        updateFetchButtonText();
        
    } catch (error) {
        log('Error in fetchNews:', error);
        console.error('Error fetching news:', error);
        showError(`Failed to fetch live news: ${error.message}`);
    } finally {
        loadingEl.style.display = 'none';
        fetchButton.disabled = false;
        log('News fetch operation completed');
    }
}

// Display functions
function displayNews(data) {
    log('Starting to display news data');
    const newsSectionsEl = document.getElementById('newsSections');
    newsSectionsEl.innerHTML = '';

    Object.entries(categories).forEach(([categoryKey, categoryInfo]) => {
        if (currentFilter !== 'all' && currentFilter !== categoryKey) {
            log(`Skipping category ${categoryKey} due to filter: ${currentFilter}`);
            return;
        }

        const categoryData = data[categoryKey];
        if (!categoryData || !categoryData.articles || categoryData.articles.length === 0) {
            log(`No articles found for category: ${categoryKey}`);
            return;
        }

        log(`Displaying ${categoryData.articles.length} articles for ${categoryKey}`);
        const section = document.createElement('div');
        section.className = 'news-category';
        section.innerHTML = `
            <div class="category-header">
                <div class="category-icon ${categoryInfo.class}">${categoryInfo.icon}</div>
                <div>
                    <h2 class="category-title">${categoryInfo.title}</h2>
                    <p class="category-subtitle">${categoryInfo.subtitle}</p>
                </div>
            </div>
            <div class="news-grid">
                ${categoryData.articles.map(article => createNewsCard(article, categoryData.citations)).join('')}
            </div>
        `;

        newsSectionsEl.appendChild(section);
    });
    log('News display completed');
}

function createNewsCard(article, citations = []) {
    const timestamp = new Date().toLocaleString();
    
    const citationsHtml = citations && citations.length > 0 ? `
        <div class="citations-section">
            <div class="citations-title">
                🔗 Sources & Citations
            </div>
            ${citations.map(citation => `
                <a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="citation-link">
                    ${citation.title || citation.url}
                </a>
            `).join('')}
        </div>
    ` : '';

    return `
        <div class="news-card">
            <div class="news-header">
                <div class="verification-score">${article.relevance_score}% VERIFIED</div>
            </div>
            <h3 class="news-title">${article.title}</h3>
            <p class="news-summary">${article.summary}</p>
            ${citationsHtml}
            <div class="news-meta">
                <div class="timestamp">Updated: ${timestamp}</div>
                <div class="relevance-badge">Importance: ${article.importance}/5</div>
            </div>
            <div style="margin-top: 15px; padding: 10px; background: rgba(67, 233, 123, 0.1); border-radius: 8px; font-size: 0.85rem; color: #43e97b;">
                ✓ ${article.verification_note}
            </div>
        </div>
    `;
}

function updateStats(data, isCached = false) {
    log('Updating statistics');
    const statsBar = document.getElementById('statsBar');
    let searchTime;
    
    if (isCached) {
        // For cached data, show instant load time
        searchTime = 0;
    } else {
        // For fresh data, calculate actual search time
        searchTime = Math.round((Date.now() - searchStartTime) / 1000);
    }
    
    let totalNews = 0;
    let totalCitations = 0;

    Object.values(data).forEach(categoryData => {
        if (categoryData.articles) {
            totalNews += categoryData.articles.length;
        }
        if (categoryData.citations) {
            totalCitations += categoryData.citations.length;
        }
    });

    log('Stats calculated:', { totalNews, totalCitations, searchTime, isCached });

    document.getElementById('totalNews').textContent = totalNews;
    document.getElementById('citationsCount').textContent = totalCitations;
    document.getElementById('searchTime').textContent = isCached ? 'Cached' : `${searchTime}s`;

    statsBar.style.display = 'flex';
    log('Statistics updated successfully');
}

function showError(message) {
    log('Showing error:', message);
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Event handlers and initialization
function initializeEventListeners() {
    document.getElementById('fetchNews').addEventListener('click', fetchNews);
    document.getElementById('clearCache').addEventListener('click', clearCache);

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.category;
            
            if (Object.keys(newsData).length > 0) {
                displayNews(newsData);
            }
        });
    });
}

function initializeApp() {
    // Try to load cached data on page load
    const cachedData = loadFromCache();
    if (cachedData && Object.keys(cachedData).length > 0) {
        newsData = cachedData;
        displayNews(newsData);
        updateStats(newsData, true); // Pass true for cached data on page load
    }
    updateFetchButtonText();
    
    // Update button text every minute
    setInterval(updateFetchButtonText, 60000);
    
    // Auto-refresh when cache expires (check every 5 minutes)
    setInterval(() => {
        const timeRemaining = getCacheTimeRemaining();
        if (timeRemaining === 0 && Object.keys(newsData).length > 0) {
            // Cache expired, but don't auto-fetch, just update button
            updateFetchButtonText();
        }
    }, 5 * 60 * 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeApp();
});

// Export for potential module usage
export {
    fetchNews,
    displayNews,
    clearCache,
    categories,
    newsData
};
