'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

interface Integration {
  id: string;
  country: string;
  countryCode: string;
  authority: string;
  status: 'connected' | 'limited' | 'disconnected';
  uptime: string;
  apiVersion: string;
  lastSync: string;
  features: string[];
}

interface Certification {
  id: string;
  name: string;
  status: 'active' | 'expiring';
  expiryDate: string;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    country: 'Germany',
    countryCode: 'DE',
    authority: 'Bundeszentralamt für Steuern (BZSt)',
    status: 'connected',
    uptime: '99.8%',
    apiVersion: 'v2.3',
    lastSync: '06:36:36',
    features: ['VAT validation', 'MOSS filing', 'Real-time verification'],
  },
  {
    id: '2',
    country: 'France',
    countryCode: 'FR',
    authority: 'Direction Générale des Finances Publiques',
    status: 'connected',
    uptime: '99.5%',
    apiVersion: 'v2.1',
    lastSync: '06:28:36',
    features: ['VAT validation', 'Electronic filing', 'Status checks'],
  },
  {
    id: '3',
    country: 'Netherlands',
    countryCode: 'NL',
    authority: 'Belastingdienst',
    status: 'limited',
    uptime: '95.2%',
    apiVersion: 'v1.8',
    lastSync: '04:40:36',
    features: ['VAT validation', 'Basic filing'],
  },
  {
    id: '4',
    country: 'Italy',
    countryCode: 'IT',
    authority: 'Agenzia delle Entrate',
    status: 'connected',
    uptime: '97.3%',
    apiVersion: 'v2.0',
    lastSync: '00:40:36',
    features: ['VAT validation', 'Electronic invoicing'],
  },
  {
    id: '5',
    country: 'Spain',
    countryCode: 'ES',
    authority: 'Agencia Estatal de Administración Tributaria',
    status: 'connected',
    uptime: '98.9%',
    apiVersion: 'v2.0',
    lastSync: '06:36:36',
    features: ['VAT validation', 'SII integration', 'Real-time reporting'],
  },
  {
    id: '6',
    country: 'Austria',
    countryCode: 'AT',
    authority: 'Bundesministerium für Finanzen',
    status: 'disconnected',
    uptime: '0%',
    apiVersion: 'v1.5',
    lastSync: '06:40:36',
    features: ['VAT validation'],
  },
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'ISO 27001',
    status: 'active',
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    name: 'SOC 2 Type II',
    status: 'active',
    expiryDate: '2025-06-30',
  },
  {
    id: '3',
    name: 'GDPR Compliant',
    status: 'expiring',
    expiryDate: 'ongoing',
  },
  {
    id: '4',
    name: 'VAT MOSS Ready',
    status: 'expiring',
    expiryDate: 'ongoing',
  },
];

export const IntegrationsTab: React.FC = () => {
  const connectedCount = mockIntegrations.filter((i) => i.status === 'connected').length;
  const featuresCount = new Set(mockIntegrations.flatMap((i) => i.features)).size;
  const avgUptime =
    mockIntegrations.reduce((acc, i) => acc + parseFloat(i.uptime), 0) / mockIntegrations.length;

  return (
    <div className="space-y-6">
      {/* Status Dashboard */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <h2 className="text-xl font-semibold text-white">Government Integration Status</h2>
              <p className="text-sm text-slate-400">Real-time connection status with EU tax authorities</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <span>🔄</span>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="text-3xl font-bold text-blue-400 mb-1">{avgUptime.toFixed(1)}%</div>
            <div className="text-sm text-slate-400">System Health</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="text-3xl font-bold text-green-400 mb-1">{connectedCount}</div>
            <div className="text-sm text-slate-400">Active Connections</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <div className="text-3xl font-bold text-purple-400 mb-1">{featuresCount}</div>
            <div className="text-sm text-slate-400">Available Features</div>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {mockIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl border border-slate-600">
                  <CountryFlag countryCode={integration.countryCode} size="lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{integration.country}</h3>
                    <Badge
                      variant={
                        integration.status === 'connected'
                          ? 'connected'
                          : integration.status === 'limited'
                          ? 'limited'
                          : 'disconnected'
                      }
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{integration.authority}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <StatusIndicator
                        status={
                          integration.status === 'connected'
                            ? 'success'
                            : integration.status === 'limited'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      />
                      {integration.uptime} uptime
                    </span>
                    <span>📡 API {integration.apiVersion}</span>
                    <span>🕐 {integration.lastSync}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="outline" size="sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <span className="text-slate-400">🔗</span>
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <span className="text-slate-400">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security & Compliance Certifications */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🛡️</span>
          <h2 className="text-xl font-semibold text-white">Security & Compliance Certifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCertifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{cert.name}</h3>
              <p className="text-sm text-slate-400">Expires: {cert.expiryDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
