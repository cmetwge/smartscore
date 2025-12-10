// pages/api/status/[jobId].js — THIS WORKS 100% ON VERCEL
import { Queue } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
}

export default async function handler(req, res) {
  const { jobId } = req.query

  try {
    const queue = new Queue('intelqa-processing', { connection })
    const job = await queue.getJob(jobId)

    if (!job) {
      return res.status(404).json({ status: 'not_found' })
    }

    const state = await job.getState()
    const result = { status: state }

    if (state === 'completed') {
      const v = job.returnvalue || {}
      if (v.reportUrl) result.reportUrl = v.reportUrl
      if (v.smartScoreResult) result.smartScoreResult = v.smartScoreResult
      if (v.calibrationResult) result.calibrationResult = v.calibrationResult
    }

    if (state === 'failed') {
      result.error = job.failedReason || 'Unknown error'
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Status error:', error)
    res.status(503).json({ error: 'Redis unavailable' })
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}