// GPT-News Application Configuration
// Import global config
import './config.js';

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
// Try multiple sources for API key in priority order
function getAPIKey() {
    // 1. Client-side config.js file
    if (window.GPT_NEWS_CONFIG?.OPENAI_API_KEY && window.GPT_NEWS_CONFIG.OPENAI_API_KEY !== "your-api-key-here") {
        return window.GPT_NEWS_CONFIG.OPENAI_API_KEY;
    }
    
    // 2. Global window variable (set via console or script)
    if (window.OPENAI_API_KEY && window.OPENAI_API_KEY !== "your-api-key-here") {
        return window.OPENAI_API_KEY;
    }
    
    // 3. Check localStorage for development
    const stored = localStorage.getItem('OPENAI_API_KEY');
    if (stored && stored !== "your-api-key-here") {
        return stored;
    }
    
    return null;
}

const API_BASE_URL = window.GPT_NEWS_CONFIG?.OPENAI_API_BASE || 'https://api.openai.com/v1';
let API_KEY = getAPIKey();

// Function to set API key at runtime
function setAPIKey(key) {
    API_KEY = key;
    localStorage.setItem('OPENAI_API_KEY', key);
    console.log('API key updated for this session');
}

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

// Cache management constants
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = 'gpt_news_cache_';
const CACHE_TIMESTAMP_KEY = 'gpt_news_cache_timestamp';

// Utility functions
function updateLoadingStage(stage) {
    const loadingStage = document.getElementById('loadingStage');
    if (loadingStage) {
        loadingStage.textContent = stage;
    }
}

// Cache management functions
function isCacheValid() {
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!cacheTimestamp) {
        log('No cache timestamp found');
        return false;
    }
    
    const lastFetch = parseInt(cacheTimestamp);
    const now = Date.now();
    const isValid = (now - lastFetch) < CACHE_DURATION;
    
    log(`Cache check: ${isValid ? 'VALID' : 'EXPIRED'}`, {
        lastFetch: new Date(lastFetch).toLocaleString(),
        now: new Date(now).toLocaleString(),
        ageHours: Math.round((now - lastFetch) / (60 * 60 * 1000) * 10) / 10
    });
    
    return isValid;
}

function getCachedNews() {
    if (!isCacheValid()) {
        return null;
    }
    
    try {
        const cachedData = {};
        for (const categoryKey of Object.keys(categories)) {
            const cached = localStorage.getItem(CACHE_KEY_PREFIX + categoryKey);
            if (cached) {
                cachedData[categoryKey] = JSON.parse(cached);
            }
        }
        
        if (Object.keys(cachedData).length > 0) {
            log('Retrieved cached news data', cachedData);
            return cachedData;
        }
    } catch (error) {
        log('Error retrieving cached data:', error);
        clearCache();
    }
    
    return null;
}

function setCachedNews(data) {
    try {
        // Store timestamp
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        
        // Store each category's data
        Object.entries(data).forEach(([categoryKey, categoryData]) => {
            localStorage.setItem(CACHE_KEY_PREFIX + categoryKey, JSON.stringify(categoryData));
        });
        
        log('News data cached successfully', {
            categories: Object.keys(data),
            timestamp: new Date().toLocaleString()
        });
    } catch (error) {
        log('Error caching news data:', error);
        // If storage is full, clear cache and try again
        clearCache();
        try {
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            Object.entries(data).forEach(([categoryKey, categoryData]) => {
                localStorage.setItem(CACHE_KEY_PREFIX + categoryKey, JSON.stringify(categoryData));
            });
        } catch (retryError) {
            log('Failed to cache after clearing:', retryError);
        }
    }
}

function clearCache() {
    try {
        // Remove timestamp
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        
        // Remove all cached category data
        Object.keys(categories).forEach(categoryKey => {
            localStorage.removeItem(CACHE_KEY_PREFIX + categoryKey);
        });
        
        log('Cache cleared successfully');
    } catch (error) {
        log('Error clearing cache:', error);
    }
}

