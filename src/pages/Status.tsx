import React, { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  uptime: number | null;
  checks: {
    database: string;
    api: string;
    claude: string;
  };
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'connected':
      case 'configured':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
      case 'degraded':
      case 'missing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800';
      case 'unhealthy':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status.toLowerCase() === 'healthy' || status.toLowerCase() === 'connected' || status.toLowerCase() === 'configured' 
          ? 'bg-green-500' 
          : status.toLowerCase() === 'degraded' || status.toLowerCase() === 'missing'
          ? 'bg-yellow-500'
          : status.toLowerCase() === 'unhealthy' || status.toLowerCase() === 'error'
          ? 'bg-red-500'
          : 'bg-gray-500'
      }`} />
      {status}
    </span>
  );
}

function formatUptime(seconds: number | null): string {
  if (!seconds) return 'Unknown';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const Status = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/api/health`);
        
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
        setHealthData({
          status: 'unknown',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          environment: 'production',
          uptime: null,
          checks: {
            database: 'unknown',
            api: 'unknown', 
            claude: 'unknown'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            VATANA System Status
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real-time monitoring of all system components
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Overall System Status
            </h2>
            <StatusBadge status={healthData?.status || 'unknown'} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Version
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {healthData?.version || '1.0.0'}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Environment
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {healthData?.environment || 'development'}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Uptime
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatUptime(healthData?.uptime || null)}
              </div>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Service Components
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Database</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Supabase PostgreSQL</div>
                </div>
              </div>
              <StatusBadge status={healthData?.checks?.database || 'unknown'} />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">API Service</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">REST API endpoints</div>
                </div>
              </div>
              <StatusBadge status={healthData?.checks?.api || 'unknown'} />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">AI Service</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Claude API integration</div>
                </div>
              </div>
              <StatusBadge status={healthData?.checks?.claude || 'unknown'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
