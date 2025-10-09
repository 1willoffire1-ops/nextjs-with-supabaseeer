import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
    }

    if (data.user) {
      // Check if user profile exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Create profile if it doesn't exist (for social sign-ups)
      if (userError || !userData) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          company_name: data.user.user_metadata?.company_name || 'My Company',
          country_code: 'GB',
          plan_tier: 'trial',
          subscription_status: 'trial',
          onboarding_completed: false,
        })
      }

      // Redirect to next page
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // Return error if no code
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_code`)
}
