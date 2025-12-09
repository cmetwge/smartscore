// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase keys missing in env. Some features will fail.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
