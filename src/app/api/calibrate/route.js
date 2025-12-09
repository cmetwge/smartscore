// src/app/api/calibrate/route.js — FINAL PRODUCTION VERSION
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '@/lib/supabase'
import { getProcessQueue } from '@/lib/queue'   // ← lazy queue

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// No more `export const config` — deprecated and removed

async function parseForm(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 1024, // 300 MB
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req)

    const email = (fields.email?.[0] || fields.email || '').toString().toLowerCase()
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 })
    }

    const batchId = `batch_${Date.now().toString(36)}`

    // Create batch record
    await supabase
      .from('calibration_batches')
      .insert([{ id: batchId, status: 'uploaded', email, total_items: 0 }])

    const uploadedPaths = []

    // Handle files can be single object or array
    const fileList = Object.values(files).flat()

    for (const file of fileList) {
      if (!file?.filepath) continue

      const buffer = fs.readFileSync(file.filepath)
      const fileName = file.originalFilename || `upload_${Date.now()}`
      const destPath = `${email}/${batchId}/${Date.now()}_${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(destPath, buffer, { upsert: true })

      if (uploadError) throw uploadError

      uploadedPaths.push(destPath)

      // Clean up temp file
      try { fs.unlinkSync(file.filepath) } catch (_) {}
    }

    // Save file references
    if (uploadedPaths.length > 0) {
      await supabase
        .from('calibration_items')
        .insert(uploadedPaths.map(p => ({ batch_id: batchId, file_path: p })))

      await supabase
        .from('calibration_batches')
        .update({ total_items: uploadedPaths.length })
        .eq('id', batchId)
    }

    // SEND TIER TO WORKER — this is what makes $9 / $29 / Pro work
    const tier = (fields.tier?.[0] || fields.tier || 'calibration').toString()

    // Only enqueue if we have a real queue (safe during build)
    const queue = getProcessQueue()
    let jobId = null
    if (queue) {
      const job = await queue.add('process-batch', {
        batchId,
        email,
        tier,
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      })
      jobId = job.id
    }

    return new Response(
      JSON.stringify({
        ok: true,
        batchId,
        jobId,
        tier,
        files: uploadedPaths,
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Calibrate route error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Upload failed' }),
      { status: 500 }
    )
  }
}