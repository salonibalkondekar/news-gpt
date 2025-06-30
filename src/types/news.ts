export interface NewsCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  class: string;
  queries: string[];
}

export interface NewsArticle {
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
  searchTime?: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  category: string;
  cached: boolean;
  searchTime: number;
  timestamp: string;
}

export interface CacheEntry {
  data: NewsResponse;
  timestamp: number;
}

export interface LoadingState {
  isLoading: boolean;
  stage: string;
  progress: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface SearchSettings {
  searchContextSize: 'low' | 'medium' | 'high';
  location: {
    country: string;
    city: string;
    region: string;
    timezone: string;
  };
  enableCitations: boolean;
  maxArticles: number;
  language: string;
}

export interface Citation {
  type: 'url_citation';
  url_citation: {
    end_index: number;
    start_index: number;
    title: string;
    url: string;
  };
}

export interface OpenAISearchResponse {
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      refusal: null;
      annotations?: Citation[];
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
