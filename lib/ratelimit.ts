import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type LimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

type RateLimiter = {
  limit(identifier: string): Promise<LimitResult>
}

const hasUpstashConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

function createNoopRateLimit(limitValue: number): RateLimiter {
  return {
    async limit() {
      return {
        success: true,
        limit: limitValue,
        remaining: limitValue,
        reset: Date.now() + 10_000,
      }
    },
  }
}

function createRateLimit(prefix: string, limitValue: number, window: `${number} s`): RateLimiter {
  if (!hasUpstashConfig) {
    return createNoopRateLimit(limitValue)
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limitValue, window),
    analytics: true,
    prefix,
  })
}

// Rate limiter para API Routes generales (10 requests por 10 segundos)
export const ratelimit = createRateLimit('@upstash/ratelimit', 10, '10 s')

// Rate limiter más estricto para autenticación (5 intentos por minuto)
export const authRatelimit = createRateLimit('@upstash/ratelimit/auth', 5, '60 s')

// Rate limiter para operaciones de carrito (20 requests por 10 segundos)
export const cartRatelimit = createRateLimit('@upstash/ratelimit/cart', 20, '10 s')
