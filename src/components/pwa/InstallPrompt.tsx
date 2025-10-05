'use client'

import { usePWA } from '@/hooks/usePWA'
import { useState } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

export function InstallPrompt() {
  const { isInstallable, isPWA, showInstallPrompt } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if already installed, not installable, or dismissed
  if (!isInstallable || isPWA || dismissed) return null

  const handleInstall = async () => {
    const accepted = await showInstallPrompt()
    if (accepted) {
      setDismissed(true)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Remember dismissal for 7 days
    localStorage.setItem('vatana_install_prompt_dismissed', Date.now().toString())
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Install VATANA
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get quick access and work offline with our app
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Smartphone className="w-4 h-4 text-gray-400" />
            <span>Works like a native app</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span>Access from your home screen</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Download className="w-4 h-4 text-gray-400" />
            <span>Works offline</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt
