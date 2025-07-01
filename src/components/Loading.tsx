'use client';

import { LoadingState } from '@/types/news';

interface LoadingProps {
  loading: LoadingState;
}

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 animate-pulse h-full flex flex-col">
      <div className="space-y-3 sm:space-y-4 flex-1">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/5"></div>
        </div>
        
        {/* Summary skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-3 sm:h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded w-4/6"></div>
          <div className="h-3 sm:h-4 bg-gray-100 rounded w-3/6"></div>
        </div>

        {/* Footer skeleton */}
        <div className="pt-3 border-t border-gray-50 mt-auto">
          <div className="flex items-center justify-between">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
            <div className="h-3 bg-gray-100 rounded w-12 sm:w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading({ loading }: LoadingProps) {
  if (!loading.isLoading) return null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Loading header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm sm:text-base">
          {loading.stage || 'Loading latest news...'}
        </p>
      </div>

      {/* Responsive skeleton grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
