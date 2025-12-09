// src/lib/queue.js
import { Queue } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  ...(process.env.REDIS_TLS === 'true' && { tls: {} })
}

export const processQueue = new Queue('intelqa-processing', { connection })