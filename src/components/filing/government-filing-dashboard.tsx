'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface FilingCredential {
  id: string
  country: string
  apiType: 'ELSTER' | 'MOSS' | 'HMRC'
  status: 'active' | 'expired' | 'inactive'
  lastUsed: string
  expiresAt: string
}

interface FilingSubmission {
  id: string
  country: string
  period: string
  status: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'error'
  submittedAt: string
  amount: number
  errors?: string[]
}

export default function GovernmentFilingDashboard() {
  const [activeTab, setActiveTab] = useState<'credentials' | 'submissions' | 'submit'>('credentials')
  const [credentials, setCredentials] = useState<FilingCredential[]>([])
  const [submissions, setSubmissions] = useState<FilingSubmission[]>([])
  const [expandedCredential, setExpandedCredential] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [credRes, subRes] = await Promise.all([
        fetch('/api/filing/credentials'),
        fetch('/api/filing/submissions')
      ])
      
      if (credRes.ok) {
        setCredentials(await credRes.json())
      }
      if (subRes.ok) {
        setSubmissions(await subRes.json())
      }
    } catch (error) {
      console.error('Failed to fetch filing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitVAT = async (country: string, period: string) => {
    try {
      const response = await fetch('/api/filing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, period })
      })
      
      if (response.ok) {
        const result = await response.json()
        // Refresh submissions
        fetchData()
        alert(`VAT return submitted successfully! Submission ID: ${result.submissionId}`)
      } else {
        const error = await response.json()
        alert(`Submission failed: ${error.message}`)
      }
    } catch (error) {
      alert('Submission error. Please try again.')
    }
  }

  if (loading) {
    return <FilingLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Government Filing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage VAT submissions to tax authorities
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'credentials', label: 'API Credentials', icon: '🔑' },
            { key: 'submissions', label: 'Submissions', icon: '📊' },
            { key: 'submit', label: 'Submit VAT', icon: '📤' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'credentials' && (
        <CredentialsTab
          credentials={credentials}
          expandedCredential={expandedCredential}
          setExpandedCredential={setExpandedCredential}
          onRefresh={fetchData}
        />
      )}

      {activeTab === 'submissions' && (
        <SubmissionsTab submissions={submissions} onRefresh={fetchData} />
      )}

      {activeTab === 'submit' && (
        <SubmitVATTab credentials={credentials} onSubmit={handleSubmitVAT} />
      )}
    </div>
  )
}

// Credentials Tab Component
interface CredentialsTabProps {
  credentials: FilingCredential[]
  expandedCredential: string | null
  setExpandedCredential: (id: string | null) => void
  onRefresh: () => void
}

function CredentialsTab({ credentials, expandedCredential, setExpandedCredential, onRefresh }: CredentialsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          API Credentials ({credentials.length})
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Credentials
        </button>
      </div>

      <div className="grid gap-4">
        {credentials.map((credential) => (
          <div
            key={credential.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCredential(
                expandedCredential === credential.id ? null : credential.id
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {expandedCredential === credential.id ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {credential.country} ({credential.apiType})
                      </span>
                      <StatusBadge status={credential.status} />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Last used: {new Date(credential.lastUsed).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Expires: {new Date(credential.expiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {expandedCredential === credential.id && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value="••••••••••••"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value="••••••••••••"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Test Connection
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {credentials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔑</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No API credentials configured
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your government API credentials to enable automatic VAT filing
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Credential
            </button>
          </div>
        )}
      </div>

      {/* Add Credentials Form Modal */}
      {showAddForm && (
        <AddCredentialsModal
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            onRefresh()
          }}
        />
      )}
    </div>
  )
}

// Submissions Tab Component
function SubmissionsTab({ submissions, onRefresh }: { submissions: FilingSubmission[], onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Recent Submissions ({submissions.length})
        </h2>
        <button
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {submission.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {submission.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  €{submission.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={submission.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 mr-4">
                    View Details
                  </button>
                  {submission.status === 'error' && (
                    <button className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200">
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your VAT submissions will appear here once you start filing
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Submit VAT Tab Component
function SubmitVATTab({ credentials, onSubmit }: { 
  credentials: FilingCredential[], 
  onSubmit: (country: string, period: string) => void 
}) {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPeriod, setPeriod] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeCredentials = credentials.filter(c => c.status === 'active')

  const handleSubmit = async () => {
    if (!selectedCountry || !selectedPeriod) return
    
    setSubmitting(true)
    try {
      await onSubmit(selectedCountry, selectedPeriod)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Submit VAT Return
      </h2>

      {activeCredentials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No active API credentials
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please configure your government API credentials before submitting VAT returns
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country/Tax Authority
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select country...</option>
                {activeCredentials.map((cred) => (
                  <option key={cred.id} value={cred.country}>
                    {cred.country} ({cred.apiType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select period...</option>
                <option value="2024-Q4">Q4 2024</option>
                <option value="2024-Q3">Q3 2024</option>
                <option value="2024-Q2">Q2 2024</option>
                <option value="2024-Q1">Q1 2024</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedCountry || !selectedPeriod || submitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit VAT Return'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusColors[status as keyof typeof statusColors] || statusColors.inactive
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Add Credentials Modal Component
function AddCredentialsModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    country: '',
    apiType: 'ELSTER' as 'ELSTER' | 'MOSS' | 'HMRC',
    clientId: '',
    clientSecret: '',
    certificateFile: null as File | null,
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Add API Credentials
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select country...</option>
                <option value="DE">Germany</option>
                <option value="GB">United Kingdom</option>
                <option value="EU">European Union (MOSS)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Type
              </label>
              <select
                value={formData.apiType}
                onChange={(e) => setFormData({...formData, apiType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="ELSTER">ELSTER (Germany)</option>
                <option value="HMRC">HMRC (UK)</option>
                <option value="MOSS">MOSS (EU)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={formData.clientSecret}
                onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Skeleton
function FilingLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
      <div className="flex space-x-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow border p-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}