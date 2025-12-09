import { processQueue } from '@/lib/queue'
export const runtime = 'nodejs'
export async function POST(req) {
  try {
    const { batchId } = await req.json()
    if (!batchId) return new Response(JSON.stringify({ error: 'batchId required' }), { status: 400 })
    const job = await processQueue.add('process-batch', { batchId }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } })
    return new Response(JSON.stringify({ ok: true, jobId: job.id }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