// News fetching functions
async function searchCategoryNews(categoryKey, categoryInfo) {
    log(`Starting search for category: ${categoryKey}`, categoryInfo);
    updateLoadingStage(`Searching ${categoryInfo.title} news...`);
    
    const { BACKEND_URL } = window.GPT_NEWS_CONFIG;
    const NEWS_API_ENDPOINT = `${BACKEND_URL}/api/news`;

    try {
        const query = categoryInfo.queries[0];
        log('Using search query:', query);
        log('Contacting backend API at:', NEWS_API_ENDPOINT);

        const response = await fetch(NEWS_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: categoryKey,
                query: query
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            log('Backend API Error Response Text:', errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { error: { message: errorText } };
            }
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        log(`Parsed news data for ${categoryKey}:`, result);

        // The backend now provides the citations and articles
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
    
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const newsSectionsEl = document.getElementById('newsSections');
    const fetchButton = document.getElementById('fetchNews');

    // Check cache first
    const cachedNews = getCachedNews();
    if (cachedNews) {
        log('Using cached news data');
        newsData = cachedNews;
        displayNews(newsData);
        
        // Update button text to show cached status
        updateFetchButtonText('Fetch News');
        
        return;
    }

    // Show loading state
    searchStartTime = Date.now();
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    newsSectionsEl.innerHTML = '';
    fetchButton.disabled = true;
    updateFetchButtonText('Fetching News...');

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
        
        // Cache the new data
        setCachedNews(newsData);
        
        displayNews(newsData);
        updateFetchButtonText('Fetch News');
        
    } catch (error) {
        log('Error in fetchNews:', error);
        console.error('Error fetching news:', error);
        showError(`Failed to fetch live news: ${error.message}`);
        updateFetchButtonText('Fetch News');
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
                ${categoryData.articles.map(article => createNewsCard(article)).join('')}
            </div>
        `;

        newsSectionsEl.appendChild(section);
    });
    log('News display completed');
}

function createNewsCard(article, citations = []) {
    const timestamp = new Date().toLocaleString();
    
    return `
        <div class="news-card">
            <div class="news-header">
                <div class="verification-score">${article.relevance_score}% VERIFIED</div>
            </div>
            <h3 class="news-title">${article.title}</h3>
            <p class="news-summary">${article.summary}</p>
            <div class="news-meta">
                <div class="timestamp">Updated: ${timestamp}</div>
                <div class="relevance-badge">Importance: ${article.importance}/5</div>
            </div>
            <div class="verification-note">
                <small>📝 ${article.verification_note}</small>
            </div>
        </div>
    `;
}

function showError(message) {
    log('Showing error:', message);
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function updateFetchButtonText(text) {
    const fetchButton = document.getElementById('fetchNews');
    if (fetchButton) {
        fetchButton.textContent = text;
    }
}

function updateCacheStatus() {
    const cacheStatusEl = document.getElementById('cacheStatus');
    const cacheInfoEl = cacheStatusEl?.querySelector('.cache-info');
    
    if (!cacheStatusEl || !cacheInfoEl) return;
    
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cacheTimestamp && isCacheValid()) {
        const cacheAge = Math.round((Date.now() - parseInt(cacheTimestamp)) / (60 * 60 * 1000) * 10) / 10;
        const lastUpdate = new Date(parseInt(cacheTimestamp)).toLocaleString();
        
        cacheInfoEl.textContent = `Cached: ${cacheAge}h ago (${lastUpdate})`;
        cacheStatusEl.style.display = 'flex';
    } else {
        cacheStatusEl.style.display = 'none';
    }
}

// Force refresh function (bypasses cache)
async function forceRefreshNews() {
    log('Force refresh requested - clearing cache');
    clearCache();
    updateCacheStatus();
    await fetchNews();
}

// Event handlers and initialization
function initializeEventListeners() {
    const fetchButton = document.getElementById('fetchNews');
    
    // Regular click for fetch (uses cache if available)
    fetchButton.addEventListener('click', fetchNews);
    
    // Double-click for force refresh (bypasses cache)
    fetchButton.addEventListener('dblclick', (e) => {
        e.preventDefault();
        forceRefreshNews();
    });

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
    // Initial app setup
    log("News GPT Initialized");
    
    // Check for cached data on startup
    const cachedNews = getCachedNews();
    if (cachedNews) {
        log('Loading cached news on startup');
        newsData = cachedNews;
        displayNews(newsData);
        
        // Update button text to show cached status
        updateFetchButtonText('Fetch News');
    } else {
        updateFetchButtonText('Fetch News');
    }
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
    categories,
    newsData,
    forceRefreshNews,
    clearCache,
    isCacheValid
};
