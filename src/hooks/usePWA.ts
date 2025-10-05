'use client'

import { useEffect, useState, useCallback } from 'react'
import { PWAUtils } from '@/lib/pwa/pwa-utils'
import { OfflineQueue } from '@/lib/pwa/offline-queue'

export interface PWAState {
  isOnline: boolean
  isPWA: boolean
  isInstallable: boolean
  hasUpdate: boolean
  notificationPermission: NotificationPermission
  queueSize: number
  cacheSize: { usage: number; quota: number }
  isSyncing: boolean
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: true,
    isPWA: false,
    isInstallable: false,
    hasUpdate: false,
    notificationPermission: 'default',
    queueSize: 0,
    cacheSize: { usage: 0, quota: 0 },
    isSyncing: false
  })

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setState(prev => ({ ...prev, isOnline: navigator.onLine }))
    }

    updateOnlineStatus()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Check if running as PWA
  useEffect(() => {
    const checkPWA = () => {
      setState(prev => ({ ...prev, isPWA: PWAUtils.isPWA() }))
    }

    checkPWA()
  }, [])

  // Setup install prompt
  useEffect(() => {
    PWAUtils.setupInstallPrompt((e) => {
      setState(prev => ({ ...prev, isInstallable: true }))
    })
  }, [])

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setState(prev => ({
        ...prev,
        notificationPermission: Notification.permission
      }))
    }
  }, [])

  // Update queue size
  const updateQueueSize = useCallback(async () => {
    const size = await OfflineQueue.getQueueSize()
    setState(prev => ({ ...prev, queueSize: size }))
  }, [])

  // Update cache size
  const updateCacheSize = useCallback(async () => {
    const size = await PWAUtils.getCacheSize()
    setState(prev => ({ ...prev, cacheSize: size }))
  }, [])

  // Initial updates and periodic refresh
  useEffect(() => {
    updateQueueSize()
    updateCacheSize()

    const interval = setInterval(() => {
      updateQueueSize()
      updateCacheSize()
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [updateQueueSize, updateCacheSize])

  // Show install prompt
  const showInstallPrompt = useCallback(async () => {
    if ((window as any).showInstallPrompt) {
      const accepted = await (window as any).showInstallPrompt()
      if (accepted) {
        setState(prev => ({ ...prev, isInstallable: false }))
      }
      return accepted
    }
    return false
  }, [])

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    const permission = await PWAUtils.requestNotificationPermission()
    setState(prev => ({ ...prev, notificationPermission: permission }))
    return permission
  }, [])

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async (vapidKey: string) => {
    const subscription = await PWAUtils.subscribeToPushNotifications(vapidKey)
    if (subscription) {
      await PWAUtils.sendSubscriptionToServer(subscription)
      return true
    }
    return false
  }, [])

  // Show notification
  const showNotification = useCallback(async (
    title: string,
    options?: NotificationOptions
  ) => {
    await PWAUtils.showNotification(title, options)
  }, [])

  // Add to offline queue
  const addToOfflineQueue = useCallback(async (
    operation: {
      type: 'upload' | 'submit' | 'update' | 'delete'
      endpoint: string
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      data?: any
      headers?: Record<string, string>
    }
  ) => {
    const id = await OfflineQueue.addToQueue(operation)
    await updateQueueSize()
    return id
  }, [updateQueueSize])

  // Process offline queue
  const processOfflineQueue = useCallback(async () => {
    setState(prev => ({ ...prev, isSyncing: true }))
    
    try {
      const result = await OfflineQueue.processQueue()
      await updateQueueSize()
      return result
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }))
    }
  }, [updateQueueSize])

  // Get queue stats
  const getQueueStats = useCallback(async () => {
    return await OfflineQueue.getQueueStats()
  }, [])

  // Clear cache
  const clearCache = useCallback(async (cacheName: string) => {
    const cleared = await PWAUtils.clearCache(cacheName)
    if (cleared) {
      await updateCacheSize()
    }
    return cleared
  }, [updateCacheSize])

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    const hasUpdate = await PWAUtils.checkForUpdates()
    setState(prev => ({ ...prev, hasUpdate }))
    return hasUpdate
  }, [])

  // Cache data
  const cacheData = useCallback(async (cacheName: string, url: string, data: any) => {
    await PWAUtils.cacheData(cacheName, url, data)
    await updateCacheSize()
  }, [updateCacheSize])

  // Get cached data
  const getCachedData = useCallback(async <T,>(cacheName: string, url: string): Promise<T | null> => {
    return await PWAUtils.getCachedData<T>(cacheName, url)
  }, [])

  // Sync when online
  const syncWhenOnline = useCallback(async (callback: () => Promise<void>) => {
    await PWAUtils.syncWhenOnline(callback)
  }, [])

  return {
    // State
    ...state,
    
    // Methods
    showInstallPrompt,
    requestNotificationPermission,
    subscribeToPushNotifications,
    showNotification,
    addToOfflineQueue,
    processOfflineQueue,
    getQueueStats,
    clearCache,
    checkForUpdates,
    cacheData,
    getCachedData,
    syncWhenOnline
  }
}

export default usePWA
