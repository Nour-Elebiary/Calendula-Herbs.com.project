import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Shared Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Pre-built rate limiters for different endpoints.
 * Uses sliding window algorithm for smooth rate limiting.
 */

/** Admin login — 5 attempts per 15 minutes per IP */
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:login',
  analytics: true,
})

/** OTP send — 3 sends per 5 minutes per identifier */
export const otpSendRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  prefix: 'rl:otp:send',
  analytics: true,
})

/** OTP verify — 5 attempts per 10 minutes per identifier */
export const otpVerifyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'rl:otp:verify',
  analytics: true,
})

/** Public contact form — 3 submissions per hour per IP */
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:contact',
  analytics: true,
})

/** Cart inquiry — 5 submissions per hour per IP */
export const cartRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'rl:cart',
  analytics: true,
})

/** Public API search — 60 requests per minute per IP */
export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'rl:search',
  analytics: true,
})

/** Sample request — 5 submissions per hour per IP */
export const sampleRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'rl:sample',
  analytics: true,
})

/** Product request — 5 submissions per hour per IP */
export const productRequestRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'rl:product-request',
  analytics: true,
})

/** Generic API rate limit — 100 requests per minute per IP */
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  prefix: 'rl:api',
  analytics: true,
})

export { redis }
