'use client';

import { useState, useEffect } from 'react';
import { useNews } from '@/hooks/useNews';
import { LocalStorageManager } from '@/lib/localStorage';
import Header from '@/components/Header';
import ControlPanel from '@/components/ControlPanel';
import CategoryFilter from '@/components/CategoryFilter';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { newsData, loading, error, fetchNews, clearCache, isRestoredFromCache, cacheInfo } = useNews();

  // Restore active category from localStorage on mount
  useEffect(() => {
    const savedCategory = LocalStorageManager.loadActiveCategory();
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }
  }, []);

  const handleFetchNews = () => {
    fetchNews(activeCategory);
  };

  const handleClearCache = () => {
    clearCache();
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    LocalStorageManager.saveActiveCategory(category);
  };

  const hasNewsData = Object.keys(newsData).length > 0;

  const filteredNews = activeCategory === 'all' 
    ? Object.values(newsData)
    : newsData[activeCategory] 
      ? [newsData[activeCategory]]
      : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <ControlPanel 
        onFetchNews={handleFetchNews}
        onClearCache={handleClearCache}
        loading={loading}
        hasData={hasNewsData}
        isRestoredFromCache={isRestoredFromCache}
        cacheInfo={cacheInfo}
      />
      
      {loading.isLoading && <Loading loading={loading} />}
      
      {error && !loading.isLoading && (
        <ErrorDisplay error={error} onRetry={handleFetchNews} />
      )}
      
      {!loading.isLoading && !error && filteredNews.length > 0 && (
        <div className="space-y-0">
          {filteredNews.map((newsResponse) => (
            <NewsSection 
              key={newsResponse.category} 
              newsResponse={newsResponse} 
            />
          ))}
        </div>
      )}
      
      {!loading.isLoading && !error && !hasNewsData && (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center py-12 sm:py-20">
            <div className="text-4xl sm:text-6xl mb-4">📰</div>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">No news available</p>
            <p className="text-sm sm:text-base text-gray-500">Click &quot;Get Latest News&quot; to start reading</p>
          </div>
        </div>
      )}
    </main>
  );
}
