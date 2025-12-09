// lib/ai/runCalibration.js — FINAL ENTERPRISE VERSION
import { CALIBRATION_PROMPT } from './prompt'
import { callChat } from '../openai.js'

function buildPromptPayload(scorecards = [], transcripts = []) {
  const lines = []

  lines.push('=== SCORECARDS ===')
  for (const sc of scorecards) {
    lines.push(`Evaluator: ${sc.evaluator || 'Unknown'}`)
    if (sc.items && sc.items.length) {
      for (const item of sc.items) {
        const callId = item.callId || item.call_id || 'unknown'
        const category = item.category || 'Overall'
        const score = item.score !== null && item.score !== undefined ? item.score : 'N/A'
        lines.push(`CALL:${callId} | ${category} | ${score}`)
      }
    } else if (sc.rawText) {
      lines.push(`RAW NOTES: ${sc.rawText.slice(0, 800)}`)
    }
    lines.push('---')
  }

  if (transcripts && transcripts.length > 0) {
    lines.push('\n=== TRANSCRIPTS (for emotion & compliance analysis) ===')
    transcripts.forEach((t, i) => {
      const snippet = t.trim().slice(0, 3000) // increased for real tone/compliance detection
      lines.push(`TRANSCRIPT_${i + 1}: ${snippet}`)
      if (t.length > 3000) lines.push('... (truncated)')
    })
  }

  return CALIBRATION_PROMPT + '\n\n' + lines.join('\n')
}

export async function analyzeScorecards(scorecards = [], transcripts = []) {
  const prompt = buildPromptPayload(scorecards, transcripts)

  try {
    const reply = await callChat(
      [
        {
          role: 'system',
          content: 'You are intelQA™ Calibration Intelligence™. Always return valid JSON only. No explanations outside JSON.'
        },
        { role: 'user', content: prompt }
      ],
      {
        model: 'gpt-4o',           // use gpt-4o for best accuracy (or keep gpt-4o-mini + lower cost)
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' }  // This forces perfect JSON every time
      }
    )

    // OpenAI now guarantees valid JSON → safe to parse
    const parsed = JSON.parse(reply)
    return parsed

  } catch (err) {
    console.error('intelQA™ AI Analysis Failed:', err.message)
    throw new Error('Failed to generate Harmony Intelligence Report™. Please try again.')
  }
}