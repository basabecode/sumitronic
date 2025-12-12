import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Crear instancia de Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Rate limiter para API Routes generales (10 requests por 10 segundos)
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
})

// Rate limiter más estricto para autenticación (5 intentos por minuto)
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth',
})

// Rate limiter para operaciones de carrito (20 requests por 10 segundos)
export const cartRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/cart',
})
