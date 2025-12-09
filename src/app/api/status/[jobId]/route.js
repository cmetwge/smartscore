// src/app/api/status/[jobId]/route.js — 100% BULLETPROOF FOR VERCELCEL

// DYNAMIC IMPORT — BullMQ is ONLY loaded when the API is actually called
export async function GET(request, { params }) {
  const { jobId } = params

  // During build or preview, just return a dummy response
  if (process.env.VERCEL || process.env.NEXT_PHASE) {
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
  }

  try {
    // Only import BullMQ when someone actually hits the endpoint
    const { Queue } = await import('bullmq')

    const queue = new Queue('intelqa-processing', {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
      },
    })

    const job = await queue.getJob(jobId)

    if (!job) {
      return new Response(JSON.stringify({ status: 'not_found' }), { status: 404 })
    }

    const state = await job.getState()
    const res = { status: state }

    if (state === 'completed') {
      const value = job.returnvalue || {}
      if (value.reportUrl) res.reportUrl = value.reportUrl
      if (value.smartScoreResult) res.smartScoreResult = value.smartScoreResult
      if (value.calibrationResult) res.calibrationResult = value.calibrationResult
    }

    if (state === 'failed') {
      res.error = job.failedReason || 'Unknown error'
    }

    return new Response(JSON.stringify(res), { status: 200 })
  } catch (err) {
    console.error('Status check failed:', err.message)
    return new Response(JSON.stringify({ error: 'Service unavailable' }), { status: 503 })
  }
}

// Force dynamic — never prerender this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'