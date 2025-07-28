/**
 * Simple client-side rate limiter for authentication attempts
 * Note: This is a basic implementation. For production, implement server-side rate limiting.
 */

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    blockDurationMs: number = 30 * 60 * 1000 // 30 minutes
  ) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  /**
   * Check if an action is allowed for a given key
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry) {
      return true;
    }

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return false;
    }

    // Reset if window has passed
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.delete(key);
      return true;
    }

    return entry.attempts < this.maxAttempts;
  }

  /**
   * Record an attempt for a given key
   */
  recordAttempt(key: string): void {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry) {
      this.attempts.set(key, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    // Reset if window has passed
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.set(key, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    const newAttempts = entry.attempts + 1;
    const blockedUntil = newAttempts >= this.maxAttempts 
      ? now + this.blockDurationMs 
      : undefined;

    this.attempts.set(key, {
      attempts: newAttempts,
      lastAttempt: now,
      blockedUntil,
    });
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry) {
      return this.maxAttempts;
    }

    const now = Date.now();
    
    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return 0;
    }

    // Reset if window has passed
    if (now - entry.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  /**
   * Get time until unblocked for a key
   */
  getTimeUntilUnblocked(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry?.blockedUntil) {
      return 0;
    }

    const now = Date.now();
    return Math.max(0, entry.blockedUntil - now);
  }

  /**
   * Reset attempts for a key (useful after successful authentication)
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts (useful for testing)
   */
  clear(): void {
    this.attempts.clear();
  }
}

// Create singleton instances for different rate limiting scenarios
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000); // 5 attempts per 15 minutes
export const passwordResetRateLimiter = new RateLimiter(3, 60 * 60 * 1000, 60 * 60 * 1000); // 3 attempts per hour
export const emailVerificationRateLimiter = new RateLimiter(5, 60 * 60 * 1000, 60 * 60 * 1000); // 5 attempts per hour

export default RateLimiter; 