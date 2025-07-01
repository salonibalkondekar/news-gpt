'use client';

import { RefreshCw, Newspaper, Clock } from 'lucide-react';
import { LoadingState } from '@/types/news';

interface ControlPanelProps {
  onFetchNews: () => void;
  onClearCache: () => void;
  loading: LoadingState;
  hasData: boolean;
  isRestoredFromCache?: boolean;
  cacheInfo?: { hasCache: boolean; ageMinutes: number | null };
}

export default function ControlPanel({ 
  onFetchNews, 
  loading, 
  hasData, 
  isRestoredFromCache, 
  cacheInfo 
}: ControlPanelProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center">
          <button
            onClick={onFetchNews}
            disabled={loading.isLoading}
            className="
              bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
              text-white font-medium px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl
              disabled:cursor-not-allowed transition-all duration-200
              flex items-center gap-2 mx-auto shadow-lg shadow-blue-600/25
              hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105
              text-sm sm:text-base min-h-[48px]
            "
          >
            {loading.isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Newspaper className="w-5 h-5" />
            )}
            <span>{loading.isLoading ? 'Fetching latest news...' : 'Get Latest News'}</span>
          </button>
          
          {loading.isLoading && (
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              {loading.stage || 'Searching for breaking news...'}
            </p>
          )}

          {/* Cache indicator */}
          {hasData && !loading.isLoading && isRestoredFromCache && cacheInfo?.ageMinutes !== null && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm border border-blue-100">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                Restored from cache • Last updated {cacheInfo!.ageMinutes === 0 ? 'just now' : `${cacheInfo!.ageMinutes}m ago`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
