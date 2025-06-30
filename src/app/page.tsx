'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import Header from '@/components/Header';
import ControlPanel from '@/components/ControlPanel';
import CategoryFilter from '@/components/CategoryFilter';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { newsData, loading, error, fetchNews, clearCache } = useNews();

  const handleFetchNews = () => {
    fetchNews(activeCategory);
  };

  const handleClearCache = () => {
    clearCache();
  };

  const hasNewsData = Object.keys(newsData).length > 0;

  const filteredNews = activeCategory === 'all' 
    ? Object.values(newsData)
    : newsData[activeCategory] 
      ? [newsData[activeCategory]]
      : [];

  return (
    <main className="min-h-screen surface-subtle">
      <Header />
      
      <ControlPanel 
        onFetchNews={handleFetchNews}
        onClearCache={handleClearCache}
        loading={loading}
        hasData={hasNewsData}
      />
      
      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl text-secondary mb-4">No news available</p>
            <p className="text-subtle">Click &quot;Get Latest News&quot; to start</p>
          </div>
        </div>
      )}
    </main>
  );
}
