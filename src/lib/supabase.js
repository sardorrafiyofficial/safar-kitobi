import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
// Kalitlar bo'lmasa null — sayt namuna rejimida ishlaydi
export const supabase = (url && key) ? createClient(url, key) : null
export const namunaRejimi = !supabase
