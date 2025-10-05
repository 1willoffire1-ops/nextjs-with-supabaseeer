'use client'

import { useState } from 'react'
import { Download, FileText, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReportDownloadButtonProps {
  period?: string
  variant?: 'primary' | 'secondary'
}

export function ReportDownloadButton({ 
  period, 
  variant = 'primary' 
}: ReportDownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  async function downloadReport() {
    setLoading(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      })

      if (!response.ok) throw new Error('Failed to generate report')

      // Download PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vatana-report-${period || 'current'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Report downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download report')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const isPrimary = variant === 'primary'

  return (
    <button
      onClick={downloadReport}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition
        ${isPrimary 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-white text-gray-700 border hover:bg-gray-50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF Report
        </>
      )}
    </button>
  )
}
