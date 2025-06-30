interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 60, windowHours: number = 1) {
    this.maxRequests = maxRequests;
    this.windowMs = windowHours * 60 * 60 * 1000; // Convert hours to milliseconds

    // Clean up expired entries every 10 minutes
    if (typeof window === 'undefined') { // Only run on server
      setInterval(() => {
        this.cleanup();
      }, 10 * 60 * 1000);
    }
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now >= entry.resetTime) {
      // First request or window expired
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  getStats(): { totalIdentifiers: number; totalRequests: number } {
    let totalRequests = 0;
    for (const entry of this.requests.values()) {
      totalRequests += entry.count;
    }
    
    return {
      totalIdentifiers: this.requests.size,
      totalRequests
    };
  }
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_REQUESTS_PER_HOUR || '60'),
  1 // 1 hour window
);

export { RateLimiter, globalRateLimiter };
export default globalRateLimiter;