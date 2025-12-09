// src/lib/queue.js — FINAL, BULLETPROOF
let queueInstance = null

export const getProcessQueue = () => {
  // Never create queue during build or prerender
  if (typeof window !== 'undefined' || process.env.VERCEL || process.env.NEXT_PHASE === 'phase-production-build') {
    return null
  }

  if (queueInstance) return queueInstance

  const { Queue } = require('bullmq') // lazy require

  queueInstance = new Queue('intelqa-processing', {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    },
  })

  return queueInstance
}