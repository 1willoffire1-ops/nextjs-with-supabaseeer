import { NextRequest, NextResponse } from 'next/server'
import { savingsService } from '@/lib/services/savings/savings-service'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's company
    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period')
    const allTime = searchParams.get('all_time') === 'true'

    // Get savings data
    const savings = allTime
      ? await savingsService.getAllTimeSavings(userData.company_id)
      : await savingsService.getSavingsSummary(userData.company_id, period || undefined)

    return NextResponse.json(savings)
  } catch (error) {
    console.error('Savings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch savings data' },
      { status: 500 }
    )
  }
}