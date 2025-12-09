// src/lib/queue.js — FIXED FOR UPSTASH + VERCEL BUILD
import { Redis } from '@upstash/redis'
import { Queue } from 'bullmq'

// Use Upstash REST client for compatibility
const upstashClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

// BullMQ connection using Upstash REST
const connection = {
  redis: upstashClient // ← THIS IS THE KEY LINE
}

// Skip during build
export const processQueue = 
  process.env.VERCEL ? null : new Queue('intelqa-processing', { connection })