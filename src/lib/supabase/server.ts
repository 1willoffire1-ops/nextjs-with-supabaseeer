import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!

// Only validate environment variables at runtime, not build time
function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables')
  }
}

// Server-side admin client for VATANA backend operations
// Create client lazily to avoid build-time validation issues
let _supabaseAdmin: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseClient<Database>>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      validateSupabaseConfig()
      _supabaseAdmin = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    return (_supabaseAdmin as any)[prop]
  }
})

// Note: This file is kept for compatibility but most functionality 
// should be moved to client-side code in a Vite app

// Health score calculation with caching
const healthScoreCache = new Map<string, { score: number; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute

export const updateHealthScore = async (userId: string): Promise<number> => {
  // Check cache first
  const cached = healthScoreCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.score
  }
  
  try {
    // Calculate health score based on errors
    const { data: errors, error } = await supabaseAdmin
      .from('vat_errors')
      .select('severity, penalty_risk_eur, resolved')
      .eq('invoice.upload.user_id', userId)
    
    if (error) throw error
    
    let score = 100
    const unresolvedErrors = errors?.filter(e => !e.resolved) || []
    
    // Deduct points based on severity
    unresolvedErrors.forEach(error => {
      switch (error.severity) {
        case 'critical': score -= 15; break
        case 'high': score -= 10; break
        case 'medium': score -= 5; break
        case 'low': score -= 2; break
      }
    })
    
    // Deduct based on penalty risk
    const totalRisk = unresolvedErrors.reduce((sum, e) => sum + (e.penalty_risk_eur || 0), 0)
    score -= Math.min(20, totalRisk / 100) // Max 20 points for risk
    
    score = Math.max(0, Math.min(100, score))
    
    // Update user's health score
    await supabaseAdmin
      .from('users')
      .update({ health_score: score })
      .eq('id', userId)
    
    // Cache the result
    healthScoreCache.set(userId, {
      score,
      timestamp: Date.now()
    })
    
    return score
  } catch (error) {
    console.error('Health score calculation error:', error)
    return 50 // Default fallback
  }
}