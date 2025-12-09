// src/lib/queue.js — FINAL, 100% VERCEL-PROOF VERSION
let queueInstance = null

export const getProcessQueue = () => {
  // NEVER load BullMQ during build, prerender, or static generation
  if (
    process.env.VERCEL ||
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    typeof window !== 'undefined'
  ) {
    return null
  }

  // Lazy load only when actually needed (runtime only)
  if (!queueInstance) {
    const { Queue } = require('bullmq') // ← dynamic require = no static analysis

    queueInstance = new Queue('intelqa-processing', {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      },
    })
  }

  return queueInstance
}

// For backward compatibility
export const processQueue = getProcessQueue()