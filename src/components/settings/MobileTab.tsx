'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

interface DeviceCapability {
  id: string;
  name: string;
  description: string;
  status: 'supported' | 'limited' | 'not-supported';
  icon: string;
}

interface PerformanceMetric {
  metric: string;
  mobile: string;
  tablet: string;
  desktop: string;
  status: 'good' | 'moderate' | 'poor';
}

interface ResponsiveTest {
  device: string;
  resolution: string;
  score: number;
  issues: number;
}

const mockCapabilities: DeviceCapability[] = [
  {
    id: '1',
    name: 'Touch Navigation',
    description: 'Optimized touch targets and gestures',
    status: 'supported',
    icon: '👆',
  },
  {
    id: '2',
    name: 'Offline Data Access',
    description: 'View cached data when offline',
    status: 'limited',
    icon: '📡',
  },
  {
    id: '3',
    name: 'File Upload',
    description: 'Upload documents from mobile devices',
    status: 'supported',
    icon: '📤',
  },
  {
    id: '4',
    name: 'Push Notifications',
    description: 'Native mobile app required',
    status: 'not-supported',
    icon: '🔔',
  },
  {
    id: '5',
    name: 'Biometric Authentication',
    description: 'Available in mobile app',
    status: 'not-supported',
    icon: '🔐',
  },
  {
    id: '6',
    name: 'Camera Integration',
    description: 'Document scanning via browser',
    status: 'limited',
    icon: '📷',
  },
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    metric: 'Load Time',
    mobile: '2.1s',
    tablet: '1.8s',
    desktop: '1.2s',
    status: 'good',
  },
  {
    metric: 'First Paint',
    mobile: '0.8s',
    tablet: '0.6s',
    desktop: '0.4s',
    status: 'good',
  },
  {
    metric: 'Largest Contentful Paint',
    mobile: '2.8s',
    tablet: '2.2s',
    desktop: '1.6s',
    status: 'moderate',
  },
  {
    metric: 'Cumulative Layout Shift',
    mobile: '0.05',
    tablet: '0.03',
    desktop: '0.02',
    status: 'good',
  },
];

const mockResponsiveTests: ResponsiveTest[] = [
  {
    device: 'Mobile (320px-767px)',
    resolution: '320px-767px',
    score: 95,
    issues: 3,
  },
  {
    device: 'Tablet (768px-1023px)',
    resolution: '768px-1023px',
    score: 98,
    issues: 1,
  },
  {
    device: 'Desktop (1024px+)',
    resolution: '1024px+',
    score: 100,
    issues: 0,
  },
];

export const MobileTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'online' | 'desktop'>('online');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <h2 className="text-xl font-semibold text-white">Mobile Optimization Status</h2>
              <p className="text-sm text-slate-400">Cross-device compatibility and performance metrics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('online')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'online'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Desktop
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-sm text-blue-300 mb-1">PWA</div>
            <div className="text-2xl font-bold text-blue-400">Ready</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-sm text-green-300 mb-1">Mobile Score</div>
            <div className="text-2xl font-bold text-green-400">98</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-sm text-purple-300 mb-1">Offline Cache</div>
            <div className="text-2xl font-bold text-purple-400">15MB</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="text-sm text-orange-300 mb-1">Min Width</div>
            <div className="text-2xl font-bold text-orange-400">320px+</div>
          </div>
        </div>
      </div>

      {/* Device Capabilities */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-semibold text-white">Device Capabilities</h2>
        </div>

        <div className="space-y-3">
          {mockCapabilities.map((capability) => (
            <div
              key={capability.id}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{capability.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{capability.name}</h3>
                  <p className="text-sm text-slate-400">{capability.description}</p>
                </div>
              </div>
              <Badge
                variant={
                  capability.status === 'supported'
                    ? 'success'
                    : capability.status === 'limited'
                    ? 'warning'
                    : 'error'
                }
              >
                {capability.status === 'supported'
                  ? '✓ supported'
                  : capability.status === 'limited'
                  ? '⚠ limited'
                  : '✕ not supported'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">⏱️</span>
          <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Metric</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">
                  📱 Mobile
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">
                  📱 Tablet
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">
                  🖥️ Desktop
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPerformanceMetrics.map((metric, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-3 px-4 text-sm text-slate-300">{metric.metric}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono ${
                        metric.status === 'good'
                          ? 'text-green-400'
                          : metric.status === 'moderate'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {metric.mobile}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono ${
                        metric.status === 'good'
                          ? 'text-green-400'
                          : metric.status === 'moderate'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {metric.tablet}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono ${
                        metric.status === 'good'
                          ? 'text-green-400'
                          : metric.status === 'moderate'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {metric.desktop}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Get the Mobile App */}
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8 text-center">
        <span className="text-6xl mb-4 block">📱</span>
        <h2 className="text-2xl font-bold text-white mb-2">Get the Mobile App</h2>
        <p className="text-slate-300 mb-6">
          Enhanced mobile experience with offline sync, push notifications, and biometric authentication
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <span>📱</span>
            Download iOS App
          </button>
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <span>🤖</span>
            Download Android App
          </button>
        </div>
        <p className="text-sm text-slate-400 mt-4">
          Coming Q1 2025 • Join beta waitlist for early access
        </p>
      </div>

      {/* Responsive Design Test */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔄</span>
          <h2 className="text-xl font-semibold text-white">Responsive Design Test</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockResponsiveTests.map((test, index) => (
            <div
              key={index}
              className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{test.device}</h3>
                <div
                  className={`text-2xl font-bold ${
                    test.score >= 95
                      ? 'text-green-400'
                      : test.score >= 80
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {test.score}
                  <span className="text-sm text-slate-400">/100</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{test.resolution}</p>
              <div className="flex items-center gap-2">
                <StatusIndicator
                  status={test.issues === 0 ? 'success' : test.issues <= 2 ? 'warning' : 'error'}
                  size="sm"
                />
                <span className="text-sm text-slate-300">
                  {test.issues} {test.issues === 1 ? 'issue' : 'issues'} found
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
