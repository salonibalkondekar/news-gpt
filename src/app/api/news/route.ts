import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { globalCache, MemoryCache } from '@/lib/cache';
import { globalRateLimiter, getClientIP } from '@/lib/rateLimit';

interface Citation {
  type: 'url_citation';
  url_citation: {
    end_index: number;
    start_index: number;
    title: string;
    url: string;
  };
}

interface WebSearchOptions {
  search_context_size: 'low' | 'medium' | 'high';
  user_location?: {
    type: 'approximate';
    approximate: {
      country?: string;
      city?: string;
      region?: string;
    };
  };
}

interface SearchOptions {
  searchContextSize?: 'low' | 'medium' | 'high';
  location?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
  };
  maxArticles?: number;
  [key: string]: unknown;
}

interface NewsResponse {
  articles: NewsArticle[];
  category: string;
  cached: boolean;
  searchTime: number;
  timestamp: string;
  citations: number;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  sources: string[];
  sourceUrls: string[];
  credibilityScore: number;
  factCheck: string;
  timestamp: string;
}

interface APIError {
  error: string;
  code?: string;
  details?: string;
  timestamp: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    // Parse request body
    let requestData;
    try {
      requestData = await request.json();
    } catch {
      return createErrorResponse(
        'Invalid JSON in request body',
        400,
        'INVALID_JSON',
        'Please ensure your request body contains valid JSON'
      );
    }

    const { query, category, searchOptions = {} }: { 
      query: string; 
      category: string; 
      searchOptions?: SearchOptions 
    } = requestData;

    // Validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return createErrorResponse(
        'Query is required and must be a non-empty string',
        400,
        'INVALID_QUERY'
      );
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return createErrorResponse(
        'Category is required and must be a non-empty string',
        400,
        'INVALID_CATEGORY'
      );
    }

    // Rate limiting
    const rateLimitResult = await globalRateLimiter.checkLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'Rate limit exceeded',
        429,
        'RATE_LIMIT_EXCEEDED',
        `Too many requests. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60)} minutes.`,
        {
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime
        }
      );
    }

    const {
      searchContextSize = 'medium',
      location = {},
      maxArticles = 3
    } = searchOptions;

    // Validate searchOptions
    if (maxArticles && (typeof maxArticles !== 'number' || maxArticles < 1 || maxArticles > 10)) {
      return createErrorResponse(
        'maxArticles must be a number between 1 and 10',
        400,
        'INVALID_MAX_ARTICLES'
      );
    }

    if (searchContextSize && !['low', 'medium', 'high'].includes(searchContextSize)) {
      return createErrorResponse(
        'searchContextSize must be one of: low, medium, high',
        400,
        'INVALID_SEARCH_CONTEXT'
      );
    }

    // Check cache first
    const cacheKey = MemoryCache.generateNewsKey(query, category, searchOptions);
    const cachedResponse = globalCache.get<NewsResponse>(cacheKey);
    
    if (cachedResponse) {
      console.log(`[Cache] Hit for key: ${cacheKey}`);
      return NextResponse.json({
        ...cachedResponse,
        cached: true,
        searchTime: Date.now() - startTime
      });
    }

    console.log(`[Cache] Miss for key: ${cacheKey}`);

    // Prepare web search options
    const webSearchOptions: WebSearchOptions = {
      search_context_size: searchContextSize,
    };

    // Add location if provided and valid
    if (location.country || location.city || location.region) {
      webSearchOptions.user_location = {
        type: 'approximate',
        approximate: {
          ...(location.country && { country: location.country }),
          ...(location.city && { city: location.city }),
          ...(location.region && { region: location.region }),
        }
      };
    }

    // Multi-stage prompting approach for structured output
    const stage1Prompt = `Search for recent news about: "${query.trim()}". Find ${maxArticles} distinct, factual news articles from credible sources.`;
    
    // Stage 1: Initial search and information gathering
    let stage1Response;
    try {
      stage1Response = await openai.chat.completions.create({
        model: 'gpt-4o-search-preview',
        web_search_options: webSearchOptions,
        messages: [{ role: 'user', content: stage1Prompt }]
      });
    } catch (error) {
      console.error('[OpenAI] Stage 1 Error:', error);
      throw error;
    }

    const stage1Content = stage1Response.choices?.[0]?.message?.content || '';
    const stage1Citations = stage1Response.choices?.[0]?.message?.annotations || [];
    
    if (!stage1Content) {
      throw new Error('No content from Stage 1 search');
    }

    // Extract real URLs from annotations
    const realUrls = stage1Citations
      .filter((annotation: Citation) => annotation.type === 'url_citation')
      .map((annotation: Citation) => ({
        url: annotation.url_citation?.url || '',
        title: annotation.url_citation?.title || '',
        start_index: annotation.url_citation?.start_index || 0,
        end_index: annotation.url_citation?.end_index || 0
      }));

    // Stage 2: Structure and analyze the content
    const stage2Prompt = `Based on this search content, create exactly ${maxArticles} structured news articles.

Content to analyze:
${stage1Content}

Available source URLs with titles:
${realUrls.map((url, i) => `${i + 1}. "${url.title}" - ${url.url}`).join('\n')}

For each article, analyze and provide:
1. Importance score (1-10) based on impact and relevance
2. Credibility assessment of sources  
3. Key facts and verification status
4. Proper categorization

Structure your response as ${maxArticles} distinct articles with clear separation.`;

    // Stage 2: Analyze and structure content  
    let stage2Response;
    try {
      stage2Response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use mini for analysis, no web search needed
        messages: [{ role: 'user', content: stage2Prompt }]
      });
    } catch (openAIError: unknown) {
      console.error('[OpenAI] API Error:', openAIError);
      
      // Handle specific OpenAI errors
      if (openAIError && typeof openAIError === 'object' && 'status' in openAIError) {
        const error = openAIError as { status: number; message?: string };
        
        if (error.status === 401) {
          return createErrorResponse(
            'Invalid OpenAI API key',
            500,
            'OPENAI_AUTH_ERROR',
            'Please check your OpenAI API key configuration'
          );
        }
        
        if (error.status === 429) {
          return createErrorResponse(
            'OpenAI rate limit exceeded',
            503,
            'OPENAI_RATE_LIMIT',
            'OpenAI API is temporarily unavailable. Please try again later.'
          );
        }

        if (error.status >= 500) {
          return createErrorResponse(
            'OpenAI service unavailable',
            503,
            'OPENAI_SERVICE_ERROR',
            'OpenAI service is temporarily unavailable. Please try again later.'
          );
        }
      }

      return createErrorResponse(
        'Failed to process request with OpenAI',
        500,
        'OPENAI_UNKNOWN_ERROR',
        (openAIError as Error).message || 'Unknown error occurred while processing your request'
      );
    }

    const stage2Content = stage2Response.choices?.[0]?.message?.content || '';
    if (!stage2Content) {
      throw new Error('No content from Stage 2 analysis');
    }

    // Stage 3: Generate final structured JSON output with strict format
    const stage3Prompt = `Based on the analyzed content, create exactly ${maxArticles} distinct news articles in valid JSON format.

Analyzed content:
${stage2Content}

Available sources (use these exact URLs and titles):
${realUrls.map((url, i) => `${i + 1}. Title: "${url.title}"\n   URL: ${url.url}`).join('\n\n')}

IMPORTANT: Return ONLY valid JSON array, no additional text or commentary.

Format (exactly as shown):
[
  {
    "headline": "Unique compelling headline for article 1",
    "summary": "Brief 2-sentence summary of key facts",
    "content": "Detailed content with main information",
    "importanceScore": 8,
    "sourceTitle": "Use exact title from sources above",
    "sourceUrl": "Use exact URL from sources above",
    "credibilityLevel": "High",
    "verificationStatus": "Verified"
  },
  {
    "headline": "Different headline for article 2",
    "summary": "Different summary for article 2",
    "content": "Different content for article 2",
    "importanceScore": 7,
    "sourceTitle": "Different source title",
    "sourceUrl": "Different source URL",
    "credibilityLevel": "High",
    "verificationStatus": "Verified"
  }
]

Ensure each article has unique content and different source URLs. No duplicate headlines or content.`;

    // Stage 3: Generate structured output
    let stage3Response;
    try {
      stage3Response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: stage3Prompt }]
      });
    } catch (openAIError: unknown) {
      console.error('[OpenAI] Stage 3 Error:', openAIError);
      throw openAIError;
    }

    const stage3Content = stage3Response.choices?.[0]?.message?.content || '';
    if (!stage3Content) {
      throw new Error('No content from Stage 3 JSON generation');
    }

    // Parse JSON response with robust error handling
    let structuredArticles;
    try {
      // Clean the response content
      const cleanedContent = stage3Content.trim();
      
      // Extract JSON array using multiple strategies
      let jsonString = '';
      
      // Strategy 1: Look for complete JSON array
      const fullJsonMatch = cleanedContent.match(/\[\s*\{[\s\S]*\}\s*\]/g);
      if (fullJsonMatch && fullJsonMatch.length > 0) {
        jsonString = fullJsonMatch[0];
      } else {
        // Strategy 2: Look for array brackets and extract content
        const startIndex = cleanedContent.indexOf('[');
        const endIndex = cleanedContent.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonString = cleanedContent.substring(startIndex, endIndex + 1);
        } else {
          // Strategy 3: Try to find JSON-like content
          const objectMatches = cleanedContent.match(/\{[^{}]*"headline"[^{}]*\}/g);
          if (objectMatches && objectMatches.length > 0) {
            jsonString = '[' + objectMatches.join(',') + ']';
          } else {
            throw new Error('No valid JSON structure found');
          }
        }
      }
      
      console.log('[JSON] Attempting to parse:', jsonString.substring(0, 200) + '...');
      structuredArticles = JSON.parse(jsonString);
      
      // Validate the parsed data
      if (!Array.isArray(structuredArticles) || structuredArticles.length === 0) {
        throw new Error('Parsed result is not a valid array');
      }
      
      console.log(`[JSON] Successfully parsed ${structuredArticles.length} articles`);
      
    } catch (parseError) {
      console.error('[JSON] Parse error:', parseError);
      console.error('[JSON] Failed content:', stage3Content.substring(0, 500));
      
      // Enhanced fallback: Create structured articles from stage2 content
      const articles = createStructuredArticlesFromContent(stage2Content, realUrls, category, maxArticles);
      return NextResponse.json({
        articles,
        category,
        cached: false,
        searchTime: (Date.now() - startTime) / 1000,
        timestamp: new Date().toISOString(),
        citations: stage1Citations.length,
        fallbackUsed: true
      });
    }

    // Convert structured articles to NewsArticle format with unique URL assignment
    const articles: NewsArticle[] = structuredArticles.slice(0, maxArticles).map((article: {
      headline?: string;
      summary?: string;
      content?: string;
      sourceTitle?: string;
      sourceUrl?: string;
      importanceScore?: number;
      verificationStatus?: string;
    }, index: number) => {
      // Assign URLs cyclically to ensure variety and prevent duplication
      const urlIndex = index % realUrls.length;
      const fallbackUrl = realUrls[urlIndex] || { url: '', title: 'Web Search Result' };
      
      // Use article's URL if valid, otherwise use fallback
      const finalUrl = (article.sourceUrl && article.sourceUrl.startsWith('http')) ? 
        article.sourceUrl : fallbackUrl.url;
      const finalTitle = (article.sourceTitle && article.sourceTitle.length > 5) ? 
        article.sourceTitle : fallbackUrl.title;
      
      return {
        id: `${category}-${Date.now()}-${index}`,
        title: article.headline || `${category} News Update ${index + 1}`,
        summary: article.summary || 'Summary not available',
        content: article.content || 'Content not available',
        category,
        sources: [finalTitle],
        sourceUrls: [finalUrl],
        credibilityScore: article.importanceScore || 7,
        factCheck: article.verificationStatus || 'Verified through web search',
        timestamp: new Date().toISOString(),
      };
    });

    if (articles.length === 0) {
      return createErrorResponse(
        'No articles found',
        404,
        'NO_ARTICLES_FOUND',
        'No relevant news articles were found for your query. Try different keywords or categories.'
      );
    }

    const responseData: NewsResponse = {
      articles,
      category,
      cached: false,
      searchTime: (Date.now() - startTime) / 1000,
      timestamp: new Date().toISOString(),
      citations: stage1Citations.length
    };

    // Cache the response
    globalCache.set(cacheKey, responseData);
    console.log(`[Cache] Stored response for key: ${cacheKey}`);

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('[API] Unexpected error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR',
      'An unexpected error occurred. Please try again later.'
    );
  }
}

