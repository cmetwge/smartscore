// src/app/api/status/[jobId]/route.js   (or wherever it lives)

import { Queue } from 'bullmq'

const connection = { 
  host: process.env.REDIS_HOST, 
  port: Number(process.env.REDIS_PORT) || 6379, 
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS ? {} : undefined
}
const queue = new Queue('intelqa-processing', { connection })

export async function GET(req, { params }) {
  const { jobId } = params
  const job = await queue.getJob(jobId)

  if (!job) {
    return new Response(JSON.stringify({ status: 'unknown' }), { status: 404 })
  }

  const state = await job.getState()
  const res = { status: state }

  if (state === 'completed') {
    const returnValue = job.returnvalue || {}

    // Full calibration tier → has PDF
    if (returnValue.reportUrl) {
      res.reportUrl = returnValue.reportUrl
    }
    // SmartScore / demo-lite tier → has instant result
    else if (returnValue.liteResult) {
      res.liteResult = returnValue.liteResult
    }
  }

  if (state === 'failed') {
    res.error = job.failedReason || 'Unknown error'
  }

  // Optional: include progress
  if (state === 'active' || state === 'waiting') {
    res.progress = job.progress || 0
  }

  return new Response(JSON.stringify(res), { status: 200 })
}