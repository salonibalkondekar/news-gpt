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
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{categoryConfig.icon}</span>
            <h2 className="text-xl font-semibold text-primary">
              {categoryConfig.title}
            </h2>
            <span className="text-sm text-subtle">
              ({newsResponse.articles.length})
            </span>
          </div>
          
          <p className="text-secondary text-sm">
            {categoryConfig.subtitle}
          </p>
        </header>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsResponse.articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
