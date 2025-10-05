'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Saving {
  id: string
  date: string
  errorType: string
  invoiceId: string
  amount: number
}

export default function SavingsPage() {
  const [savings] = useState<Saving[]>([
    {
      id: 's-001',
      date: '2024-01-15',
      errorType: 'Missing VAT Number',
      invoiceId: 'INV-2024-001',
      amount: 250.00
    },
    {
      id: 's-002',
      date: '2024-01-16',
      errorType: 'Incorrect VAT Rate',
      invoiceId: 'INV-2024-002',
      amount: 150.00
    },
    {
      id: 's-003',
      date: '2024-01-17',
      errorType: 'Invalid Date Format',
      invoiceId: 'INV-2024-003',
      amount: 50.00
    },
    {
      id: 's-004',
      date: '2024-01-18',
      errorType: 'Missing Invoice Number',
      invoiceId: 'INV-2024-004',
      amount: 100.00
    }
  ])

  const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Penalty Savings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track the penalties you've avoided through early detection
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Total Savings Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg opacity-90 mb-2">Total Savings</div>
              <div className="text-5xl font-bold" data-testid="total-savings">
                €{totalSavings.toFixed(2)}
              </div>
              <div className="text-sm opacity-80 mt-2">
                {savings.length} penalties avoided
              </div>
            </div>
            <div className="text-8xl opacity-20">💰</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {savings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Issues Fixed
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              €{(totalSavings / savings.length).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Average Saving
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Compliance Rate
            </div>
          </div>
        </div>

        {/* Savings History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Savings History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Error Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Penalty Avoided
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {savings.map((saving) => (
                  <tr key={saving.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(saving.date).toLocaleDateString('en-IE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {saving.errorType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {saving.invoiceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600 dark:text-green-400">
                      €{saving.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Total Savings
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold text-green-600 dark:text-green-400">
                    €{totalSavings.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
