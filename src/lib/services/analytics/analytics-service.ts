import { supabaseAdmin } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import type { AnalyticsMetrics, ComparisonMetrics, PredictiveInsights } from '@/types/analytics'

export class AnalyticsService {
  async getCompanyAnalytics(companyId: string, period: string = 'current'): Promise<AnalyticsMetrics> {
    const { startDate, endDate } = this.getPeriodDates(period)

    // Fetch all data in parallel
    const [
      healthScoreTrend,
      errorsByType,
      errorsByCountry,
      savingsTrend,
      complianceRate,
      processingSpeed,
      topIssues
    ] = await Promise.all([
      this.getHealthScoreTrend(companyId, startDate, endDate),
      this.getErrorsByType(companyId, startDate, endDate),
      this.getErrorsByCountry(companyId, startDate, endDate),
      this.getSavingsTrend(companyId, startDate, endDate),
      this.getComplianceRate(companyId, startDate, endDate),
      this.getProcessingSpeed(companyId, startDate, endDate),
      this.getTopIssues(companyId, startDate, endDate)
    ])

    return {
      period,
      healthScoreTrend,
      errorsByType,
      errorsByCountry,
      savingsTrend,
      complianceRate,
      processingSpeed,
      topIssues
    }
  }

  async getComparison(companyId: string): Promise<ComparisonMetrics> {
    const [current, previous] = await Promise.all([
      this.getCompanyAnalytics(companyId, 'current'),
      this.getCompanyAnalytics(companyId, 'previous')
    ])

    const percentageChange = this.calculatePercentageChanges(current, previous)

    return {
      currentPeriod: current,
      previousPeriod: previous,
      percentageChange
    }
  }

  async getPredictiveInsights(companyId: string): Promise<PredictiveInsights> {
    // Get historical data for ML predictions
    const historicalData = await this.getHistoricalTrends(companyId, 12) // 12 months

    // Simple linear regression for risk forecast
    const riskForecast = this.forecastRisk(historicalData)

    // Calculate savings opportunities
    const savingsOpportunity = await this.calculateSavingsOpportunity(companyId)

    // Generate recommended actions based on patterns
    const recommendedActions = await this.generateRecommendations(companyId, historicalData)

    return {
      riskForecast,
      savingsOpportunity,
      recommendedActions
    }
  }

  private async getHealthScoreTrend(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('users')
      .select('health_score, updated_at')
      .eq('company_id', companyId)
      .gte('updated_at', startDate.toISOString())
      .lte('updated_at', endDate.toISOString())
      .order('updated_at', { ascending: true })

    return (data || []).map(d => ({
      date: format(new Date(d.updated_at), 'MMM dd'),
      score: d.health_score
    }))
  }

