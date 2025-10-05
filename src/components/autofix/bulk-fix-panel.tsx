'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface BulkFixError {
  id: string
  errorType: string
  invoiceId: string
  penaltyRisk: number
  canAutoFix: boolean
  customerName: string
}

export function BulkFixPanel() {
  const [errors, setErrors] = useState<BulkFixError[]>([])
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set())
  const [fixing, setFixing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadErrors()
  }, [])

  async function loadErrors() {
    try {
      const response = await fetch('/api/errors?auto_fixable=true')
      if (response.ok) {
        const data = await response.json()
        setErrors(data)
      }
    } catch (error) {
      toast.error('Failed to load errors')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function toggleError(errorId: string) {
    const newSelected = new Set(selectedErrors)
    if (newSelected.has(errorId)) {
      newSelected.delete(errorId)
    } else {
      newSelected.add(errorId)
    }
    setSelectedErrors(newSelected)
  }

  function toggleAll() {
    if (selectedErrors.size === errors.length) {
      setSelectedErrors(new Set())
    } else {
      setSelectedErrors(new Set(errors.map(e => e.id)))
    }
  }

  async function executeBulkFix() {
    if (selectedErrors.size === 0) {
      toast.error('Please select at least one error to fix')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to fix ${selectedErrors.size} error(s)? This action cannot be undone.`
    )

    if (!confirmed) return

    setFixing(true)
    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulk: true,
          errorIds: Array.from(selectedErrors)
        })
      })

      if (!response.ok) throw new Error('Bulk fix failed')

      const result = await response.json()

      toast.success(
        `Fixed ${result.successful} error(s)! Saved €${result.totalSavings.toFixed(2)}`,
        { duration: 5000 }
      )

      // Reload errors
      await loadErrors()
      setSelectedErrors(new Set())
    } catch (error) {
      toast.error('Failed to execute bulk fix')
      console.error(error)
    } finally {
      setFixing(false)
    }
  }

  const totalPenaltyRisk = Array.from(selectedErrors).reduce((sum, errorId) => {
    const error = errors.find(e => e.id === errorId)
    return sum + (error?.penaltyRisk || 0)
  }, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (errors.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Auto-Fixable Errors!
        </h3>
        <p className="text-gray-600">
          All your errors require manual review or have been fixed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Fix Errors</h2>
          <p className="text-gray-600 mt-1">
            Select errors to fix automatically in one click
          </p>
        </div>
        
        {selectedErrors.size > 0 && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={executeBulkFix}
            disabled={fixing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
          >
            {fixing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Fixing {selectedErrors.size} error(s)...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Fix {selectedErrors.size} Selected
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Summary Bar */}
      <AnimatePresence>
        {selectedErrors.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blue-900 font-medium">
                  {selectedErrors.size} error(s) selected
                </span>
                <span className="text-blue-600 text-sm ml-2">
                  • Total savings: €{totalPenaltyRisk.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setSelectedErrors(new Set())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select All */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <button
          onClick={toggleAll}
          className="flex items-center gap-3 w-full text-left hover:bg-gray-100 p-2 rounded transition"
        >
          {selectedErrors.size === errors.length ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
          <span className="font-medium text-gray-900">
            Select All ({errors.length} errors)
          </span>
        </button>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {errors.map((error) => (
          <motion.div
            key={error.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              border rounded-lg p-4 cursor-pointer transition
              ${
                selectedErrors.has(error.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
            onClick={() => toggleError(error.id)}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="pt-1">
                {selectedErrors.has(error.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Error Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {error.errorType.replace('ERROR_', '').replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Invoice: {error.invoiceId} • Customer: {error.customerName}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      €{error.penaltyRisk.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">penalty risk</div>
                  </div>
                </div>

                {/* Can Auto Fix Badge */}
                {error.canAutoFix && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    <Zap className="w-3 h-3" />
                    Auto-fixable
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}