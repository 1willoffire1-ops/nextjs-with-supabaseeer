'use client'
import { useState, useCallback } from 'react'

interface UploadState {
  isUploading: boolean
  progress: number
  status: string
  uploadId: string | null
  error: string | null
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    status: 'idle',
    uploadId: null,
    error: null
  })

  const uploadFile = useCallback(async (file: File, period?: string) => {
    setUploadState({
      isUploading: true,
      progress: 0,
      status: 'uploading',
      uploadId: null,
      error: null
    })

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (period) formData.append('period', period)

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      setUploadState(prev => ({
        ...prev,
        uploadId: result.upload_id,
        status: 'processing'
      }))

      // Poll for progress
      return pollUploadProgress(result.upload_id)

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Upload failed'
      }))
      throw error
    }
  }, [])

  // Handle upload completion and trigger error detection
  const handleUploadComplete = useCallback(async (uploadId: string) => {
    try {
      // Trigger error detection
      const response = await fetch('/api/errors/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          upload_id: uploadId, 
          use_ai: true // Enable AI for Professional plans
        })
      })
      
      const result = await response.json()
      console.log('🧠 Error detection completed:', result)
    } catch (error) {
      console.error('Error detection failed:', error)
      // Don't fail the upload if error detection fails
    }
  }, [])

  const pollUploadProgress = useCallback(async (uploadId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/uploads/${uploadId}/status`)
        const data = await response.json()

        setUploadState(prev => ({
          ...prev,
          progress: data.progress || 0,
          status: data.status
        }))

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(pollInterval)
          setUploadState(prev => ({
            ...prev,
            isUploading: false
          }))
          
          // Trigger error detection after successful upload
          if (data.status === 'completed') {
            handleUploadComplete(uploadId)
          }
        }
      } catch (error) {
        console.error('Progress polling error:', error)
        clearInterval(pollInterval)
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          status: 'failed',
          error: 'Failed to track progress'
        }))
      }
    }, 2000) // Poll every 2 seconds

    // Clean up interval after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000)
  }, [])

  return {
    uploadFile,
    ...uploadState
  }
}