  private async getErrorsByType(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('vat_errors')
      .select('error_type, detected_at')
      .eq('company_id', companyId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString())

    const grouped = (data || []).reduce((acc, error) => {
      const type = error.error_type.replace('ERROR_', '').replace(/_/g, ' ')
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get previous period for trend
    const prevStart = subMonths(startDate, 1)
    const { data: prevData } = await supabaseAdmin
      .from('vat_errors')
      .select('error_type')
      .eq('company_id', companyId)
      .gte('detected_at', prevStart.toISOString())
      .lt('detected_at', startDate.toISOString())

    const prevGrouped = (prevData || []).reduce((acc, error) => {
      const type = error.error_type.replace('ERROR_', '').replace(/_/g, ' ')
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([type, count]) => ({
      type,
      count,
      trend: this.calculateTrend(count, prevGrouped[type] || 0)
    }))
  }

  private async getErrorsByCountry(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('vat_errors')
      .select('invoices(customer_country), penalty_risk')
      .eq('company_id', companyId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString())

    const grouped = (data || []).reduce((acc, error: any) => {
      const country = error.invoices?.customer_country || 'Unknown'
      if (!acc[country]) {
        acc[country] = { count: 0, penaltyRisk: 0 }
      }
      acc[country].count++
      acc[country].penaltyRisk += Number(error.penalty_risk)
      return acc
    }, {} as Record<string, { count: number; penaltyRisk: number }>)

    return Object.entries(grouped).map(([country, data]) => ({
      country,
      count: data.count,
      penaltyRisk: data.penaltyRisk
    }))
  }

  private async getSavingsTrend(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('cost_savings')
      .select('period, net_savings')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    return (data || []).map(d => ({
      date: d.period,
      amount: Number(d.net_savings)
    }))
  }

  private async getComplianceRate(companyId: string, startDate: Date, endDate: Date): Promise<number> {
    const { data: invoices } = await supabaseAdmin
      .from('invoices')
      .select('id, status')
      .eq('company_id', companyId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (!invoices || invoices.length === 0) return 100

    const compliant = invoices.filter(i => i.status === 'valid' || i.status === 'fixed').length
    return Math.round((compliant / invoices.length) * 100)
  }

  private async getProcessingSpeed(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('uploads')
      .select('upload_date, row_count, created_at, updated_at')
      .eq('company_id', companyId)
      .eq('processed', true)
      .gte('upload_date', startDate.toISOString())
      .lte('upload_date', endDate.toISOString())

    return (data || []).map(upload => ({
      date: format(new Date(upload.upload_date), 'MMM dd'),
      avgTimeSeconds: Math.round(
        (new Date(upload.updated_at).getTime() - new Date(upload.created_at).getTime()) / 1000
      )
    }))
  }

  private async getTopIssues(companyId: string, startDate: Date, endDate: Date) {
    const { data } = await supabaseAdmin
      .from('vat_errors')
      .select('error_type, penalty_risk')
      .eq('company_id', companyId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString())

    const issues = (data || []).reduce((acc, error) => {
      const type = error.error_type.replace('ERROR_', '').replace(/_/g, ' ')
      if (!acc[type]) {
        acc[type] = { frequency: 0, impact: 0 }
      }
      acc[type].frequency++
      acc[type].impact += Number(error.penalty_risk)
      return acc
    }, {} as Record<string, { frequency: number; impact: number }>)

    return Object.entries(issues)
      .map(([issue, data]) => ({
        issue,
        frequency: data.frequency,
        impact: data.impact
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5)
  }

  private async getHistoricalTrends(companyId: string, months: number) {
    const endDate = new Date()
    const startDate = subMonths(endDate, months)

    const { data } = await supabaseAdmin
      .from('vat_errors')
      .select('detected_at, penalty_risk, resolved')
      .eq('company_id', companyId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString())

    return data || []
  }

  private forecastRisk(historicalData: any[]): Array<{ month: string; predictedRisk: number; confidence: number }> {
    // Simple moving average forecast
    const monthlyRisk = historicalData.reduce((acc, error) => {
      const month = format(new Date(error.detected_at), 'yyyy-MM')
      acc[month] = (acc[month] || 0) + Number(error.penalty_risk)
      return acc
    }, {} as Record<string, number>)

    const values = Object.values(monthlyRisk)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const trend = (values[values.length - 1] - values[0]) / values.length

    // Forecast next 3 months
    return Array.from({ length: 3 }, (_, i) => {
      const forecastDate = new Date()
      forecastDate.setMonth(forecastDate.getMonth() + i + 1)
      const predicted = avg + (trend * (i + 1))
      
      return {
        month: format(forecastDate, 'MMM yyyy'),
        predictedRisk: Math.max(0, predicted),
        confidence: Math.max(0.5, 1 - (i * 0.15)) // Confidence decreases with time
      }
    })
  }

  private async calculateSavingsOpportunity(companyId: string): Promise<number> {
    const { data: unresolvedErrors } = await supabaseAdmin
      .from('vat_errors')
      .select('penalty_risk, can_auto_fix')
      .eq('company_id', companyId)
      .eq('resolved', false)

    return (unresolvedErrors || [])
      .filter(e => e.can_auto_fix)
      .reduce((sum, e) => sum + Number(e.penalty_risk), 0)
  }

  private async generateRecommendations(
    companyId: string, 
    historicalData: any[]
  ): Promise<Array<{ action: string; impact: number; priority: 'high' | 'medium' | 'low' }>> {
    const recommendations: Array<{ action: string; impact: number; priority: 'high' | 'medium' | 'low' }> = []

    // Analyze error patterns
    const errorTypes = historicalData.reduce((acc, error) => {
      acc[error.error_type] = (acc[error.error_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // High-frequency errors
    const topError = Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0]
    if (topError && topError[1] > 10) {
      recommendations.push({
        action: `Implement automated validation for ${topError[0].replace('ERROR_', '').replace(/_/g, ' ')}`,
        impact: topError[1] * 50, // Estimate impact
        priority: 'high'
      })
    }

    // Unresolved errors
    const { data: unresolvedCount } = await supabaseAdmin
      .from('vat_errors')
      .select('id', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('resolved', false)

    if (unresolvedCount && unresolvedCount.length > 20) {
      recommendations.push({
        action: 'Schedule bulk fix session to resolve outstanding errors',
        impact: 1000,
        priority: 'high'
      })
    }

    // Always recommend review
    recommendations.push({
      action: 'Monthly compliance audit to maintain high health score',
      impact: 500,
      priority: 'medium'
    })

    return recommendations
  }

  private calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    const change = ((current - previous) / previous) * 100
    if (change > 10) return 'up'
    if (change < -10) return 'down'
    return 'stable'
  }

  private calculatePercentageChanges(current: AnalyticsMetrics, previous: AnalyticsMetrics) {
    const calcChange = (curr: number, prev: number) => 
      prev === 0 ? 100 : ((curr - prev) / prev) * 100

    const currentScore = current.healthScoreTrend[current.healthScoreTrend.length - 1]?.score || 0
    const prevScore = previous.healthScoreTrend[previous.healthScoreTrend.length - 1]?.score || 0

    const currentErrors = current.errorsByType.reduce((sum, e) => sum + e.count, 0)
    const prevErrors = previous.errorsByType.reduce((sum, e) => sum + e.count, 0)

    const currentSavings = current.savingsTrend.reduce((sum, s) => sum + s.amount, 0)
    const prevSavings = previous.savingsTrend.reduce((sum, s) => sum + s.amount, 0)

    return {
      healthScore: calcChange(currentScore, prevScore),
      errorCount: calcChange(currentErrors, prevErrors),
      savings: calcChange(currentSavings, prevSavings),
      complianceRate: calcChange(current.complianceRate, previous.complianceRate)
    }
  }

  private getPeriodDates(period: string): { startDate: Date; endDate: Date } {
    const now = new Date()
    
    if (period === 'current') {
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now)
      }
    } else if (period === 'previous') {
      const prevMonth = subMonths(now, 1)
      return {
        startDate: startOfMonth(prevMonth),
        endDate: endOfMonth(prevMonth)
      }
    }
    
    // Default to current month
    return {
      startDate: startOfMonth(now),
      endDate: endOfMonth(now)
    }
  }
}

export const analyticsService = new AnalyticsService()
