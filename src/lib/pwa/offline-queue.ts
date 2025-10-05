'use client'

/**
 * Offline Queue Service
 * Stores operations while offline and syncs when online
 */

export interface QueuedOperation {
  id: string
  type: 'upload' | 'submit' | 'update' | 'delete'
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  headers?: Record<string, string>
  timestamp: number
  retries: number
  maxRetries: number
}

export class OfflineQueue {
  private static readonly QUEUE_KEY = 'vatana_offline_queue'
  private static readonly MAX_RETRIES = 3
  private static syncInProgress = false

  /**
   * Add operation to queue
   */
  static async addToQueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries' | 'maxRetries'>): Promise<string> {
    const id = crypto.randomUUID()
    const queuedOperation: QueuedOperation = {
      ...operation,
      id,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: this.MAX_RETRIES
    }

    const queue = await this.getQueue()
    queue.push(queuedOperation)
    await this.saveQueue(queue)

    console.log(`➕ Added operation to offline queue: ${operation.type}`)
    return id
  }

  /**
   * Get all queued operations
   */
  static async getQueue(): Promise<QueuedOperation[]> {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.QUEUE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get offline queue:', error)
      return []
    }
  }

  /**
   * Save queue to storage
   */
  private static async saveQueue(queue: QueuedOperation[]): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error('Failed to save offline queue:', error)
    }
  }

  /**
   * Remove operation from queue
   */
  static async removeFromQueue(id: string): Promise<void> {
    const queue = await this.getQueue()
    const filtered = queue.filter(op => op.id !== id)
    await this.saveQueue(filtered)
    console.log(`➖ Removed operation from queue: ${id}`)
  }

  /**
   * Clear entire queue
   */
  static async clearQueue(): Promise<void> {
    await this.saveQueue([])
    console.log('🗑️ Cleared offline queue')
  }

  /**
   * Process queued operations
   */
  static async processQueue(): Promise<{
    success: number
    failed: number
    remaining: number
  }> {
    if (this.syncInProgress) {
      console.log('⚠️ Sync already in progress')
      return { success: 0, failed: 0, remaining: 0 }
    }

    if (!navigator.onLine) {
      console.log('📴 Cannot process queue while offline')
      return { success: 0, failed: 0, remaining: 0 }
    }

    this.syncInProgress = true
    const queue = await this.getQueue()
    
    if (queue.length === 0) {
      this.syncInProgress = false
      return { success: 0, failed: 0, remaining: 0 }
    }

    console.log(`🔄 Processing ${queue.length} queued operations`)
    
    let success = 0
    let failed = 0
    const remainingOps: QueuedOperation[] = []

    for (const operation of queue) {
      try {
        const result = await this.executeOperation(operation)
        
        if (result.success) {
          success++
          console.log(`✅ Successfully processed: ${operation.type} - ${operation.endpoint}`)
        } else {
          operation.retries++
          
          if (operation.retries < operation.maxRetries) {
            remainingOps.push(operation)
            console.log(`⚠️ Operation failed, will retry: ${operation.type} (${operation.retries}/${operation.maxRetries})`)
          } else {
            failed++
            console.error(`❌ Operation failed permanently: ${operation.type}`)
          }
        }
      } catch (error) {
        operation.retries++
        
        if (operation.retries < operation.maxRetries) {
          remainingOps.push(operation)
        } else {
          failed++
          console.error(`❌ Operation error: ${operation.type}`, error)
        }
      }
    }

    await this.saveQueue(remainingOps)
    this.syncInProgress = false

    console.log(`📊 Queue processing complete: ${success} success, ${failed} failed, ${remainingOps.length} remaining`)

    return {
      success,
      failed,
      remaining: remainingOps.length
    }
  }

  /**
   * Execute a single operation
   */
  private static async executeOperation(operation: QueuedOperation): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(operation.endpoint, {
        method: operation.method,
        headers: {
          'Content-Type': 'application/json',
          ...operation.headers
        },
        body: operation.data ? JSON.stringify(operation.data) : undefined
      })

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get queue size
   */
  static async getQueueSize(): Promise<number> {
    const queue = await this.getQueue()
    return queue.length
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats(): Promise<{
    total: number
    byType: Record<string, number>
    oldestTimestamp: number | null
    newestTimestamp: number | null
  }> {
    const queue = await this.getQueue()
    const byType: Record<string, number> = {}

    let oldestTimestamp: number | null = null
    let newestTimestamp: number | null = null

    queue.forEach(op => {
      byType[op.type] = (byType[op.type] || 0) + 1
      
      if (oldestTimestamp === null || op.timestamp < oldestTimestamp) {
        oldestTimestamp = op.timestamp
      }
      if (newestTimestamp === null || op.timestamp > newestTimestamp) {
        newestTimestamp = op.timestamp
      }
    })

    return {
      total: queue.length,
      byType,
      oldestTimestamp,
      newestTimestamp
    }
  }

  /**
   * Setup auto-sync when online
   */
  static setupAutoSync(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('online', async () => {
      console.log('📶 Back online, processing queued operations...')
      await this.processQueue()
    })

    // Also try to sync on page load if online
    if (navigator.onLine) {
      setTimeout(async () => {
        await this.processQueue()
      }, 2000)
    }
  }

  /**
   * Clean up old operations (older than 7 days)
   */
  static async cleanupOldOperations(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const queue = await this.getQueue()
    const now = Date.now()
    const filtered = queue.filter(op => now - op.timestamp < maxAge)
    const removed = queue.length - filtered.length
    
    if (removed > 0) {
      await this.saveQueue(filtered)
      console.log(`🧹 Cleaned up ${removed} old operations`)
    }
    
    return removed
  }
}

// Auto-setup on load
if (typeof window !== 'undefined') {
  OfflineQueue.setupAutoSync()
}

export default OfflineQueue
