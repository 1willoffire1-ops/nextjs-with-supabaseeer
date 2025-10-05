import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest & { user: any; profile: User }) => Promise<NextResponse>
) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization token provided' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    // Add user data to request
    const enhancedRequest = request as NextRequest & {
      user: typeof user
      profile: User
    }
    enhancedRequest.user = user
    enhancedRequest.profile = profile
    
    return handler(enhancedRequest)
    
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Plan tier checking
export async function requirePlanTier(
  profile: User,
  requiredTier: 'free' | 'professional' | 'enterprise'
): Promise<boolean> {
  const tierLevels = {
    'free': 0,
    'professional': 1,
    'enterprise': 2
  }
  
  const userLevel = tierLevels[profile.plan_tier as keyof typeof tierLevels] || 0
  const requiredLevel = tierLevels[requiredTier] || 0
  
  return userLevel >= requiredLevel
}