function createErrorResponse(
  message: string, 
  status: number, 
  code?: string, 
  details?: string,
  rateLimitInfo?: { remaining: number; resetTime: number }
): NextResponse {
  const errorResponse: APIError = {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
    ...(rateLimitInfo && { rateLimitInfo })
  };

  return NextResponse.json(errorResponse, { status });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseNewsResponse(content: string, citations: Citation[], category: string, maxArticles: number): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  // Try multiple parsing strategies
  let articleSections: string[] = [];
  
  // Strategy 1: Split by numbered lists (1., 2., etc.)
  const numberedSections = content.split(/(?=\n\s*\d+\.\s+)/).filter(section => 
    section.trim().length > 100
  );
  
  if (numberedSections.length >= 2) {
    articleSections = numberedSections;
  } else {
    // Strategy 2: Split by headers (##, **Title**, etc.)
    const headerSections = content.split(/(?=\n\s*(?:##|#{1,3}|\*\*[^*]+\*\*))/).filter(section => 
      section.trim().length > 100
    );
    
    if (headerSections.length >= 2) {
      articleSections = headerSections;
    } else {
      // Strategy 3: Split by double newlines and filter meaningful sections
      articleSections = content.split(/\n\s*\n/).filter(section => {
        const trimmed = section.trim();
        return trimmed.length > 100 && 
               !trimmed.startsWith('Source:') &&
               !trimmed.startsWith('Published:') &&
               trimmed.split(' ').length > 15;
      });
    }
  }

  // Process each section to extract article information
  articleSections.forEach((section, index) => {
    if (articles.length >= maxArticles) return;
    
    const cleanSection = section.trim();
    if (cleanSection.length < 100) return;

    // Extract title from the section
    const title = extractEnhancedTitle(cleanSection);
    if (!title) return;

    // Extract content and summary
    const { summary, content: articleContent } = extractEnhancedContent(cleanSection, title);
    
    // Map citations to this article based on content matching
    const articleCitations = findRelevantCitations(citations);
    const { sources, sourceUrls } = extractSources(articleCitations);

    articles.push({
      id: `${category}-${Date.now()}-${index}`,
      title,
      summary,
      content: articleContent,
      category,
      sources,
      sourceUrls,
      credibilityScore: calculateCredibilityScore(sources),
      factCheck: 'Verified through web search',
      timestamp: new Date().toISOString(),
    });
  });

  // Enhanced fallback: If we still don't have articles, create structured fallbacks
  if (articles.length === 0) {
    const fallbackArticles = createFallbackArticles(content, citations, category, maxArticles);
    articles.push(...fallbackArticles);
  }

  // Ensure we don't exceed maxArticles
  return articles.slice(0, maxArticles);
}

function extractEnhancedTitle(section: string): string | null {
  const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
  
  for (const line of lines) {
    // Remove common prefixes and clean the line
    const cleaned = line
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/^#+\s*/, '') // Remove markdown headers
      .replace(/^\*\*(.*?)\*\*/, '$1') // Remove bold formatting
      .replace(/^"(.*?)"/, '$1') // Remove quotes
      .trim();

    // Check if this looks like a title
    if (cleaned.length >= 15 && 
        cleaned.length <= 200 && 
        !cleaned.includes('http') &&
        !cleaned.toLowerCase().startsWith('source:') &&
        !cleaned.toLowerCase().startsWith('published:') &&
        cleaned.split(' ').length >= 3 &&
        cleaned.split(' ').length <= 25) {
      return cleaned;
    }
  }
  return null;
}

function extractEnhancedContent(section: string, title: string): { summary: string; content: string } {
  // Remove the title from the section
  let content = section.replace(title, '').trim();
  
  // Remove common prefixes and formatting
  content = content
    .replace(/^\d+\.\s*/, '')
    .replace(/^#+\s*/, '')
    .replace(/^\*\*(.*?)\*\*/, '')
    .trim();

  // Split into sentences and filter out short ones
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  
  // Create summary from first 2-3 sentences
  const summaryParts = sentences.slice(0, 3).join('. ');
  const summary = summaryParts.length > 300 ? 
    summaryParts.substring(0, 297) + '...' : 
    summaryParts + (summaryParts.endsWith('.') ? '' : '.');

  // Full content is the cleaned section
  const fullContent = content.length > 1000 ? content.substring(0, 997) + '...' : content;

  return { 
    summary: summary || 'News summary not available.',
    content: fullContent || 'Content not available.'
  };
}

function findRelevantCitations(citations: Citation[]): Citation[] {
  if (!citations.length) return [];
  
  // For now, distribute citations evenly across articles
  // In a more advanced implementation, we could match citations to content using text similarity
  return citations;
}

function createFallbackArticles(content: string, citations: Citation[], category: string, maxArticles: number): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  // Split content into paragraphs and create articles from substantial paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 200);
  
  for (let i = 0; i < Math.min(paragraphs.length, maxArticles); i++) {
    const paragraph = paragraphs[i].trim();
    const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2) continue;
    
    // Use first sentence as title
    const title = sentences[0].trim().length > 15 ? 
      sentences[0].trim() : 
      `${category} News Update ${i + 1}`;
      
    const summary = sentences.slice(0, 2).join('. ') + '.';
    const { sources, sourceUrls } = extractSources(citations);
    
    articles.push({
      id: `${category}-${Date.now()}-fallback-${i}`,
      title,
      summary,
      content: paragraph,
      category,
      sources,
      sourceUrls,
      credibilityScore: calculateCredibilityScore(sources),
      factCheck: 'Verified through web search',
      timestamp: new Date().toISOString(),
    });
  }
  
  // If still no articles, create a single comprehensive article
  if (articles.length === 0) {
    const { sources, sourceUrls } = extractSources(citations);
    articles.push({
      id: `${category}-${Date.now()}-comprehensive`,
      title: `Latest ${category.charAt(0).toUpperCase() + category.slice(1)} News`,
      summary: content.substring(0, 200) + '...',
      content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''),
      category,
      sources,
      sourceUrls,
      credibilityScore: calculateCredibilityScore(sources),
      factCheck: 'Verified through web search',
      timestamp: new Date().toISOString(),
    });
  }
  
  return articles;
}


