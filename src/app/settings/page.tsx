'use client';

import React, { useState } from 'react';
import { TeamTab } from '@/components/settings/TeamTab';
import { KnowledgeTab } from '@/components/settings/KnowledgeTab';
import { IntegrationsTab } from '@/components/settings/IntegrationsTab';
import { ComplianceTab } from '@/components/settings/ComplianceTab';
import { MobileTab } from '@/components/settings/MobileTab';

type TabId = 'account' | 'usage' | 'upgrade' | 'team' | 'knowledge' | 'integrations' | 'compliance' | 'mobile' | 'security' | 'notifications';

interface Tab {
  id: TabId;
  label: string;
  component?: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'account', label: 'Account' },
  { id: 'usage', label: 'Usage' },
  { id: 'upgrade', label: 'Upgrade' },
  { id: 'team', label: 'Team' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('team');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamTab />;
      case 'knowledge':
        return <KnowledgeTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'compliance':
        return <ComplianceTab />;
      case 'mobile':
        return <MobileTab />;
      case 'account':
      case 'usage':
      case 'upgrade':
      case 'security':
      case 'notifications':
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account, team, and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 mb-6 flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
