import { supabaseAdmin } from '@/lib/supabase/server'

export interface SavingsSummary {
  period: string
  totalErrorsFixed: number
  totalPenaltyAvoided: number
  autoFixCount: number
  manualFixCount: number
  processingTimeSaved: number
  estimatedManualCost: number
  traditionalMethodCost: number
  vatanaCost: number
  netSavings: number
  roiPercentage: number
}

export class SavingsService {
  /**
   * Get savings summary for a company
   */
  async getSavingsSummary(companyId: string, period?: string): Promise<SavingsSummary | null> {
    const targetPeriod = period || this.getCurrentPeriod()

    const { data } = await supabaseAdmin
      .from('cost_savings')
      .select('*')
      .eq('company_id', companyId)
      .eq('period', targetPeriod)
      .single()

    if (!data) return null

    return {
      period: data.period,
      totalErrorsFixed: data.total_errors_fixed,
      totalPenaltyAvoided: Number(data.total_penalty_avoided),
      autoFixCount: data.auto_fix_count,
      manualFixCount: data.manual_fix_count,
      processingTimeSaved: Number(data.processing_time_saved_hours),
      estimatedManualCost: Number(data.estimated_manual_cost),
      traditionalMethodCost: Number(data.traditional_method_cost),
      vatanaCost: Number(data.vatana_cost),
      netSavings: Number(data.net_savings),
      roiPercentage: Number(data.roi_percentage)
    }
  }

  /**
   * Get all-time savings
   */
  async getAllTimeSavings(companyId: string): Promise<SavingsSummary> {
    const { data } = await supabaseAdmin
      .from('cost_savings')
      .select('*')
      .eq('company_id', companyId)

    if (!data || data.length === 0) {
      return this.getEmptySavings()
    }

    // Aggregate all periods
    const totals = data.reduce((acc, curr) => ({
      totalErrorsFixed: acc.totalErrorsFixed + curr.total_errors_fixed,
      totalPenaltyAvoided: acc.totalPenaltyAvoided + Number(curr.total_penalty_avoided),
      autoFixCount: acc.autoFixCount + curr.auto_fix_count,
      manualFixCount: acc.manualFixCount + curr.manual_fix_count,
      processingTimeSaved: acc.processingTimeSaved + Number(curr.processing_time_saved_hours),
      estimatedManualCost: acc.estimatedManualCost + Number(curr.estimated_manual_cost),
      traditionalMethodCost: acc.traditionalMethodCost + Number(curr.traditional_method_cost),
      vatanaCost: acc.vatanaCost + Number(curr.vatana_cost),
    }), {
      totalErrorsFixed: 0,
      totalPenaltyAvoided: 0,
      autoFixCount: 0,
      manualFixCount: 0,
      processingTimeSaved: 0,
      estimatedManualCost: 0,
      traditionalMethodCost: 0,
      vatanaCost: 0,
    })

    const netSavings = totals.totalPenaltyAvoided + totals.estimatedManualCost - totals.vatanaCost
    const roiPercentage = totals.vatanaCost > 0 
      ? ((netSavings / totals.vatanaCost) * 100) 
      : 0

    return {
      period: 'all-time',
      ...totals,
      netSavings,
      roiPercentage
    }
  }

  /**
   * Get fix history for a company
   */
  async getFixHistory(companyId: string, limit: number = 50) {
    const { data } = await supabaseAdmin
      .from('fix_history')
      .select('*, invoices(invoice_id, customer_name), vat_errors(error_type, error_message)')
      .eq('company_id', companyId)
      .order('fixed_at', { ascending: false })
      .limit(limit)

    return data || []
  }

  private getCurrentPeriod(): string {
    const now = new Date()
    const year = now.getFullYear()
    const quarter = Math.floor(now.getMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }

  private getEmptySavings(): SavingsSummary {
    return {
      period: this.getCurrentPeriod(),
      totalErrorsFixed: 0,
      totalPenaltyAvoided: 0,
      autoFixCount: 0,
      manualFixCount: 0,
      processingTimeSaved: 0,
      estimatedManualCost: 0,
      traditionalMethodCost: 0,
      vatanaCost: 0,
      netSavings: 0,
      roiPercentage: 0
    }
  }
}

export const savingsService = new SavingsService()