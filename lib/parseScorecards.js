// lib/parseScorecards.js
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import pdfParse from 'pdf-parse'

/**
 * parseFile(filepath, originalName)
 * returns array of standardized objects:
 * [{ evaluator: 'evaluator name', items: [{callId, category, score}], rawText }]
 */
export async function parseFile(filepath, originalName) {
  const ext = (originalName || filepath || '').split('.').pop()?.toLowerCase()
  const buf = fs.readFileSync(filepath)
  if (ext === 'pdf') {
    const parsed = await pdfParse(buf)
    return [{ evaluator: originalName, rawText: parsed.text }]
  }
  if (ext === 'txt' || ext === 'log') {
    return [{ evaluator: originalName, rawText: buf.toString('utf8') }]
  }
  if (ext === 'json') {
    try {
      const obj = JSON.parse(buf.toString('utf8'))
      return Array.isArray(obj) ? obj : [obj]
    } catch (e) { return [{ evaluator: originalName, rawText: buf.toString('utf8') }] }
  }
  if (['csv', 'xls', 'xlsx'].includes(ext)) {
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null })
    const evaluator = originalName
    return [{
      evaluator,
      items: rows.map(r => ({
        callId: r.callId || r.call_id || r.CallID || r['Call ID'] || (r['call id'] ? String(r['call id']) : 'unknown'),
        category: r.category || r.Category || 'overall',
        score: typeof r.score === 'number' ? r.score : (parseFloat(r.score) || null)
      }))
    }]
  }
  // fallback
  return [{ evaluator: originalName, rawText: buf.toString('utf8') }]
}
