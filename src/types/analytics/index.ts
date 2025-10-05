export interface AnalyticsMetrics {
  period: string
  healthScoreTrend: Array<{ date: string; score: number }>
  errorsByType: Array<{ type: string; count: number; trend: 'up' | 'down' | 'stable' }>
  errorsByCountry: Array<{ country: string; count: number; penaltyRisk: number }>
  savingsTrend: Array<{ date: string; amount: number }>
  complianceRate: number
  processingSpeed: Array<{ date: string; avgTimeSeconds: number }>
  topIssues: Array<{ issue: string; frequency: number; impact: number }>
}

export interface ComparisonMetrics {
  currentPeriod: AnalyticsMetrics
  previousPeriod: AnalyticsMetrics
  percentageChange: {
    healthScore: number
    errorCount: number
    savings: number
    complianceRate: number
  }
}

export interface PredictiveInsights {
  riskForecast: Array<{ month: string; predictedRisk: number; confidence: number }>
  savingsOpportunity: number
  recommendedActions: Array<{ action: string; impact: number; priority: 'high' | 'medium' | 'low' }>
}
