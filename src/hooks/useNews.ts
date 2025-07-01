import { useState, useCallback, useEffect } from 'react';
import { NewsResponse, LoadingState, ApiError } from '@/types/news';
import { newsService } from '@/lib/newsService';
import { LocalStorageManager } from '@/lib/localStorage';

export function useNews() {
  const [newsData, setNewsData] = useState<Record<string, NewsResponse>>({});
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    stage: '',
    progress: 0
  });
  const [error, setError] = useState<ApiError | null>(null);
  const [isRestoredFromCache, setIsRestoredFromCache] = useState(false);

  // Restore news data from localStorage on mount
  useEffect(() => {
    const cachedData = LocalStorageManager.loadNewsData();
    if (cachedData && Object.keys(cachedData).length > 0) {
      setNewsData(cachedData);
      setIsRestoredFromCache(true);
      console.log('[useNews] Restored news data from localStorage');
    }
  }, []);

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
        
        // Save to localStorage
        LocalStorageManager.saveNewsData(results);
        setIsRestoredFromCache(false);
      } else {
        setLoading(prev => ({ ...prev, stage: `Fetching ${category} news...`, progress: 50 }));
        
        const result = await newsService.fetchNews(category);
        
        setNewsData(prev => {
          const updated = { ...prev, [category]: result };
          // Save updated data to localStorage
          LocalStorageManager.saveNewsData(updated);
          return updated;
        });
        setLoading(prev => ({ ...prev, stage: 'Complete!', progress: 100 }));
        setIsRestoredFromCache(false);
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
    LocalStorageManager.clearNewsData();
    setNewsData({});
    setError(null);
    setIsRestoredFromCache(false);
  }, []);

  const setApiKey = useCallback((apiKey: string) => {
    newsService.setApiKey(apiKey);
  }, []);

  // Get cache info for display
  const cacheInfo = LocalStorageManager.getCacheInfo();

  return {
    newsData,
    loading,
    error,
    fetchNews,
    clearCache,
    setApiKey,
    isRestoredFromCache,
    cacheInfo
  };
}
