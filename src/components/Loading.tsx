'use client';

import { LoadingState } from '@/types/news';

interface LoadingProps {
  loading: LoadingState;
}

// Skeleton Card Component
function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          <div className="h-5 bg-gray-200 rounded w-3/5"></div>
        </div>
        
        {/* Summary skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6"></div>
        </div>

        {/* Footer skeleton */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loading({ loading }: LoadingProps) {
  if (!loading.isLoading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Loading header */}
      <div className="text-center mb-8">
        <div className="w-6 h-6 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-secondary text-sm">
          {loading.stage || 'Loading latest news...'}
        </p>
      </div>

      {/* Skeleton grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
