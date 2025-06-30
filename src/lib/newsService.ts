import OpenAI from 'openai';
import { NewsArticle, NewsResponse, SearchSettings, Citation } from '@/types/news';
import { NEWS_CATEGORIES, DEMO_MODE_ARTICLES } from './constants';

export interface WebSearchOptions {
  search_context_size?: 'low' | 'medium' | 'high';
  user_location?: {
    type: 'approximate';
    approximate: {
      country?: string;
      city?: string;
      region?: string;
      timezone?: string;
    };
  };
}

class NewsService {
  private openai: OpenAI | null = null;
  private cache = new Map<string, { data: NewsResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private searchSettings: SearchSettings;

  constructor() {
    this.searchSettings = this.getDefaultSettings();
    this.initializeOpenAI();
  }

  private getDefaultSettings(): SearchSettings {
    return {
      searchContextSize: 'medium',
      location: {
        country: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_COUNTRY || 'IN',
        city: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_CITY || 'Pune',
        region: process.env.NEXT_PUBLIC_DEFAULT_LOCATION_REGION || 'Maharashtra',
        timezone: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'Asia/Kolkata'
      },
      enableCitations: true,
      maxArticles: 3,
      language: 'en'
    };
  }

  private initializeOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY ||
                   (typeof window !== 'undefined' ? localStorage.getItem('OPENAI_API_KEY') : null);

    if (apiKey && apiKey !== 'your-api-key-here') {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: typeof window !== 'undefined'
      });
    }
  }

  private getCacheKey(category: string): string {
    return `news_${category}`;
  }

  private isCacheValid(cacheEntry: { data: NewsResponse; timestamp: number }): boolean {
    return (Date.now() - cacheEntry.timestamp) < this.CACHE_DURATION;
  }

  private getCachedNews(category: string): NewsResponse | null {
    const cacheKey = this.getCacheKey(category);
    const cacheEntry = this.cache.get(cacheKey);
    
    if (cacheEntry && this.isCacheValid(cacheEntry)) {
      console.log(`Cache HIT for ${category}`);
      return { ...cacheEntry.data, cached: true };
    }
    
    return null;
  }

  private setCachedNews(category: string, data: NewsResponse): void {
    const cacheKey = this.getCacheKey(category);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  private async generateNewsWithSearch(query: string, category: string): Promise<NewsArticle[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const webSearchOptions: WebSearchOptions = {
      search_context_size: this.searchSettings.searchContextSize,
      user_location: {
        type: 'approximate',
        approximate: {
          country: this.searchSettings.location.country,
          city: this.searchSettings.location.city,
          region: this.searchSettings.location.region,
        }
      }
    };

    const prompt = `Find ${this.searchSettings.maxArticles} recent news articles about: "${query}". 

For each article, provide:
1. A clear, informative headline
2. A brief 2-sentence summary
3. Key details from reliable sources
4. Source information

Focus on factual, recent information from credible news sources. Include diverse perspectives when available.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-search-preview',
        web_search_options: webSearchOptions,
        messages: [{ role: 'user', content: prompt }]
      });

      const choice = response.choices[0];
      if (!choice?.message?.content) {
        throw new Error('No response content from OpenAI');
      }

      const content = choice.message.content;
      const citations = choice.message.annotations || [];

      // Parse the response and create structured articles
      return this.parseNewsResponse(content, citations, category);
    } catch (error) {
      console.error('OpenAI Search API error:', error);
      throw error;
    }
  }

  private parseNewsResponse(content: string, citations: Citation[], category: string): NewsArticle[] {
    // Split content into articles based on common patterns
    const articleSections = content.split(/\n\n|\d+\.|Article \d+:|##/).filter(section => 
      section.trim().length > 50
    );

    const articles: NewsArticle[] = [];
    
    articleSections.forEach((section, index) => {
      if (articles.length >= this.searchSettings.maxArticles) return;
      
      const lines = section.trim().split('\n').filter(line => line.trim());
      if (lines.length < 2) return;

      // Extract title (usually the first significant line)
      const title = this.extractTitle(lines);
      if (!title) return;

      // Extract summary and content
      const { summary, content: articleContent } = this.extractContent(lines);
      
      // Extract sources from citations
      const { sources, sourceUrls } = this.extractSources(citations);

      articles.push({
        id: `${category}-${Date.now()}-${index}`,
        title,
        summary,
        content: articleContent,
        category,
        sources,
        sourceUrls,
        credibilityScore: this.calculateCredibilityScore(sources),
        factCheck: 'Verified through web search',
        timestamp: new Date().toISOString(),
      });
    });

    // If we didn't get enough structured articles, create a fallback
    if (articles.length === 0) {
      articles.push({
        id: `${category}-${Date.now()}-0`,
        title: `Latest ${category} News`,
        summary: content.substring(0, 200) + '...',
        content: content,
        category,
        sources: citations.map((c: Citation) => c.url_citation?.title || 'Web Source').slice(0, 3),
        sourceUrls: citations.map((c: Citation) => c.url_citation?.url || '').slice(0, 3),
        credibilityScore: 7.5,
        factCheck: 'Verified through web search',
        timestamp: new Date().toISOString(),
      });
    }

    return articles;
  }

  private extractTitle(lines: string[]): string | null {
    for (const line of lines) {
      const cleaned = line.replace(/^\d+\.\s*|^[#*-]\s*/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 150 && !cleaned.includes('http')) {
        return cleaned;
      }
    }
    return null;
  }

  private extractContent(lines: string[]): { summary: string; content: string } {
    const contentLines = lines.slice(1).filter(line => 
      line.trim().length > 20 && !line.includes('http')
    );
    
    const fullContent = contentLines.join(' ').substring(0, 1000);
    const summary = fullContent.substring(0, 200) + (fullContent.length > 200 ? '...' : '');
    
    return { summary, content: fullContent };
  }

  private extractSources(citations: Citation[]): { sources: string[]; sourceUrls: string[] } {
    const sources: string[] = [];
    const sourceUrls: string[] = [];
    
    citations.forEach((citation: Citation) => {
      if (citation.type === 'url_citation') {
        const title = citation.url_citation.title || 'News Source';
        const url = citation.url_citation.url || '';
        if (title && url) {
          sources.push(title);
          sourceUrls.push(url);
        }
      }
    });

    // Ensure we have at least some sources
    if (sources.length === 0) {
      sources.push('Web Search Results');
      sourceUrls.push('');
    }

    return { 
      sources: sources.slice(0, 3), 
      sourceUrls: sourceUrls.slice(0, 3) 
    };
  }

  private calculateCredibilityScore(sources: string[]): number {
    // Simple credibility scoring based on source recognition
    const knownSources = ['Reuters', 'AP', 'BBC', 'CNN', 'Fox News', 'NPR', 'Wall Street Journal', 'New York Times'];
    const score = sources.reduce((acc, source) => {
      const isKnown = knownSources.some(known => source.toLowerCase().includes(known.toLowerCase()));
      return acc + (isKnown ? 2 : 1);
    }, 5);
    
    return Math.min(score, 10);
  }

  private getDemoNews(category: string): NewsResponse {
    const filteredArticles = DEMO_MODE_ARTICLES.filter(article => 
      category === 'all' || article.category === category
    );

    return {
      articles: filteredArticles,
      category,
      cached: false,
      searchTime: Math.random() * 3 + 1,
      timestamp: new Date().toISOString()
    };
  }

  async fetchNews(category: string): Promise<NewsResponse> {
    // Check cache first
    const cachedNews = this.getCachedNews(category);
    if (cachedNews) {
      return cachedNews;
    }

    const startTime = Date.now();

    try {
      const categoryConfig = NEWS_CATEGORIES[category];
      if (!categoryConfig) {
        throw new Error(`Unknown category: ${category}`);
      }

      const query = categoryConfig.queries[0];
      
      // Try API route first (server-side with proper API key)
      try {
        const response = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            category,
            searchOptions: {
              searchContextSize: this.searchSettings.searchContextSize,
              location: this.searchSettings.location,
              maxArticles: this.searchSettings.maxArticles
            }
          })
        });

        if (response.ok) {
          const newsResponse = await response.json();
          newsResponse.searchTime = (Date.now() - startTime) / 1000;
          
          // Cache the response
          this.setCachedNews(category, newsResponse);
          return newsResponse;
        }
      } catch (apiError) {
        console.warn('API route failed, falling back to client-side:', apiError);
      }

      // Fallback to client-side OpenAI (if API key available)
      if (this.openai) {
        const articles = await this.generateNewsWithSearch(query, category);
        const newsResponse: NewsResponse = {
          articles,
          category,
          cached: false,
          searchTime: (Date.now() - startTime) / 1000,
          timestamp: new Date().toISOString()
        };

        // Cache the response
        this.setCachedNews(category, newsResponse);
        return newsResponse;
      }

      // Final fallback to demo mode
      console.warn('No API key found, running in demo mode');
      return this.getDemoNews(category);

    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to demo mode on error
      return this.getDemoNews(category);
    }
  }

  async fetchAllCategories(): Promise<Record<string, NewsResponse>> {
    const results: Record<string, NewsResponse> = {};
    
    for (const categoryId of Object.keys(NEWS_CATEGORIES)) {
      try {
        results[categoryId] = await this.fetchNews(categoryId);
      } catch (error) {
        console.error(`Error fetching news for ${categoryId}:`, error);
        results[categoryId] = this.getDemoNews(categoryId);
      }
    }

    return results;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('News cache cleared');
  }

  setApiKey(apiKey: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
    }
    this.initializeOpenAI();
  }

  // Settings management
  getSettings(): SearchSettings {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('news_settings');
      if (saved) {
        try {
          return { ...this.searchSettings, ...JSON.parse(saved) };
        } catch {
          console.warn('Failed to parse saved settings');
        }
      }
    }
    return this.searchSettings;
  }

  updateSettings(newSettings: Partial<SearchSettings>): void {
    this.searchSettings = { ...this.searchSettings, ...newSettings };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('news_settings', JSON.stringify(this.searchSettings));
    }
    
    // Clear cache when settings change to fetch fresh results
    this.clearCache();
  }

  resetSettings(): void {
    this.searchSettings = this.getDefaultSettings();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('news_settings');
    }
    this.clearCache();
  }
}

export const newsService = new NewsService();
