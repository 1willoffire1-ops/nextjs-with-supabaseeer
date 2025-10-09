import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">VATANA Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your VAT compliance control center</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Invoices</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Errors Found</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">€0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Savings</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compliance</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload</h3>
            <p className="text-gray-600 dark:text-gray-400">Upload and analyze new invoice files</p>
          </Link>

          <Link to="/errors" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">View Errors</h3>
            <p className="text-gray-600 dark:text-gray-400">Review detected VAT compliance issues</p>
          </Link>

          <Link to="/savings" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Savings</h3>
            <p className="text-gray-600 dark:text-gray-400">Track your penalty savings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}