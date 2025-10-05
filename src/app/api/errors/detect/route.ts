import { NextRequest, NextResponse } from 'next/server'
import { withAuth, requirePlanTier } from '@/lib/auth/middleware'
import { ErrorDetector } from '@/lib/engines/error-detector'
import { updateHealthScore } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { upload_id, use_ai = false } = await req.json()
      
      if (!upload_id) {
        return NextResponse.json(
          { error: 'Upload ID required' },
          { status: 400 }
        )
      }
      
      // Check if AI analysis is requested and user has access
      if (use_ai) {
        const hasAIAccess = await requirePlanTier(req.profile, 'professional')
        if (!hasAIAccess) {
          return NextResponse.json(
            { 
              error: 'AI-powered error detection requires Professional plan or higher',
              upgrade_required: true
            },
            { status: 403 }
          )
        }
      }
      
      console.log(`🔍 Starting error detection for upload ${upload_id}, AI: ${use_ai}`)
      
      // Run error detection
      const errors = await ErrorDetector.detectErrors(upload_id, use_ai)
      
      // Update user's health score
      await updateHealthScore(req.user.id)
      
      // Categorize errors for summary
      const summary = {
        total_errors: errors.length,
        critical_errors: errors.filter(e => e.severity === 'critical').length,
        high_errors: errors.filter(e => e.severity === 'high').length,
        medium_errors: errors.filter(e => e.severity === 'medium').length,
        low_errors: errors.filter(e => e.severity === 'low').length,
        auto_fixable: errors.filter(e => e.auto_fixable).length,
        total_penalty_risk: errors.reduce((sum, e) => sum + (e.penalty_risk_eur || 0), 0),
        by_type: this.groupErrorsByType(errors)
      }
      
      console.log(`✅ Error detection completed: ${errors.length} errors found`)
      
      return NextResponse.json({
        success: true,
        upload_id,
        errors_detected: errors.length,
        ai_analysis_used: use_ai,
        summary,
        message: errors.length > 0 
          ? `Found ${errors.length} compliance issues` 
          : '🎉 No compliance issues found!'
      })
      
    } catch (error) {
      console.error('💥 Error detection failed:', error)
      return NextResponse.json(
        { error: 'Error detection failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      )
    }
  })
}

// Helper function to group errors by type
function groupErrorsByType(errors: any[]) {
  const grouped: Record<string, number> = {}
  
  errors.forEach(error => {
    grouped[error.error_type] = (grouped[error.error_type] || 0) + 1
  })
  
  return grouped
}