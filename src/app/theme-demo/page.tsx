'use client'

import { ThemeToggle, ThemeToggleSimple, ThemeToggleCompact } from '@/components/theme/theme-toggle'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-dark-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                VATANA Theme Demo
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Experience light and dark mode with smooth transitions
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Theme Toggles Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Theme Toggle Variants
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Toggle */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Full Toggle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                3-button selector with Light, System, and Dark options
              </p>
              <ThemeToggle />
            </div>

            {/* Simple Toggle */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Simple Toggle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                2-state switch between Light and Dark
              </p>
              <ThemeToggleSimple />
            </div>

            {/* Compact Toggle */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Compact Toggle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Single cycling button through all modes
              </p>
              <ThemeToggleCompact />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Success Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-dark-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Success</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  All VAT returns submitted successfully
                </p>
              </div>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-dark-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Warning</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  3 invoices require manual review
                </p>
              </div>
            </div>
          </div>

          {/* Error Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-dark-md border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Error</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  2 submissions failed validation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Button Variants
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition">
              Primary
            </button>
            
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition">
              Secondary
            </button>
            
            <button className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition">
              Outline
            </button>
            
            <button className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition">
              Ghost
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Form Elements
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                VAT Number
              </label>
              <input
                type="text"
                placeholder="DE123456789"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition">
                <option>Germany</option>
                <option>United Kingdom</option>
                <option>France</option>
                <option>Spain</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the terms and conditions
              </label>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Information</h4>
                <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                  Your VAT returns are processed automatically every month.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Processing Speed</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">2.3s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400 text-sm py-8">
          <p>Try switching between light and dark modes using the toggles above!</p>
        </div>

      </div>
    </div>
  )
}