function extractSources(citations: Citation[]): { sources: string[]; sourceUrls: string[] } {
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

function calculateCredibilityScore(sources: string[]): number {
  // Simple credibility scoring based on source recognition
  const knownSources = ['Reuters', 'AP', 'BBC', 'CNN', 'Fox News', 'NPR', 'Wall Street Journal', 'New York Times'];
  const score = sources.reduce((acc, source) => {
    const isKnown = knownSources.some(known => source.toLowerCase().includes(known.toLowerCase()));
    return acc + (isKnown ? 2 : 1);
  }, 5);
  
  return Math.min(score, 10);
}

function createStructuredArticlesFromContent(
  content: string, 
  realUrls: Array<{url: string; title: string; start_index: number; end_index: number}>, 
  category: string, 
  maxArticles: number
): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  // Remove common LLM intro phrases
  const cleanedContent = content
    .replace(/^Here are \d+ recent news articles?/i, '')
    .replace(/^Based on the search results?/i, '')
    .replace(/^I found \d+ articles?/i, '')
    .trim();
  
  // Split by common article separators
  const articleSections = cleanedContent
    .split(/(?:\n\s*\n|\d+\.\s+|Article \d+:|##\s+)/)
    .filter(section => section.trim().length > 100)
    .slice(0, maxArticles);
  
  for (let i = 0; i < Math.min(articleSections.length, maxArticles); i++) {
    const section = articleSections[i].trim();
    const lines = section.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 2) continue;
    
    // Extract headline (first substantial line)
    const headline = lines[0]
      .replace(/^\d+\.\s*/, '')
      .replace(/^[#*-]\s*/, '')
      .trim() || `${category} News Update ${i + 1}`;
    
    // Extract content (remaining lines)
    const contentLines = lines.slice(1).join(' ').trim();
    const summary = contentLines.length > 200 ? 
      contentLines.substring(0, 197) + '...' : 
      contentLines;
    
    // Assign URLs cyclically to ensure variety
    const urlIndex = i % realUrls.length;
    const assignedUrl = realUrls[urlIndex] || { url: '', title: 'Web Search Result' };
    
    articles.push({
      id: `${category}-${Date.now()}-${i}`,
      title: headline,
      summary,
      content: contentLines,
      category,
      sources: [assignedUrl.title],
      sourceUrls: [assignedUrl.url],
      credibilityScore: 7,
      factCheck: 'Verified through web search',
      timestamp: new Date().toISOString(),
    });
  }
  
  return articles;
}
