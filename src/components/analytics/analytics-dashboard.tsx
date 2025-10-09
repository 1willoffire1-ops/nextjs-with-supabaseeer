'use client'

import { useState, useEffect } from 'react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import type { AnalyticsMetrics, ComparisonMetrics, PredictiveInsights } from '@/types/analytics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalyticsDashboardProps {
  companyId?: string
  period?: string
}

export default function AnalyticsDashboard({ companyId, period = 'current' }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null)
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null)
  const [predictions, setPredictions] = useState<PredictiveInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(period)

  useEffect(() => {
    fetchAnalytics()
  }, [companyId, selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      const [analyticsRes, comparisonRes, predictionsRes] = await Promise.all([
        fetch(`/api/analytics?period=${selectedPeriod}&company_id=${companyId}`),
        fetch(`/api/analytics/comparison?company_id=${companyId}`),
        fetch(`/api/analytics/predictions?company_id=${companyId}`)
      ])

      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json())
      }
      if (comparisonRes.ok) {
        setComparison(await comparisonRes.json())
      }
      if (predictionsRes.ok) {
        setPredictions(await predictionsRes.json())
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AnalyticsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive VAT compliance insights and predictions
          </p>
        </div>
        
        <div className="flex space-x-2">
          {['current', 'previous', 'quarter', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Health Score"
          value={analytics?.healthScoreTrend?.slice(-1)?.[0]?.score || 0}
          suffix="%"
          trend={comparison?.percentageChange?.healthScore || 0}
          icon="🎯"
          color="blue"
        />
        <MetricCard
          title="Compliance Rate"
          value={analytics?.complianceRate || 100}
          suffix="%"
          trend={comparison?.percentageChange?.complianceRate || 0}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Total Errors"
          value={analytics?.errorsByType?.reduce((sum, e) => sum + e.count, 0) || 0}
          trend={comparison?.percentageChange?.errorCount || 0}
          icon="⚠️"
          color="red"
        />
        <MetricCard
          title="Monthly Savings"
          value={analytics?.savingsTrend?.slice(-1)?.[0]?.amount || 0}
          prefix="€"
          trend={comparison?.percentageChange?.savings || 0}
          icon="💰"
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Trend */}
        <ChartCard title="Health Score Trend" description="Track compliance health over time">
          <Line
            data={{
              labels: analytics?.healthScoreTrend?.map(d => d.date) || [],
              datasets: [{
                label: 'Health Score',
                data: analytics?.healthScoreTrend?.map(d => d.score) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { color: 'rgb(156, 163, 175)' }
                },
                x: {
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { color: 'rgb(156, 163, 175)' }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </ChartCard>

        {/* Errors by Type */}
        <ChartCard title="Error Distribution" description="Breakdown of VAT compliance issues">
          <Doughnut
            data={{
              labels: analytics?.errorsByType?.map(e => e.type) || [],
              datasets: [{
                data: analytics?.errorsByType?.map(e => e.count) || [],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(139, 92, 246, 0.8)',
                ],
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: { color: 'rgb(156, 163, 175)' }
                }
              }
            }}
          />
        </ChartCard>

        {/* Savings Trend */}
        <ChartCard title="Cost Savings Trend" description="Track penalty savings over time">
          <Bar
            data={{
              labels: analytics?.savingsTrend?.map(d => d.date) || [],
              datasets: [{
                label: 'Savings (€)',
                data: analytics?.savingsTrend?.map(d => d.amount) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { 
                    color: 'rgb(156, 163, 175)',
                    callback: function(value) {
                      return '€' + value
                    }
                  }
                },
                x: {
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { color: 'rgb(156, 163, 175)' }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </ChartCard>

        {/* Processing Speed */}
        <ChartCard title="Processing Speed" description="Average processing time per invoice">
          <Line
            data={{
              labels: analytics?.processingSpeed?.map(d => d.date) || [],
              datasets: [{
                label: 'Avg Time (seconds)',
                data: analytics?.processingSpeed?.map(d => d.avgTimeSeconds) || [],
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { color: 'rgb(156, 163, 175)' }
                },
                x: {
                  grid: { color: 'rgba(156, 163, 175, 0.1)' },
                  ticks: { color: 'rgb(156, 163, 175)' }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </ChartCard>
      </div>

      {/* Bottom Section: Top Issues & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Issues by Impact
          </h3>
          <div className="space-y-3">
            {analytics?.topIssues?.map((issue, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {issue.issue}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {issue.frequency} occurrences
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    €{issue.impact.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    potential penalty
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Risk Forecast
          </h3>
          <div className="space-y-4">
            {predictions?.riskForecast?.map((forecast, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {forecast.month}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(forecast.confidence * 100)}% confidence
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-orange-600 dark:text-orange-400">
                    €{forecast.predictedRisk.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    predicted risk
                  </div>
                </div>
              </div>
            ))}
            
            {predictions?.savingsOpportunity && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-green-800 dark:text-green-200 font-medium">
                  Savings Opportunity
                </div>
                <div className="text-green-600 dark:text-green-400 text-lg font-bold">
                  €{predictions.savingsOpportunity.toFixed(2)}
                </div>
                <div className="text-green-700 dark:text-green-300 text-sm">
                  Available through auto-fixes
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {predictions?.recommendedActions && predictions.recommendedActions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recommended Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.recommendedActions.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  action.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : action.priority === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    action.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : action.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    €{action.impact}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-gray-100 text-sm">
                  {action.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  trend?: number
  icon: string
  color: 'blue' | 'green' | 'red' | 'emerald'
}

function MetricCard({ title, value, prefix = '', suffix = '', trend = 0, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    emerald: 'text-emerald-600 dark:text-emerald-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {trend !== 0 && (
            <div className={`flex items-center mt-1 text-sm ${
              trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span className="mr-1">{trend > 0 ? '↗' : '↘'}</span>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}

// Chart Card Component
interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div style={{ height: '300px' }}>
        {children}
      </div>
    </div>
  )
}

// Loading Skeleton Component
function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96"></div>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}