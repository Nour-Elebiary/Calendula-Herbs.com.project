import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazy-initialized Redis client
let redis: Redis | null = null

function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error('Upstash Redis configuration missing: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
    }

    redis = new Redis({ url, token })
  }
  return redis
}

/**
 * Pre-built rate limiters for different endpoints.
 * Uses sliding window algorithm for smooth rate limiting.
 * Note: Rate limiters are lazily initialized when first used.
 */

/** Admin login — 5 attempts per 15 minutes per IP */
export const loginRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'rl:login',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** OTP send — 3 sends per 5 minutes per identifier */
export const otpSendRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(3, '5 m'),
      prefix: 'rl:otp:send',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** OTP verify — 5 attempts per 10 minutes per identifier */
export const otpVerifyRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'rl:otp:verify',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Public contact form — 3 submissions per hour per IP */
export const contactRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      prefix: 'rl:contact',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Cart inquiry — 5 submissions per hour per IP */
export const cartRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'rl:cart',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Public API search — 60 requests per minute per IP */
export const searchRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      prefix: 'rl:search',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Sample request — 5 submissions per hour per IP */
export const sampleRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'rl:sample',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Product request — 5 submissions per hour per IP */
export const productRequestRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'rl:product-request',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

/** Generic API rate limit — 100 requests per minute per IP */
export const apiRateLimit = {
  limit: async (key: string) => {
    const r = getRedisClient()
    const limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'rl:api',
      analytics: true,
    })
    return limiter.limit(key)
  }
}

export { getRedisClient as redis }
