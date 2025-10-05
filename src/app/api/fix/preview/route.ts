import { NextRequest, NextResponse } from 'next/server'
import { autoFixService } from '@/lib/services/autofix/auto-fix-service'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { errorId } = await request.json()

    if (!errorId) {
      return NextResponse.json(
        { error: 'Error ID is required' },
        { status: 400 }
      )
    }

    const preview = await autoFixService.previewFix(errorId)
    return NextResponse.json(preview)
  } catch (error) {
    console.error('Fix preview error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to preview fix' },
      { status: 500 }
    )
  }
}