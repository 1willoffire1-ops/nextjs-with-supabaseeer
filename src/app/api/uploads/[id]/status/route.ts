import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const uploadId = params.id
      
      const { data: upload, error } = await supabaseAdmin
        .from('uploads')
        .select(`
          *,
          invoices:invoices(count)
        `)
        .eq('id', uploadId)
        .eq('user_id', req.user.id)
        .single()
      
      if (error || !upload) {
        return NextResponse.json(
          { error: 'Upload not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        id: upload.id,
        filename: upload.filename,
        status: upload.processing_status,
        progress: upload.processing_progress,
        row_count: upload.row_count,
        errors_found: upload.errors_found,
        invoices_processed: upload.invoices?.[0]?.count || 0,
        created_at: upload.created_at,
        updated_at: upload.updated_at
      })
      
    } catch (error) {
      console.error('💥 Upload status error:', error)
      return NextResponse.json(
        { error: 'Failed to get upload status' },
        { status: 500 }
      )
    }
  })
}