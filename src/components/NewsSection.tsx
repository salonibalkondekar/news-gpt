'use client';

import { NewsResponse } from '@/types/news';
import { NEWS_CATEGORIES } from '@/lib/constants';
import NewsCard from './NewsCard';

interface NewsSectionProps {
  newsResponse: NewsResponse;
}

export default function NewsSection({ newsResponse }: NewsSectionProps) {
  const categoryConfig = NEWS_CATEGORIES[newsResponse.category];
  
  if (!categoryConfig || !newsResponse.articles?.length) {
    return null;
  }

  return (
    <section className="mb-8 sm:mb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <span className="text-xl sm:text-2xl">{categoryConfig.icon}</span>
            <h2 className="text-lg sm:text-xl font-semibold text-primary">
              {categoryConfig.title}
            </h2>
            <span className="text-xs sm:text-sm text-subtle bg-gray-100 px-2 py-0.5 rounded-full">
              {newsResponse.articles.length}
            </span>
          </div>
          
          <p className="text-secondary text-sm sm:text-base leading-relaxed">
            {categoryConfig.subtitle}
          </p>
        </header>

        {/* Responsive Articles Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {newsResponse.articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
