// src/app/api/calibrate/route.js
import formidable from 'formidable'
import fs from 'fs'
import { supabase } from '@/lib/supabase'
import { processQueue } from '@/lib/queue'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// ← DELETE the old `export const config = { api: { bodyParser: false } }` line completely

function parseForm(req) {
  const form = formidable({ multiples: true, keepExtensions: true, maxFileSize: 300 * 1024 * 1024 })
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })))
  })
}

export async function POST(req) {
  // Your existing code stays 100% the same — just works without config
  try {
    const { fields, files } = await parseForm(req)
    // ... rest of your code unchanged
    const tier = fields.tier?.toString() || 'calibration'
    if (processQueue) {
      await processQueue.add('process-batch', { batchId, email, tier })
    }
    // ...
  } catch (err) {
    // ...
  }
}