type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
let lastCleanup = Date.now();

/**
 * Simple in-memory sliding window rate limiter.
 * Per-instance (no shared state across Vercel instances), which is acceptable
 * for a low-traffic shop — it still significantly raises the bar for abuse.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Periodic cleanup every 5 minutes to prevent unbounded Map growth
  if (now - lastCleanup > 300_000) {
    for (const [k, v] of store) {
      if (v.resetAt < now) store.delete(k);
    }
    lastCleanup = now;
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
