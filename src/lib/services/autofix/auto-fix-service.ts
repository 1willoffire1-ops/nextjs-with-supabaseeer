import { supabaseAdmin } from '@/lib/supabase/server'
import { getFixStrategy, FixResult } from './fix-strategies'
import type { Invoice, VatError } from '@/types/supabase'

export class AutoFixService {
  /**
   * Preview a fix without applying it
   */
  async previewFix(errorId: string): Promise<FixResult> {
    // Get error and related invoice
    const { data: error } = await supabaseAdmin
      .from('vat_errors')
      .select('*')
      .eq('id', errorId)
      .single()

    if (!error) {
      throw new Error('Error not found')
    }

    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', error.invoice_id)
      .single()

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    // Get fix strategy and preview
    return getFixStrategy(invoice, error)
  }

  /**
   * Execute a fix and update database
   */
  async executeFix(errorId: string, userId: string): Promise<FixResult> {
    // Get error and invoice
    const { data: error } = await supabaseAdmin
      .from('vat_errors')
      .select('*')
      .eq('id', errorId)
      .single()

    if (!error) {
      throw new Error('Error not found')
    }

    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', error.invoice_id)
      .single()

    if (!invoice) {
      throw new Error('Invoice not found')
    }

    // Get fix strategy
    const fixResult = await getFixStrategy(invoice, error)

    if (!fixResult.success) {
      throw new Error('Fix strategy failed')
    }

    // Apply the fix to invoice
    const { error: updateError } = await supabaseAdmin
      .from('invoices')
      .update({
        ...fixResult.after,
        status: 'fixed',
        updated_at: new Date().toISOString()
      })
      .eq('id', invoice.id)

    if (updateError) {
      throw new Error(`Failed to update invoice: ${updateError.message}`)
    }

    // Mark error as resolved
    await supabaseAdmin
      .from('vat_errors')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolution_method: 'auto'
      })
      .eq('id', errorId)

    // Record fix in history
    await supabaseAdmin
      .from('fix_history')
      .insert({
        company_id: invoice.company_id,
        user_id: userId,
        error_id: errorId,
        invoice_id: invoice.id,
        fix_type: 'auto',
        fix_strategy: fixResult.strategy,
        before_value: fixResult.before,
        after_value: fixResult.after,
        penalty_avoided: fixResult.penaltyAvoided,
        time_saved_minutes: 5, // Average time to fix manually
        fixed_at: new Date().toISOString()
      })

    // Update cost savings
    await this.updateCostSavings(invoice.company_id, userId, fixResult.penaltyAvoided)

    // Recalculate health score
    await this.recalculateHealthScore(invoice.company_id)

    return fixResult
  }

  /**
   * Fix multiple errors at once
   */
  async bulkFix(errorIds: string[], userId: string): Promise<{
    successful: number
    failed: number
    totalSavings: number
    results: Array<{ errorId: string; success: boolean; error?: string }>
  }> {
    const results: Array<{ errorId: string; success: boolean; error?: string }> = []
    let successful = 0
    let failed = 0
    let totalSavings = 0

    for (const errorId of errorIds) {
      try {
        const result = await this.executeFix(errorId, userId)
        results.push({ errorId, success: true })
        successful++
        totalSavings += result.penaltyAvoided
      } catch (error) {
        results.push({ 
          errorId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        failed++
      }
    }

    return {
      successful,
      failed,
      totalSavings,
      results
    }
  }

  /**
   * Undo a fix
   */
  async undoFix(fixHistoryId: string): Promise<void> {
    // Get fix history
    const { data: fixHistory } = await supabaseAdmin
      .from('fix_history')
      .select('*')
      .eq('id', fixHistoryId)
      .single()

    if (!fixHistory || !fixHistory.can_undo) {
      throw new Error('Cannot undo this fix')
    }

    // Restore original values
    await supabaseAdmin
      .from('invoices')
      .update({
        ...fixHistory.before_value,
        status: 'error',
        updated_at: new Date().toISOString()
      })
      .eq('id', fixHistory.invoice_id)

    // Re-open error
    await supabaseAdmin
      .from('vat_errors')
      .update({
        resolved: false,
        resolved_at: null,
        resolution_method: null
      })
      .eq('id', fixHistory.error_id)

    // Mark fix as undone
    await supabaseAdmin
      .from('fix_history')
      .update({
        undone: true,
        undone_at: new Date().toISOString()
      })
      .eq('id', fixHistoryId)

    // Recalculate health score
    await this.recalculateHealthScore(fixHistory.company_id)
  }

  /**
   * Update cost savings tracking
   */
  private async updateCostSavings(
    companyId: string,
    userId: string,
    penaltyAvoided: number
  ): Promise<void> {
    const period = this.getCurrentPeriod()

    // Get or create savings record for current period
    const { data: existing } = await supabaseAdmin
      .from('cost_savings')
      .select('*')
      .eq('company_id', companyId)
      .eq('period', period)
      .single()

    if (existing) {
      // Update existing record
      await supabaseAdmin
        .from('cost_savings')
        .update({
          total_errors_fixed: existing.total_errors_fixed + 1,
          total_penalty_avoided: Number(existing.total_penalty_avoided) + penaltyAvoided,
          auto_fix_count: existing.auto_fix_count + 1,
          processing_time_saved_hours: Number(existing.processing_time_saved_hours) + 0.083, // 5 minutes
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabaseAdmin
        .from('cost_savings')
        .insert({
          company_id: companyId,
          user_id: userId,
          period,
          total_errors_fixed: 1,
          total_penalty_avoided: penaltyAvoided,
          auto_fix_count: 1,
          processing_time_saved_hours: 0.083,
          estimated_manual_cost: 50, // €50/hour average
          traditional_method_cost: 2500, // Estimated quarterly cost
          vatana_cost: 87, // €29/month × 3 months
          net_savings: penaltyAvoided,
          roi_percentage: ((penaltyAvoided - 87) / 87) * 100
        })
    }
  }

  /**
   * Recalculate company health score
   */
  private async recalculateHealthScore(companyId: string): Promise<void> {
    // Get all invoices and errors for company
    const { data: invoices } = await supabaseAdmin
      .from('invoices')
      .select('id')
      .eq('company_id', companyId)

    const { data: errors } = await supabaseAdmin
      .from('vat_errors')
      .select('penalty_risk, resolved')
      .eq('company_id', companyId)

    if (!invoices || !errors) return

    const totalInvoices = invoices.length
    const unresolvedErrors = errors.filter(e => !e.resolved).length
    const totalPenaltyRisk = errors
      .filter(e => !e.resolved)
      .reduce((sum, e) => sum + Number(e.penalty_risk), 0)

    // Calculate health score (0-100)
    const accuracyScore = totalInvoices > 0 
      ? 100 * (1 - unresolvedErrors / totalInvoices) 
      : 100
    
    const riskScore = totalPenaltyRisk > 0 
      ? Math.max(0, 100 - (totalPenaltyRisk / 100)) 
      : 100

    const healthScore = Math.round((accuracyScore * 0.6) + (riskScore * 0.4))

    // Update user health score
    await supabaseAdmin
      .from('users')
      .update({ health_score: healthScore })
      .eq('company_id', companyId)
  }

  /**
   * Get current period (YYYY-QX format)
   */
  private getCurrentPeriod(): string {
    const now = new Date()
    const year = now.getFullYear()
    const quarter = Math.floor(now.getMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }
}

// Export singleton instance
export const autoFixService = new AutoFixService()