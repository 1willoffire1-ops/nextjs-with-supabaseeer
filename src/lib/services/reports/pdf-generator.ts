import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { supabaseAdmin } from '@/lib/supabase/server'

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 15
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10
  },
  section: {
    marginTop: 20,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: 1,
    borderBottomColor: '#f3f4f6'
  },
  label: {
    fontSize: 12,
    color: '#6b7280'
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  summaryBox: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 15
  },
  summaryText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 1.5
  },
  errorTable: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 10
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 9
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af'
  },
  highlight: {
    backgroundColor: '#fef3c7',
    padding: 3,
    fontSize: 12,
    fontWeight: 'bold'
  }
})

interface ReportData {
  companyName: string
  period: string
  generatedDate: string
  healthScore: number
  totalInvoices: number
  totalErrors: number
  errorsByType: Array<{ type: string; count: number; penaltyRisk: number }>
  totalPenaltyRisk: number
  fixedErrors: number
  savingsData: {
    totalSaved: number
    autoFixCount: number
    timeSaved: number
    roiPercentage: number
  }
  recommendations: string[]
}

// PDF Document Component
export const ComplianceReportPDF = ({ data }: { data: ReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>VATANA Compliance Report</Text>
        <Text style={styles.subtitle}>{data.companyName}</Text>
        <Text style={styles.subtitle}>Period: {data.period}</Text>
        <Text style={styles.subtitle}>Generated: {data.generatedDate}</Text>
      </View>

      {/* Executive Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            VAT Health Score: {data.healthScore}/100
          </Text>
          <Text style={styles.summaryText}>
            Total Invoices Processed: {data.totalInvoices}
          </Text>
          <Text style={styles.summaryText}>
            Errors Detected: {data.totalErrors}
          </Text>
          <Text style={styles.summaryText}>
            Errors Fixed: {data.fixedErrors}
          </Text>
        </View>
      </View>

      {/* Financial Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Impact</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Penalty Risk Identified:</Text>
          <Text style={[styles.value, { color: '#dc2626' }]}>
            €{data.totalPenaltyRisk.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Savings Achieved:</Text>
          <Text style={[styles.value, { color: '#16a34a' }]}>
            €{data.savingsData.totalSaved.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Return on Investment:</Text>
          <Text style={[styles.value, { color: '#2563eb' }]}>
            {data.savingsData.roiPercentage.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time Saved:</Text>
          <Text style={styles.value}>
            {data.savingsData.timeSaved.toFixed(1)} hours
          </Text>
        </View>
      </View>

      {/* Error Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error Analysis</Text>
        <View style={styles.errorTable}>
          <View style={styles.tableHeader}>
            <Text style={{ width: '50%' }}>Error Type</Text>
            <Text style={{ width: '25%' }}>Count</Text>
            <Text style={{ width: '25%' }}>Risk (€)</Text>
          </View>
          {data.errorsByType.map((error, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={{ width: '50%' }}>{error.type}</Text>
              <Text style={{ width: '25%' }}>{error.count}</Text>
              <Text style={{ width: '25%' }}>€{error.penaltyRisk.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {data.recommendations.map((rec, index) => (
          <Text key={index} style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
            {index + 1}. {rec}
          </Text>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        This report was generated by VATANA - VAT Compliance Platform
        {'\n'}
        Confidential - For internal use only
      </Text>
    </Page>
  </Document>
)

// Report Generation Service
export class ReportGeneratorService {
  async generateComplianceReport(companyId: string, period?: string): Promise<ReportData> {
    // Fetch company data
    const { data: company } = await supabaseAdmin
      .from('users')
      .select('company_name, health_score')
      .eq('company_id', companyId)
      .single()

    if (!company) throw new Error('Company not found')

    // Fetch invoices
    const { data: invoices } = await supabaseAdmin
      .from('invoices')
      .select('id')
      .eq('company_id', companyId)

    // Fetch errors
    const { data: errors } = await supabaseAdmin
      .from('vat_errors')
      .select('error_type, penalty_risk, resolved')
      .eq('company_id', companyId)

    // Fetch savings data
    const { data: savings } = await supabaseAdmin
      .from('cost_savings')
      .select('*')
      .eq('company_id', companyId)
      .eq('period', period || this.getCurrentPeriod())
      .single()

    // Calculate error breakdown
    const errorsByType = this.aggregateErrorsByType(errors || [])
    const totalErrors = errors?.length || 0
    const fixedErrors = errors ? errors.filter(e => e.resolved).length : 0
    const totalPenaltyRisk = (errors?.filter(e => !e.resolved) ?? []).reduce(
      (sum, e) => sum + Number(e.penalty_risk),
      0
    )

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      healthScore: company.health_score,
      errorCount: totalErrors,
      fixedCount: fixedErrors,
      errorsByType
    })

    return {
      companyName: company.company_name,
      period: period || this.getCurrentPeriod(),
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      healthScore: company.health_score,
      totalInvoices: invoices?.length || 0,
      totalErrors,
      errorsByType,
      totalPenaltyRisk,
      fixedErrors,
      savingsData: {
        totalSaved: Number(savings?.net_savings || 0),
        autoFixCount: savings?.auto_fix_count || 0,
        timeSaved: Number(savings?.processing_time_saved_hours || 0),
        roiPercentage: Number(savings?.roi_percentage || 0)
      },
      recommendations
    }
  }

  private aggregateErrorsByType(errors: any[]) {
    const grouped = errors.reduce((acc, error) => {
      const type = error.error_type.replace('ERROR_', '').replace(/_/g, ' ')
      if (!acc[type]) {
        acc[type] = { count: 0, penaltyRisk: 0 }
      }
      acc[type].count++
      acc[type].penaltyRisk += Number(error.penalty_risk)
      return acc
    }, {} as Record<string, { count: number; penaltyRisk: number }>)

    return Object.entries(grouped).map(([type, data]) => ({
      type,
      count: data.count,
      penaltyRisk: data.penaltyRisk
    }))
  }

  private generateRecommendations(data: {
    healthScore: number
    errorCount: number
    fixedCount: number
    errorsByType: Array<{ type: string; count: number }>
  }): string[] {
    const recommendations: string[] = []

    // Health score recommendations
    if (data.healthScore < 60) {
      recommendations.push(
        'Critical: Your VAT health score is below 60. Immediate action required to fix outstanding errors and prevent penalties.'
      )
    } else if (data.healthScore < 80) {
      recommendations.push(
        'Your VAT health score can be improved. Focus on resolving medium and high-severity errors.'
      )
    }

    // Error-specific recommendations
    const wrongRateErrors = data.errorsByType.find(e => e.type.includes('WRONG RATE'))
    if (wrongRateErrors && wrongRateErrors.count > 5) {
      recommendations.push(
        'Multiple incorrect VAT rate errors detected. Consider implementing automated rate validation at invoice creation.'
      )
    }

    const missingVatId = data.errorsByType.find(e => e.type.includes('MISSING VAT'))
    if (missingVatId && missingVatId.count > 0) {
      recommendations.push(
        'B2B transactions require valid VAT IDs. Update your invoicing system to mandate VAT ID collection for business customers.'
      )
    }

    // General recommendations
    if (data.fixedCount < data.errorCount * 0.5) {
      recommendations.push(
        'More than 50% of errors remain unfixed. Use the bulk fix feature to resolve multiple errors quickly.'
      )
    }

    recommendations.push(
      'Schedule monthly VAT compliance reviews to maintain a high health score and avoid last-minute filing issues.'
    )

    recommendations.push(
      'Enable automated notifications to receive alerts about new errors as they are detected.'
    )

    return recommendations
  }

  private getCurrentPeriod(): string {
    const now = new Date()
    const year = now.getFullYear()
    const quarter = Math.floor(now.getMonth() / 3) + 1
    return `${year}-Q${quarter}`
  }
}

export const reportGenerator = new ReportGeneratorService()