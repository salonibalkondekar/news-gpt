interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;

  constructor(defaultTTLHours: number = 1) {
    this.defaultTTL = defaultTTLHours * 60 * 60 * 1000; // Convert hours to milliseconds
  }

  set<T>(key: string, data: T, ttlHours?: number): void {
    const ttl = ttlHours ? ttlHours * 60 * 60 * 1000 : this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  // Clear cache when settings change
  clearOldFormatEntries(): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      // Delete entries with old format (US-New York or :medium:5)
      if (key.includes('US-New York') || key.includes(':medium:5')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleared ${keysToDelete.length} old format entries`);
    }
  }

  // Generate cache key for news requests
  static generateNewsKey(query: string, category: string, searchOptions: Record<string, unknown>): string {
    const location = searchOptions.location as { country?: string; city?: string } | undefined;
    const locationStr = location ? 
      `${location.country || 'unknown'}-${location.city || 'unknown'}` : 'global';
    const contextStr = searchOptions.searchContextSize || 'medium';
    const maxArticlesStr = searchOptions.maxArticles || '3';
    
    return `news:${query}:${category}:${locationStr}:${contextStr}:${maxArticlesStr}`;
  }
}

// Global cache instance
const globalCache = new MemoryCache(
  parseInt(process.env.CACHE_DURATION_HOURS || '1')
);

// Clear old format cache entries on startup
globalCache.clearOldFormatEntries();

// Clean up expired entries every 15 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    const cleaned = globalCache.cleanup();
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
    }
  }, 15 * 60 * 1000);
}

export { MemoryCache, globalCache };
export default globalCache;