'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, XCircle, Filter } from 'lucide-react'

interface VATError {
  id: string
  invoiceNumber: string
  errorType: string
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestedFix?: string
  penaltyAmount?: number
}

interface ErrorListProps {
  errors: VATError[]
  onFixError?: (errorId: string) => void
  onSelectError?: (error: VATError) => void
}

export function ErrorList({ errors, onFixError, onSelectError }: ErrorListProps) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set())

  const filteredErrors = filter === 'all' 
    ? errors 
    : errors.filter(e => e.severity === filter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="w-5 h-5" />
      case 'medium': return <AlertCircle className="w-5 h-5" />
      case 'low': return <CheckCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const toggleErrorSelection = (errorId: string) => {
    const newSelection = new Set(selectedErrors)
    if (newSelection.has(errorId)) {
      newSelection.delete(errorId)
    } else {
      newSelection.add(errorId)
    }
    setSelectedErrors(newSelection)
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by severity:</span>
        </div>
        <div className="flex space-x-2">
          {(['all', 'high', 'medium', 'low'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === severity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredErrors.length} of {errors.length} errors
        {selectedErrors.size > 0 && ` (${selectedErrors.size} selected)`}
      </div>

      {/* Error list */}
      <div className="space-y-3">
        {filteredErrors.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No errors found!</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filter !== 'all' ? 'Try changing the filter' : 'All invoices are compliant'}
            </p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <div
              key={error.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedErrors.has(error.id) 
                  ? 'border-blue-500 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => onSelectError?.(error)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedErrors.has(error.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleErrorSelection(error.id)
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />

                    {/* Error details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(error.severity)}`}>
                          {getSeverityIcon(error.severity)}
                          <span>{error.severity.toUpperCase()}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Invoice #{error.invoiceNumber}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {error.errorType}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {error.description}
                      </p>

                      {error.suggestedFix && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Suggested Fix:
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {error.suggestedFix}
                          </p>
                        </div>
                      )}

                      {error.penaltyAmount && (
                        <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                          Potential penalty: €{error.penaltyAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fix button */}
                  {onFixError && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFixError(error.id)
                      }}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                    >
                      Apply Fix
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk actions */}
      {selectedErrors.size > 0 && onFixError && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedErrors.size} error{selectedErrors.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => {
                selectedErrors.forEach(id => onFixError(id))
                setSelectedErrors(new Set())
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Fix All Selected
            </button>
            <button
              onClick={() => setSelectedErrors(new Set())}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ErrorList
