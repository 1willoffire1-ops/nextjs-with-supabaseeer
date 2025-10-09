'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, Clock, Download, Filter } from 'lucide-react'

interface VATError {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  penalty_risk: number
  suggested_fix: string
  auto_fixable: boolean
  invoice_id: string
  confidence_score: number
  invoice_data: any
}

interface AnalysisResults {
  totalRows: number
  validInvoices: number
  errors: number
  issues: VATError[]
  totalPenaltyRisk: number
  processingTime: number
}

export default function VATAnalysisInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set())
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [autoFixing, setAutoFixing] = useState<Set<string>>(new Set())

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (!uploadedFile) return

    setFile(uploadedFile)
    setAnalyzing(true)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('/api/analyze-vat', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const analysisResults = await response.json()
        setResults(analysisResults)
      } else {
        const error = await response.json()
        alert(`Analysis failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'))
    if (csvFile) {
      handleFileUpload(csvFile)
    }
  }, [handleFileUpload])

  const handleAutoFix = async (errorIds: string[]) => {
    if (errorIds.length === 0) return

    setAutoFixing(new Set(errorIds))

    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorIds })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update results to mark errors as fixed
        if (results) {
          setResults({
            ...results,
            issues: results.issues.filter(issue => !errorIds.includes(issue.id))
          })
        }
        
        alert(`Successfully fixed ${result.fixedCount} issues!`)
      } else {
        const error = await response.json()
        alert(`Fix failed: ${error.message}`)
      }
    } catch (error) {
      alert('Fix failed. Please try again.')
    } finally {
      setAutoFixing(new Set())
    }
  }

  const handleExportReport = async () => {
    if (!results) return

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'VAT_ERRORS',
          data: results
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vat-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const filteredErrors = results?.issues?.filter(error => {
    const severityMatch = filterSeverity === 'all' || error.severity === filterSeverity
    const typeMatch = filterType === 'all' || error.type === filterType
    return severityMatch && typeMatch
  }) || []

  const autoFixableErrors = filteredErrors.filter(e => e.auto_fixable)
  const selectedAutoFixableErrors = Array.from(selectedErrors).filter(id => 
    filteredErrors.find(e => e.id === id && e.auto_fixable)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            VAT Analysis Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload invoices for comprehensive VAT compliance validation
          </p>
        </div>
        {results && (
          <button
            onClick={handleExportReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        )}
      </div>

      {/* File Upload Area */}
      {!results && (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {analyzing ? (
            <div className="space-y-4">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Analyzing VAT Compliance...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Processing {file?.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Upload Invoice File
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Drag and drop your CSV file here, or click to select
                </p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard
              title="Total Invoices"
              value={results.totalRows}
              icon={<FileText className="h-6 w-6" />}
              color="blue"
            />
            <SummaryCard
              title="Valid Invoices"
              value={results.validInvoices}
              icon={<CheckCircle className="h-6 w-6" />}
              color="green"
            />
            <SummaryCard
              title="Errors Found"
              value={results.errors}
              icon={<AlertTriangle className="h-6 w-6" />}
              color="red"
            />
            <SummaryCard
              title="Penalty Risk"
              value={`€${results.totalPenaltyRisk.toFixed(2)}`}
              icon={<AlertTriangle className="h-6 w-6" />}
              color="orange"
            />
            <SummaryCard
              title="Processing Time"
              value={`${results.processingTime.toFixed(1)}s`}
              icon={<Clock className="h-6 w-6" />}
              color="purple"
            />
          </div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                </div>
                
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="incorrect_vat_rate">Incorrect VAT Rate</option>
                  <option value="missing_vat_id">Missing VAT ID</option>
                  <option value="calculation_error">Calculation Error</option>
                  <option value="incorrect_reverse_charge">Reverse Charge</option>
                </select>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredErrors.length} of {results.errors} errors shown
                </span>
              </div>

              <div className="flex space-x-2">
                {autoFixableErrors.length > 0 && (
                  <>
                    <button
                      onClick={() => setSelectedErrors(new Set(autoFixableErrors.map(e => e.id)))}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Select All Auto-Fixable
                    </button>
                    <button
                      onClick={() => handleAutoFix(selectedAutoFixableErrors)}
                      disabled={selectedAutoFixableErrors.length === 0 || autoFixing.size > 0}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Auto-Fix Selected ({selectedAutoFixableErrors.length})
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Errors Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedErrors.size === filteredErrors.length && filteredErrors.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedErrors(new Set(filteredErrors.map(error => error.id)))
                          } else {
                            setSelectedErrors(new Set())
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Error Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Penalty Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredErrors.map((error) => (
                    <tr key={error.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedErrors.has(error.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedErrors)
                            if (e.target.checked) {
                              newSelected.add(error.id)
                            } else {
                              newSelected.delete(error.id)
                            }
                            setSelectedErrors(newSelected)
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {error.invoice_id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          €{error.invoice_data?.net_amount?.toLocaleString() || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {error.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {error.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <SeverityBadge severity={error.severity} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">
                          €{error.penalty_risk.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {Math.round(error.confidence_score * 100)}%
                          </div>
                          <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${error.confidence_score * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {error.auto_fixable && (
                          <button
                            onClick={() => handleAutoFix([error.id])}
                            disabled={autoFixing.has(error.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 disabled:opacity-50"
                          >
                            {autoFixing.has(error.id) ? 'Fixing...' : 'Auto-Fix'}
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredErrors.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No errors found with current filters
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {results.errors === 0 ? 'All invoices are compliant!' : 'Try adjusting your filters to see other errors.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Summary Card Component
interface SummaryCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple'
}

function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}

// Severity Badge Component
function SeverityBadge({ severity }: { severity: string }) {
  const severityClasses = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      severityClasses[severity as keyof typeof severityClasses] || severityClasses.low
    }`}>
      {severity.toUpperCase()}
    </span>
  )
}