'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertTriangle, Undo2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface FixPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  errorId: string
  onFixComplete: () => void
}

export function FixPreviewModal({ 
  isOpen, 
  onClose, 
  errorId,
  onFixComplete 
}: FixPreviewModalProps) {
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fixing, setFixing] = useState(false)

  const loadPreview = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fix/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorId })
      })

      if (!response.ok) throw new Error('Failed to load preview')

      const data = await response.json()
      setPreview(data)
    } catch (error) {
      toast.error('Failed to load fix preview')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [errorId])

  // Load preview when modal opens
  useEffect(() => {
    if (isOpen && errorId) {
      loadPreview()
    }
  }, [isOpen, errorId, loadPreview])

  async function executeFix() {
    setFixing(true)
    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorId })
      })

      if (!response.ok) throw new Error('Failed to execute fix')

      const result = await response.json()
      
      toast.success(
        `Fixed! Avoided €${result.penaltyAvoided.toFixed(2)} penalty`,
        { duration: 5000 }
      )

      onFixComplete()
      onClose()
    } catch (error) {
      toast.error('Failed to apply fix')
      console.error(error)
    } finally {
      setFixing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Fix Preview</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                </div>
              ) : preview ? (
                <div className="space-y-6">
                  {/* Requires Approval Warning */}
                  {preview.requiresApproval && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Requires Approval</p>
                        <p className="text-sm text-orange-700 mt-1">
                          This fix involves significant changes and requires your confirmation.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fix Strategy */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fix Strategy</h3>
                    <p className="text-gray-600">
                      {preview.strategy.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                  </div>

                  {/* Changes */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Proposed Changes</h3>
                    <div className="space-y-2">
                      {preview.changes.map((change: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="border rounded-lg p-4 bg-red-50">
                      <h4 className="font-semibold text-red-900 mb-3">Before</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(preview.before).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-600">{key}: </span>
                            <span className="font-medium text-red-900">
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* After */}
                    <div className="border rounded-lg p-4 bg-green-50">
                      <h4 className="font-semibold text-green-900 mb-3">After</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(preview.after).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-600">{key}: </span>
                            <span className="font-medium text-green-900">
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Financial Impact */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Penalty Avoided:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        €{preview.penaltyAvoided.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={executeFix}
                disabled={fixing || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {fixing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Applying Fix...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Apply Fix
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}