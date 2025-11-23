// Simple rate limiter utility to prevent API flooding
class RateLimiter {
  constructor(maxRequests = 5, timeWindow = 10000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  // Check if request is allowed
  isAllowed() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    // Check if we're under the limit
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  // Get delay until next allowed request
  getDelayUntilNext() {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.timeWindow - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilReset);
  }

  // Wait for next available slot
  async waitForNext() {
    const delay = this.getDelayUntilNext();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Global rate limiter instance
const globalRateLimiter = new RateLimiter(3, 5000); // 3 requests per 5 seconds

// Rate limited fetch wrapper
export const rateLimitedFetch = async (fetchFunction, ...args) => {
  if (!globalRateLimiter.isAllowed()) {
    console.log('Rate limit reached, waiting...');
    await globalRateLimiter.waitForNext();
  }
  
  return fetchFunction(...args);
};

export default RateLimiter;