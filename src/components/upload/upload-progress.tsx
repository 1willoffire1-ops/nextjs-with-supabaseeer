'use client'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface UploadProgressProps {
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  filename: string
  stats?: {
    totalRows?: number
    validInvoices?: number
    errors?: number
  }
}

export function UploadProgress({ progress, status, filename, stats }: UploadProgressProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981' // green
      case 'failed': return '#EF4444' // red
      case 'processing': return '#3B82F6' // blue
      default: return '#6B7280' // gray
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'failed': return '❌'
      case 'processing': return '⚡'
      default: return '⏳'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed': return 'Processing complete!'
      case 'failed': return 'Processing failed'
      case 'processing': return 'Processing your file...'
      default: return 'Waiting to start...'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-start space-x-4">
        {/* Progress Circle */}
        <div className="flex-shrink-0 w-16 h-16">
          <CircularProgressbar
            value={progress}
            text={status === 'completed' ? getStatusIcon(status) : `${progress}%`}
            styles={buildStyles({
              pathColor: getStatusColor(status),
              textColor: getStatusColor(status),
              trailColor: '#E5E7EB',
              textSize: status === 'completed' ? '24px' : '16px'
            })}
          />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {filename}
            </h4>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${status === 'completed' ? 'bg-green-100 text-green-800' : 
                status === 'failed' ? 'bg-red-100 text-red-800' :
                status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}
            `}>
              {status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {getStatusMessage(status)}
          </p>

          {/* Processing Stats */}
          {stats && status === 'completed' && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Total Rows</div>
                <div className="font-medium">{stats.totalRows?.toLocaleString() || 0}</div>
              </div>
              <div>
                <div className="text-gray-500">Valid Invoices</div>
                <div className="font-medium text-green-600">{stats.validInvoices?.toLocaleString() || 0}</div>
              </div>
              <div>
                <div className="text-gray-500">Issues Found</div>
                <div className="font-medium text-red-600">{stats.errors?.toLocaleString() || 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}