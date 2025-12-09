// src/lib/queue.js
import { Queue } from 'bullmq'

// Safe defaults + skip during build/prerender
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL;

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  ...(process.env.REDIS_TLS === 'true' && { tls: {} })
}

// Only create real queue in actual runtime (not during next build)
export const processQueue = isBuildTime
  ? null // Vercel build skips this
  : new Queue('intelqa-processing', { connection })