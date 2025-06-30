import { useState, useCallback } from 'react';
import { NewsResponse, LoadingState, ApiError } from '@/types/news';
import { newsService } from '@/lib/newsService';

export function useNews() {
  const [newsData, setNewsData] = useState<Record<string, NewsResponse>>({});
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    stage: '',
    progress: 0
  });
  const [error, setError] = useState<ApiError | null>(null);

  const fetchNews = useCallback(async (category: string = 'all') => {
    setLoading({
      isLoading: true,
      stage: 'Stage 1: Searching web for latest news...',
      progress: 10
    });
    setError(null);

    try {
      if (category === 'all') {
        setLoading(prev => ({ ...prev, stage: 'Fetching news from multiple sources...', progress: 25 }));
        
        const results = await newsService.fetchAllCategories();
        
        setLoading(prev => ({ ...prev, stage: 'Processing complete!', progress: 100 }));
        setNewsData(results);
      } else {
        setLoading(prev => ({ ...prev, stage: `Fetching ${category} news...`, progress: 50 }));
        
        const result = await newsService.fetchNews(category);
        
        setNewsData(prev => ({ ...prev, [category]: result }));
        setLoading(prev => ({ ...prev, stage: 'Complete!', progress: 100 }));
      }
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'Failed to fetch news',
        code: 'FETCH_ERROR'
      };
      setError(apiError);
    } finally {
      setTimeout(() => {
        setLoading({
          isLoading: false,
          stage: '',
          progress: 0
        });
      }, 300);
    }
  }, []);

  const clearCache = useCallback(() => {
    newsService.clearCache();
    setNewsData({});
    setError(null);
  }, []);

  const setApiKey = useCallback((apiKey: string) => {
    newsService.setApiKey(apiKey);
  }, []);

  return {
    newsData,
    loading,
    error,
    fetchNews,
    clearCache,
    setApiKey
  };
}
