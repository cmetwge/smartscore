// lib/openai.js
import OpenAI from 'openai'

const key = process.env.OPENAI_API_KEY
if (!key) console.warn('OPENAI_API_KEY missing in .env')

export const client = new OpenAI({ apiKey: key })

/**
 * callChat: sends a chat-style prompt and returns assistant content string
 * messages: array of {role, content}
 */
export async function callChat(messages = [], opts = {}) {
  const params = {
    model: opts.model || (process.env.OPENAI_MODEL || 'gpt-4o-mini'),
    messages,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.max_tokens ?? 1200
  }
  const resp = await client.chat.completions.create(params)
  const content = resp.choices?.[0]?.message?.content ?? ''
  return content
}
