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
    <article className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Main Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Headline - Responsive height */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight line-clamp-3 group-hover:text-blue-700 transition-colors">
            {article.title}
          </h3>
        </div>
        
        {/* Summary - Flexible height */}
        <div className="mb-4 flex-1">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-4 sm:line-clamp-5">
            {article.summary}
          </p>
        </div>

        {/* Sources & Meta - Fixed at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          {/* Primary Source */}
          {article.sources && article.sources.length > 0 && (
            <div className="flex items-center gap-2">
              {article.sourceUrls?.[0] && article.sourceUrls[0].startsWith('http') ? (
                <a
                  href={article.sourceUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200 group/link"
                >
                  <span className="truncate max-w-24 sm:max-w-32">{article.sources[0]}</span>
                  <ExternalLink className="w-3 h-3 opacity-70 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ) : (
                <span className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                  {article.sources[0]}
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <time>{formatTimeAgo(article.timestamp)}</time>
          </div>
        </div>

        {/* Additional Sources (if multiple) */}
        {article.sources && article.sources.length > 1 && (
          <div className="pt-3">
            <details className="group">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                <span>+{article.sources.length - 1} more {article.sources.length === 2 ? 'source' : 'sources'}</span>
                <svg className="w-3 h-3 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 space-y-2 pl-3 border-l-2 border-blue-100">
                {article.sources.slice(1).map((source, index) => {
                  const url = article.sourceUrls?.[index + 1];
                  const isValidUrl = url && url.startsWith('http');
                  
                  return (
                    <div key={index}>
                      {isValidUrl ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200"
                        >
                          <span className="truncate">{source}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md">{source}</span>
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
