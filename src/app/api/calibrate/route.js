// src/app/api/calibrate/route.js
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '@/lib/supabase'
import { processQueue } from '@/lib/queue'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const config = { api: { bodyParser: false } }

function parseForm(req) {
  const form = formidable({ multiples: true, keepExtensions: true, maxFileSize: 300 * 1024 * 1024 })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })))
  })
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req)
    const email = (fields.email || '').toString().toLowerCase()
    if (!email) return new Response(JSON.stringify({ error: 'email required' }), { status: 400 })

    const batchId = `batch_${Date.now().toString(36)}`

    await supabase.from('calibration_batches').insert([{
      id: batchId,
      status: 'uploaded',
      email,
      total_items: 0
    }])

    const filePaths = []

    for (const key in files) {
      const f = files[key]
      const arr = Array.isArray(f) ? f : [f]
      for (const item of arr) {
        const buffer = fs.readFileSync(item.filepath)
        const dest = `${email}/${batchId}/${Date.now()}_${item.originalFilename}`
        const { error } = await supabase.storage.from('uploads').upload(dest, buffer, { upsert: true })
        if (error) throw error
        filePaths.push(dest)
      }
    }

    if (filePaths.length > 0) {
      await supabase.from('calibration_items').insert(
        filePaths.map(p => ({ batch_id: batchId, file_path: p }))
      )
      await supabase.from('calibration_batches')
        .update({ total_items: filePaths.length })
        .eq('id', batchId)
    }

    // THIS LINE NOW SENDS THE TIER TO THE WORKER
    const tierFromForm = fields.tier?.toString() || 'calibration'
    const job = await processQueue.add('process-batch', {
      batchId,
      email,
      tier: tierFromForm
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 }
    })

    return new Response(JSON.stringify({
      ok: true,
      batchId,
      jobId: job.id,
      tier: tierFromForm
    }), { status: 200 })

  } catch (err) {
    console.error('calibrate error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}