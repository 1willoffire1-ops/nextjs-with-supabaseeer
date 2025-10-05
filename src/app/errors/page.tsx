'use client'

import { useState } from 'react'
import Link from 'next/link'

interface VATError {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  invoiceId: string
  penaltyRisk: number
  suggestedFix?: string
}

export default function ErrorsPage() {
  const [errors, setErrors] = useState<VATError[]>([
    {
      id: 'err-001',
      type: 'Missing VAT Number',
      severity: 'critical',
      message: 'Invoice is missing a valid VAT number',
      invoiceId: 'INV-2024-001',
      penaltyRisk: 250.00,
      suggestedFix: 'Add VAT number: IE1234567X'
    },
    {
      id: 'err-002',
      type: 'Incorrect VAT Rate',
      severity: 'high',
      message: 'VAT rate of 21% should be 23% for this category',
      invoiceId: 'INV-2024-002',
      penaltyRisk: 150.00,
      suggestedFix: 'Change VAT rate from 21% to 23%'
    },
    {
      id: 'err-003',
      type: 'Invalid Date Format',
      severity: 'medium',
      message: 'Invoice date format is invalid',
      invoiceId: 'INV-2024-003',
      penaltyRisk: 50.00,
      suggestedFix: 'Change date format to DD/MM/YYYY'
    }
  ])

  const [showPreview, setShowPreview] = useState<string | null>(null)

  const handleFixClick = (errorId: string) => {
    setShowPreview(errorId)
  }

  const handleApplyFix = (errorId: string) => {
    // Remove the fixed error from the list
    setErrors(errors.filter(e => e.id !== errorId))
    setShowPreview(null)
    // Show success message
    alert('Fixed successfully')
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">VAT Errors</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review and fix detected compliance issues
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error Count */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400" data-testid="error-count">
                {errors.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                Errors Requiring Attention
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                €{errors.reduce((sum, err) => sum + err.penaltyRisk, 0).toFixed(2)}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                Total Penalty Risk
              </div>
            </div>
          </div>
        </div>

        {/* Errors List */}
        <div className="space-y-4">
          {errors.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Errors Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All your invoices are compliant!
              </p>
            </div>
          ) : (
            errors.map((error) => (
              <div
                key={error.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                        {error.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Invoice: {error.invoiceId}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {error.type}
                    </h3>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {error.message}
                    </p>

                    {error.suggestedFix && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Suggested Fix:</strong> {error.suggestedFix}
                        </p>
                      </div>
                    )}

                    {showPreview === error.id && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-3">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                          Preview Fix
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {error.suggestedFix}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleApplyFix(error.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Apply Fix
                          </button>
                          <button
                            onClick={() => setShowPreview(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 text-right">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      €{error.penaltyRisk.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Penalty Risk
                    </div>
                    
                    <button
                      onClick={() => handleFixClick(error.id)}
                      data-testid="fix-button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Fix Error
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
