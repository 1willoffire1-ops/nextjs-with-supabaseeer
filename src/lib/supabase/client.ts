import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client with VATANA optimizations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Real-time subscription helper for VATANA
export const subscribeToChanges = (
  table: string,
  callback: (payload: any) => void,
  filter = '',
  options: { event?: string; schema?: string } = {}
) => {
  const channel = supabase
    .channel(`${table}_changes_${Date.now()}`)
    .on('postgres_changes', {
      event: options.event || '*',
      schema: options.schema || 'public',
      table: table,
      filter: filter
    }, callback)
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ Subscribed to ${table} changes`)
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Error subscribing to ${table} changes`)
      }
    })
  
  return channel
}

// VATANA-specific helper functions
export const vatanaHelpers = {
  // Get user profile with caching
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user's health score
  async getHealthScore(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('health_score')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data.health_score
  },

  // Get recent uploads with status
  async getRecentUploads(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}