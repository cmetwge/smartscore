// src/app/api/worker-status/[jobId]/route.js — BullMQ lives safely here

import { Queue } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
}

let queue

export async function GET(request, { params }) {
  const { jobId } = params

  if (!queue) {
    queue = new Queue('intelqa-processing', { connection })
  }

  try {
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export const dynamic = 'force-dynamic'