import { NewsResponse } from '@/types/news';

const NEWS_DATA_KEY = 'news-gpt-data';
const ACTIVE_CATEGORY_KEY = 'news-gpt-active-category';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export interface PersistedNewsData {
  data: Record<string, NewsResponse>;
  timestamp: number;
}

export class LocalStorageManager {
  // Check if localStorage is available
  private static isAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Save news data to localStorage
  static saveNewsData(data: Record<string, NewsResponse>): void {
    if (!this.isAvailable()) return;

    try {
      const persistedData: PersistedNewsData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(NEWS_DATA_KEY, JSON.stringify(persistedData));
      console.log('[LocalStorage] News data saved');
    } catch (error) {
      console.warn('[LocalStorage] Failed to save news data:', error);
    }
  }

  // Load news data from localStorage
  static loadNewsData(): Record<string, NewsResponse> | null {
    if (!this.isAvailable()) return null;

    try {
      const stored = localStorage.getItem(NEWS_DATA_KEY);
      if (!stored) return null;

      const persistedData: PersistedNewsData = JSON.parse(stored);
      const now = Date.now();
      
      // Check if data is still valid (within cache duration)
      if (now - persistedData.timestamp > CACHE_DURATION) {
        console.log('[LocalStorage] News data expired, clearing');
        this.clearNewsData();
        return null;
      }

      console.log('[LocalStorage] News data loaded from cache');
      return persistedData.data;
    } catch (error) {
      console.warn('[LocalStorage] Failed to load news data:', error);
      this.clearNewsData(); // Clear corrupted data
      return null;
    }
  }

  // Get cache age in minutes
  static getCacheAge(): number | null {
    if (!this.isAvailable()) return null;

    try {
      const stored = localStorage.getItem(NEWS_DATA_KEY);
      if (!stored) return null;

      const persistedData: PersistedNewsData = JSON.parse(stored);
      const ageInMinutes = Math.floor((Date.now() - persistedData.timestamp) / (1000 * 60));
      return ageInMinutes;
    } catch {
      return null;
    }
  }

  // Clear news data from localStorage
  static clearNewsData(): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.removeItem(NEWS_DATA_KEY);
      console.log('[LocalStorage] News data cleared');
    } catch (error) {
      console.warn('[LocalStorage] Failed to clear news data:', error);
    }
  }

  // Save active category
  static saveActiveCategory(category: string): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.setItem(ACTIVE_CATEGORY_KEY, category);
    } catch (error) {
      console.warn('[LocalStorage] Failed to save active category:', error);
    }
  }

  // Load active category
  static loadActiveCategory(): string | null {
    if (!this.isAvailable()) return null;

    try {
      return localStorage.getItem(ACTIVE_CATEGORY_KEY);
    } catch (error) {
      console.warn('[LocalStorage] Failed to load active category:', error);
      return null;
    }
  }

  // Check if cached data exists and is valid
  static hasCachedData(): boolean {
    return this.loadNewsData() !== null;
  }

  // Get cache info for display
  static getCacheInfo(): { hasCache: boolean; ageMinutes: number | null } {
    return {
      hasCache: this.hasCachedData(),
      ageMinutes: this.getCacheAge()
    };
  }
}