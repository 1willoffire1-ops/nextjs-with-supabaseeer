'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileDropzoneProps {
  onUpload: (file: File, period?: string) => Promise<void>
  isUploading?: boolean
}

export function FileDropzone({ onUpload, isUploading }: FileDropzoneProps) {
  const [period, setPeriod] = useState(() => {
    // Default to current month
    return new Date().toISOString().slice(0, 7)
  })

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    try {
      await onUpload(file, period)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }, [onUpload, period])

  const { getRootProps, getInputProps, isDragActive, rejectedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Period Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reporting Period
        </label>
        <input
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isUploading}
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-4">
            {isUploading ? '⏳' : isDragActive ? '📁' : '📄'}
          </div>
          
          <div className="text-lg font-medium text-gray-900 mb-2">
            {isUploading 
              ? 'Processing your file...' 
              : isDragActive 
                ? 'Drop your VAT file here!' 
                : 'Upload your VAT file'
            }
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            {isUploading 
              ? 'Please wait while we process your data' 
              : 'Drag & drop or click to select CSV, Excel files'
            }
          </div>
          
          {!isUploading && (
            <div className="text-xs text-gray-500">
              Maximum file size: 10MB • Supported formats: CSV, XLS, XLSX
            </div>
          )}
        </div>
      </div>

      {/* Rejection Errors */}
      {rejectedFiles.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-700">
            <strong>Upload failed:</strong>
            <ul className="mt-1 list-disc list-inside">
              {rejectedFiles.map((file, index) => (
                <li key={index}>
                  {file.file.name} - {file.errors.map(e => e.message).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}