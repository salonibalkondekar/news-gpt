'use client';

import { RefreshCw, Newspaper } from 'lucide-react';
import { LoadingState } from '@/types/news';

interface ControlPanelProps {
  onFetchNews: () => void;
  onClearCache: () => void;
  loading: LoadingState;
  hasData: boolean;
}

export default function ControlPanel({ onFetchNews, loading }: ControlPanelProps) {
  return (
    <div className="mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <button
            onClick={onFetchNews}
            disabled={loading.isLoading}
            className="
              button-primary px-6 py-3 text-white font-medium rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2 mx-auto focus-ring
            "
          >
            {loading.isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Newspaper className="w-5 h-5" />
            )}
            {loading.isLoading ? 'Fetching latest news...' : 'Get Latest News'}
          </button>
          
          {loading.isLoading && (
            <p className="mt-2 text-sm text-secondary">
              {loading.stage || 'Searching for breaking news...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
