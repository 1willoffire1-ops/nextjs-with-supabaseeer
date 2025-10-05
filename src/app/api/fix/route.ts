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

    const { errorId, bulk, errorIds } = await request.json()

    if (bulk && errorIds?.length > 0) {
      // Bulk fix
      const result = await autoFixService.bulkFix(errorIds, user.id)
      return NextResponse.json(result)
    } else if (errorId) {
      // Single fix
      const result = await autoFixService.executeFix(errorId, user.id)
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: 'Error ID or error IDs required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Fix execution error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute fix' },
      { status: 500 }
    )
  }
}

// Undo a fix
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { fixHistoryId } = await request.json()

    if (!fixHistoryId) {
      return NextResponse.json(
        { error: 'Fix history ID is required' },
        { status: 400 }
      )
    }

    await autoFixService.undoFix(fixHistoryId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Undo fix error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to undo fix' },
      { status: 500 }
    )
  }
}