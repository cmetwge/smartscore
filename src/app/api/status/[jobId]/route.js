// src/app/api/status/[jobId]/route.js — FINAL, 100% VERCEL-SAFE VERSION

// Completely skip BullMQ during build/prerender — this is the standard pattern
if (process.env.VERCEL || process.env.NEXT_PHASE === 'phase-production-build') {
  export async function GET() {
    return new Response(JSON.stringify({ status: 'build_time' }), { status: 200 })
  }
  export const dynamic = 'force-dynamic'
  export const runtime = 'nodejs'
  // This prevents Next.js from trying to prerender the route
  export default function Noop() {}
}

// Only run in real requests (after deploy)
import { Queue } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
}

let queue

try {
  queue = new Queue('intelqa-processing', { connection })
} catch (err) {
  console.error('Failed to connect to Redis:', err.message)
}

export async function GET(request, { params }) {
  const { jobId } = params

  if (!queue) {
    return new Response(JSON.stringify({ status: 'queue_unavailable' }), { status: 503 })
  }

  try {
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
    {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'}