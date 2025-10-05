'use client'

import { usePWA } from '@/hooks/usePWA'
import { useEffect, useState } from 'react'
import { WifiOff, Wifi, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export function OfflineIndicator() {
  const { 
    isOnline, 
    queueSize, 
    isSyncing, 
    processOfflineQueue 
  } = usePWA()
  
  const [showBanner, setShowBanner] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: number
    failed: number
  } | null>(null)

  useEffect(() => {
    if (!isOnline || queueSize > 0) {
      setShowBanner(true)
    } else if (isOnline && queueSize === 0) {
      // Keep banner visible for 3 seconds after going online
      const timer = setTimeout(() => setShowBanner(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, queueSize])

  const handleSync = async () => {
    const result = await processOfflineQueue()
    setLastSyncResult({
      success: result.success,
      failed: result.failed
    })
    
    // Clear result after 5 seconds
    setTimeout(() => setLastSyncResult(null), 5000)
  }

  if (!showBanner) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5" />
              <div>
                <p className="font-semibold">You're offline</p>
                <p className="text-sm">
                  Changes will be saved and synced when you're back online
                  {queueSize > 0 && ` (${queueSize} pending)`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOnline && queueSize > 0 && (
        <div className="bg-blue-500 text-white px-4 py-3 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5" />
              <div>
                <p className="font-semibold">Back online</p>
                <p className="text-sm">
                  You have {queueSize} pending {queueSize === 1 ? 'change' : 'changes'} to sync
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      )}

      {isOnline && queueSize === 0 && lastSyncResult && (
        <div className={`${
          lastSyncResult.failed > 0 ? 'bg-orange-500' : 'bg-green-500'
        } text-white px-4 py-3 shadow-lg`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {lastSyncResult.failed > 0 ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <div>
                <p className="font-semibold">
                  {lastSyncResult.failed > 0 ? 'Sync partially completed' : 'All changes synced'}
                </p>
                <p className="text-sm">
                  {lastSyncResult.success > 0 && `${lastSyncResult.success} synced successfully`}
                  {lastSyncResult.failed > 0 && ` • ${lastSyncResult.failed} failed`}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setLastSyncResult(null)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfflineIndicator
