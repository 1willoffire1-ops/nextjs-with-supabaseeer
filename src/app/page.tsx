'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ThemeToggleCompact } from '@/components/theme/theme-toggle'

// Types for our VAT analysis
interface VATIssue {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  penalty_risk: number
  suggested_fix?: string
  auto_fixable: boolean
  invoice_id: string
  confidence_score: number
}

interface ProcessingResult {
  totalRows: number
  validInvoices: number
  errors: number
  issues: VATIssue[]
  totalPenaltyRisk: number
  processingTime: number
}

interface AnalysisStats {
  totalInvoices: number
  issuesFound: number
  criticalIssues: number
  potentialSavings: number
  complianceScore: number
}

export default function VATAnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats | null>(null)

  // File upload handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xlsx', '.xls']
    },
    maxFiles: 1
  })

  // Process the uploaded file
  const processFile = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    try {
      console.log('🚀 Starting VAT analysis for:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      
      // Show initial progress
      setProgress(10)
      
      // Call the real API
      const response = await fetch('/api/analyze-vat', {
        method: 'POST',
        body: formData
      })
      
      setProgress(30)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: Analysis failed`)
      }
      
      setProgress(70)
      
      const analysisResults: ProcessingResult = await response.json()
      
      setProgress(90)
      
      console.log('✅ VAT analysis completed:', analysisResults)
      
      setProgress(100)
      setResults(analysisResults)
      
      // Calculate analysis stats
      const stats: AnalysisStats = {
        totalInvoices: analysisResults.totalRows,
        issuesFound: analysisResults.issues.length,
        criticalIssues: analysisResults.issues.filter(i => i.severity === 'critical').length,
        potentialSavings: analysisResults.totalPenaltyRisk,
        complianceScore: Math.max(0, 100 - (analysisResults.issues.length / analysisResults.totalRows * 100))
      }
      setAnalysisStats(stats)
      
    } catch (err) {
      console.error('❌ VAT analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '⚡'
      case 'low': return 'ℹ️'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">VATANA</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">AI-Powered VAT Issue Detection & Compliance Analysis</p>
          </div>
          <ThemeToggleCompact />
        </div>

        {/* File Upload Section */}
        {!results && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 p-8 mb-8 transition-colors">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Upload Your Invoice Data</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">📊</div>
              {isDragActive ? (
                <p className="text-lg text-blue-600 dark:text-blue-400">Drop your invoice file here...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    Drag & drop your invoice file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports CSV and Excel files • Maximum file size: 50MB
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    <a 
                      href="/sample-invoices.csv" 
                      download
                      className="hover:text-blue-800 underline"
                    >
                      📥 Download sample file to test
                    </a>
                  </p>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{file.name}</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={processFile}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Analyze VAT Issues'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Processing Your Data</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {progress < 30 ? 'Uploading and parsing file...' :
                   progress < 60 ? 'Validating invoice data...' :
                   progress < 90 ? 'Detecting VAT compliance issues...' :
                   'Finalizing analysis...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {results && analysisStats && (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analysisStats.totalInvoices.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Invoices</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {analysisStats.issuesFound}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Issues Detected</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {analysisStats.criticalIssues}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Critical Issues</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  €{analysisStats.potentialSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Penalty Risk</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className={`text-3xl font-bold ${
                  analysisStats.complianceScore >= 90 ? 'text-green-600 dark:text-green-400' :
                  analysisStats.complianceScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {analysisStats.complianceScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compliance Score</div>
              </div>
            </div>

            {/* Issues List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Detected VAT Issues</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Found {results.issues.length} compliance issues requiring attention
                </p>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.issues.map((issue) => (
                  <div key={issue.id} className="p-6 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getSeverityIcon(issue.severity)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            getSeverityColor(issue.severity)
                          }`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Invoice: {issue.invoice_id}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Confidence: {(issue.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {issue.message}
                        </h3>
                        
                        {issue.suggested_fix && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>Suggested Fix:</strong> {issue.suggested_fix}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          €{issue.penalty_risk.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Penalty Risk</div>
                        
                        {issue.auto_fixable && (
                          <button className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200 transition-colors">
                            Auto-Fix Available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setResults(null)
                  setAnalysisStats(null)
                  setFile(null)
                }}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Analyze New File
              </button>
              
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
              
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Auto-Fix Issues
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Processing Error</h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
