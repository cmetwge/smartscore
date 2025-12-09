// src/app/api/status/[jobId].js — THE ONLY FILE THAT WORKS ON VERCEL

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// This route does NOTHING during build
// It only runs after deploy when someone actually calls it
export async function GET(request, { params }) {
  const { jobId } = params

  // Build-time guard — never runs BullMQ
  if (process.env.VERCEL || process.env.NEXT_PHASE) {
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
  }

  // Only in real runtime — safe to import BullMQ
  try {
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
    if (!job) return new Response(JSON.stringify({ status: 'not_found' }), { status: 404 })

    const state = await job.getState()
    const res = { status: state }

    if (state === 'completed') {
      const v = job.returnvalue || {}
      if (v.reportUrl) res.reportUrl = v.reportUrl
      if (v.smartScoreResult) res.smartScoreResult = v.smartScoreResult
      if (v.calibrationResult) res.calibrationResult = v.calibrationResult
    }
    if (state === 'failed') res.error = job.failedReason

    return new Response(JSON.stringify(res), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Job status unavailable' }), { status: 503 })
  }
}