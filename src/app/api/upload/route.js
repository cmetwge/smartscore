import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const config = { api: { bodyParser: false } }

async function parseForm(req) {
  const form = formidable({ multiples: true, keepExtensions: true, maxFileSize: 300 * 1024 * 1024 })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => err ? reject(err) : resolve({ fields, files }))
  })
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req)
    const email = (fields.email || '').toString().toLowerCase()
    if (!email) return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 })
    const batchId = `batch_${Date.now().toString(36)}`
    // create a batch record (use supabase table 'calibration_batches' if available)
    await supabase.from('calibration_batches').insert([{ id: batchId, status: 'uploaded', total_items: 0 }])
    // iterate files, upload to storage
    const fileObjs = []
    for (const key in files) {
      const f = files[key]
      const arr = Array.isArray(f) ? f : [f]
      for (const item of arr) {
        const buffer = fs.readFileSync(item.filepath)
        const dest = `${email}/${batchId}/${Date.now()}_${item.originalFilename}`
        const { error: upErr } = await supabase.storage.from('uploads').upload(dest, buffer, { upsert: true })
        if (upErr) throw upErr
        fileObjs.push(dest)
      }
    }
    // store metadata in a batch_items table if desired
    await supabase.from('calibration_items').insert(fileObjs.map(p=>({ batch_id: batchId, file_path: p })))
    return new Response(JSON.stringify({ ok: true, batchId, files: fileObjs }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
