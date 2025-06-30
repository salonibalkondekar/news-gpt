'use client';

import { ExternalLink, Clock } from 'lucide-react';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <article className="card p-6 fade-in hover:scale-[1.02]">
      {/* Main Content */}
      <div className="space-y-4">
        {/* Headline */}
        <h3 className="text-lg font-semibold text-primary leading-tight line-clamp-3">
          {article.title}
        </h3>
        
        {/* Summary */}
        <p className="text-secondary leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Sources & Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Primary Source */}
          {article.sources && article.sources.length > 0 && (
            <div className="flex items-center gap-2">
              {article.sourceUrls?.[0] && article.sourceUrls[0].startsWith('http') ? (
                <a
                  href={article.sourceUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-all duration-200 group shadow-sm"
                >
                  <span className="truncate max-w-32">{article.sources[0]}</span>
                  <ExternalLink className="w-3 h-3 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ) : (
                <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                  {article.sources[0]}
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-subtle">
            <Clock className="w-3 h-3" />
            <time>{formatTimeAgo(article.timestamp)}</time>
          </div>
        </div>

        {/* Additional Sources (if multiple) */}
        {article.sources && article.sources.length > 1 && (
          <div className="pt-2">
            <details className="group">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:border-gray-300">
                <span>+{article.sources.length - 1} more {article.sources.length === 2 ? 'source' : 'sources'}</span>
                <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 space-y-2 pl-2 border-l-2 border-gray-100">
                {article.sources.slice(1).map((source, index) => {
                  const url = article.sourceUrls?.[index + 1];
                  const isValidUrl = url && url.startsWith('http');
                  
                  return (
                    <div key={index} className="text-sm">
                      {isValidUrl ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2 py-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200 text-xs"
                        >
                          <span className="truncate">{source}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="px-2 py-1 text-gray-600 bg-gray-50 rounded-md text-xs block">{source}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        )}
      </div>
    </article>
  );
}
