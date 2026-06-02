import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const configuredSiteUrl = import.meta.env.VITE_SITE_URL

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)
export const siteUrl = configuredSiteUrl || window.location.origin

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  return supabase
}
