import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/middleware'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url)
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
      const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
      const status = searchParams.get('status') // 'resolved' | 'unresolved'
      const severity = searchParams.get('severity') // 'low' | 'medium' | 'high' | 'critical'
      const uploadId = searchParams.get('upload_id')
      const offset = (page - 1) * limit
      
      let query = supabaseAdmin
        .from('vat_errors')
        .select(`
          *,
          invoice:invoices(
            invoice_id,
            date,
            customer_name,
            customer_country,
            net_amount,
            vat_amount,
            upload:uploads(
              id,
              filename,
              period,
              user_id
            )
          )
        `, { count: 'exact' })
        .eq('invoice.upload.user_id', req.user.id)
        .order('penalty_risk_eur', { ascending: false })
      
      // Apply filters
      if (status === 'resolved') {
        query = query.eq('resolved', true)
      } else if (status === 'unresolved') {
        query = query.eq('resolved', false)
      }
      
      if (severity && ['low', 'medium', 'high', 'critical'].includes(severity)) {
        query = query.eq('severity', severity)
      }
      
      if (uploadId) {
        query = query.eq('invoice.upload_id', uploadId)
      }
      
      const { data: errors, error, count } = await query
        .range(offset, offset + limit - 1)
      
      if (error) {
        console.error('💥 Errors fetch error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch errors' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        errors: errors || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        },
        summary: {
          total_penalty_risk: (errors || []).reduce((sum, e) => sum + (e.penalty_risk_eur || 0), 0),
          auto_fixable_count: (errors || []).filter(e => e.auto_fixable).length
        }
      })
      
    } catch (error) {
      console.error('💥 Errors list error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch errors' },
        { status: 500 }
      )
    }
  })
}