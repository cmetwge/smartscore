// src/app/api/upload/route.js
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// DELETE the old `export const config = { api: { bodyParser: false } }` line completely

// Helper to parse multipart/form-data manually (replaces bodyParser: false)
async function parseForm(req) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 1024, // 300MB
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

    const filePaths = []

    // Handle files (formidable gives array or single object)
    for (const key in files) {
      const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]]
      for (const file of fileArray) {
        if (!file.filepath) continue // skip empty

        const buffer = fs.readFileSync(file.filepath)
        const fileName = file.originalFilename || `upload_${Date.now()}`
        const destPath = `${email}/${batchId}/${Date.now()}_${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(destPath, buffer, { upsert: true })

        if (uploadError) throw uploadError

        filePaths.push(destPath)
      }
    }

    // Save file references
    if (filePaths.length > 0) {
      await supabase
        .from('calibration_items')
        .insert(filePaths.map(path => ({ batch_id: batchId, file_path: path })))

      await supabase
        .from('calibration_batches')
        .update({ total_items: filePaths.length })
        .eq('id', batchId)
    }

    return new Response(
      JSON.stringify({
        ok: true,
        batchId,
        files: filePaths,
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Upload route error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Upload failed' }),
      { status: 500 }
    )
  }
}