'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { CountryFlag } from '@/components/ui/CountryFlag';

interface Guide {
  id: string;
  title: string;
  description: string;
  country: string;
  readTime: string;
  updatedDate: string;
  priority?: 'high' | 'medium';
  tags: string[];
}

type TabType = 'guides' | 'changes' | 'tools';

const mockGuides: Guide[] = [
  {
    id: '1',
    title: 'Germany VAT Rate Changes 2024',
    description: 'Updated VAT rates for digital services and cross-border transactions',
    country: 'DE',
    readTime: '5 min read',
    updatedDate: '01/01/2024',
    priority: 'high',
    tags: ['VAT rates', 'Digital services', 'B2B'],
  },
  {
    id: '2',
    title: 'Netherlands B2B Service Rules',
    description: 'Place of supply rules for B2B services within EU',
    country: 'NL',
    readTime: '8 min read',
    updatedDate: '15/01/2024',
    priority: 'medium',
    tags: ['Place of supply', 'B2B', 'EU regulations'],
  },
  {
    id: '3',
    title: 'France VAT Return Deadlines',
    description: 'Monthly and quarterly VAT return submission deadlines',
    country: 'FR',
    readTime: '3 min read',
    updatedDate: '01/02/2024',
    priority: 'high',
    tags: ['Deadlines', 'VAT returns', 'Monthly reporting'],
  },
  {
    id: '4',
    title: 'EU-Wide Reverse Charge Updates',
    description: 'New reverse charge mechanism rules across EU member states',
    country: 'EU',
    readTime: '12 min read',
    updatedDate: '15/02/2024',
    priority: 'high',
    tags: ['Reverse charge', 'EU', 'Cross-border'],
  },
];

export const KnowledgeTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('guides');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = mockGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h2 className="text-xl font-semibold text-white">VAT Compliance Knowledge Base</h2>
              <p className="text-sm text-slate-400">Country-specific guides and regulatory updates</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <span>⬇️</span>
            Export All
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, countries, or topics..."
            className="w-full px-4 py-3 pl-10 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'guides'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          Compliance Guides
        </button>
        <button
          onClick={() => setActiveTab('changes')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'changes'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          Regulatory Changes
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          Quick Tools
        </button>
      </div>

      {/* Guides List */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CountryFlag countryCode={guide.country} size="md" />
                    <h3 className="text-lg font-semibold text-white">{guide.title}</h3>
                    {guide.priority && (
                      <Badge variant={guide.priority === 'high' ? 'high-priority' : 'medium-priority'}>
                        {guide.priority} priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 mb-4">{guide.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span>🕐</span>
                      {guide.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      Updated {guide.updatedDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {guide.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2">
                    <span>📖</span>
                    Read Guide
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2">
                    <span>🔗</span>
                    Official Source
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'changes' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <p className="text-slate-400 text-center py-12">
            Regulatory changes tracking coming soon...
          </p>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <p className="text-slate-400 text-center py-12">Quick tools coming soon...</p>
        </div>
      )}
    </div>
  );
};
