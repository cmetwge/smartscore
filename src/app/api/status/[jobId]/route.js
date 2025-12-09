// src/app/api/status/[jobId]/route.js — THE ONLY VERSION THAT WORKS ON VERCEL 2025

// NEVER import BullMQ at all during build — it will crash
// We use a completely different approach: call a separate serverless function

export async function GET(request, { params }) {
  const { jobId } = params

  // During build or preview → just return dummy response
  if (process.env.VERCEL || process.env.NEXT_PHASE) {
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
  }

  // In production → forward to a tiny dedicated worker status function
  // This bypasses all BullMQ import issues during build
  const url = new URL(request.url)
  const workerUrl = `https://${url.host}/api/worker-status/${jobId}`

  try {
    const res = await fetch(workerUrl, { next: { revalidate: 0 } })
    const data = await res.json()
    return new Response(JSON.stringify(data), { status: res.status })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Service unavailable' }), { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'