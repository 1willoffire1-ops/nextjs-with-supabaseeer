'use client'

/**
 * PWA Utilities for VATANA
 * Handles service worker registration, push notifications, and offline detection
 */

export class PWAUtils {
  private static swRegistration: ServiceWorkerRegistration | null = null

  /**
   * Register service worker
   */
  static async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        this.swRegistration = registration
        console.log('✅ Service Worker registered successfully')

        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification()
              }
            })
          }
        })
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
      }
    }
  }

  /**
   * Check if app is running as PWA
   */
  static isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://')
  }

  /**
   * Check if offline
   */
  static isOffline(): boolean {
    return !navigator.onLine
  }

  /**
   * Setup offline event listeners
   */
  static setupOfflineListeners(
    onOffline?: () => void,
    onOnline?: () => void
  ): void {
    window.addEventListener('offline', () => {
      console.warn('📴 App is offline')
      onOffline?.()
    })

    window.addEventListener('online', () => {
      console.log('📶 App is back online')
      onOnline?.()
    })
  }

  /**
   * Request push notification permission
   */
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }

    return Notification.permission
  }

  /**
   * Subscribe to push notifications
   */
  static async subscribeToPushNotifications(
    vapidPublicKey: string
  ): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered')
      return null
    }

    try {
      const permission = await this.requestNotificationPermission()
      
      if (permission !== 'granted') {
        console.warn('Push notification permission denied')
        return null
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      })

      console.log('✅ Push notification subscription successful')
      return subscription
    } catch (error) {
      console.error('❌ Failed to subscribe to push notifications:', error)
      return null
    }
  }

  /**
   * Send push notification subscription to server
   */
  static async sendSubscriptionToServer(
    subscription: PushSubscription
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
      return false
    }
  }

  /**
   * Show local notification
   */
  static async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered')
      return
    }

    const permission = await this.requestNotificationPermission()
    
    if (permission === 'granted') {
      await this.swRegistration.showNotification(title, {
        badge: '/icons/icon-96x96.png',
        icon: '/icons/icon-192x192.png',
        ...options
      })
    }
  }

  /**
   * Cache data for offline use
   */
  static async cacheData(cacheName: string, url: string, data: any): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(cacheName)
      const response = new Response(JSON.stringify(data))
      await cache.put(url, response)
    }
  }

  /**
   * Get cached data
   */
  static async getCachedData<T>(cacheName: string, url: string): Promise<T | null> {
    if ('caches' in window) {
      const cache = await caches.open(cacheName)
      const response = await cache.match(url)
      
      if (response) {
        return await response.json()
      }
    }
    return null
  }

  /**
   * Clear specific cache
   */
  static async clearCache(cacheName: string): Promise<boolean> {
    if ('caches' in window) {
      return await caches.delete(cacheName)
    }
    return false
  }

  /**
   * Get cache storage usage
   */
  static async getCacheSize(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      }
    }
    return { usage: 0, quota: 0 }
  }

  /**
   * Install prompt handling
   */
  static setupInstallPrompt(onInstallPrompt?: (event: any) => void): void {
    let deferredPrompt: any = null

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      onInstallPrompt?.(e)
    })

    // Make prompt available globally
    ;(window as any).showInstallPrompt = async () => {
      if (!deferredPrompt) {
        console.log('Install prompt not available')
        return false
      }

      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`User ${outcome} the install prompt`)
      deferredPrompt = null
      
      return outcome === 'accepted'
    }
  }

  /**
   * Show update notification
   */
  private static showUpdateNotification(): void {
    this.showNotification('Update Available', {
      body: 'A new version of VATANA is available. Refresh to update.',
      tag: 'app-update',
      requireInteraction: true,
      actions: [
        { action: 'refresh', title: 'Refresh Now' },
        { action: 'dismiss', title: 'Later' }
      ]
    })
  }

  /**
   * Convert VAPID key
   */
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  /**
   * Sync data when online
   */
  static async syncWhenOnline(callback: () => Promise<void>): Promise<void> {
    if (navigator.onLine) {
      await callback()
    } else {
      // Wait for online event
      window.addEventListener('online', async () => {
        await callback()
      }, { once: true })
    }
  }

  /**
   * Check for app updates
   */
  static async checkForUpdates(): Promise<boolean> {
    if (this.swRegistration) {
      await this.swRegistration.update()
      return true
    }
    return false
  }
}

// Auto-initialize PWA utilities
if (typeof window !== 'undefined') {
  PWAUtils.registerServiceWorker()
  PWAUtils.setupInstallPrompt()
}

export default PWAUtils
