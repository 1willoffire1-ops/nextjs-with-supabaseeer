'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { CountryFlag } from '@/components/ui/CountryFlag';

interface ComplianceEvent {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  daysOverdue: number;
  country: string;
  countryCode: string;
  status: 'overdue' | 'pending' | 'completed';
  priority: 'high' | 'medium';
  type: 'deadline' | 'filing' | 'payment' | 'regulatory' | 'reminder';
}

interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  country: string;
  countryCode: string;
  impact: 'high' | 'medium' | 'low';
}

type FilterType = 'all' | 'deadlines' | 'filings' | 'payments' | 'regulatory' | 'reminders';

const mockEvents: ComplianceEvent[] = [
  {
    id: '1',
    title: 'Spanish SII Real-time Reporting',
    description: 'Submit invoice records to SII system within 4-day deadline',
    dueDate: '08/12/2024',
    daysOverdue: 285,
    country: 'Spain',
    countryCode: 'ES',
    status: 'overdue',
    priority: 'high',
    type: 'deadline',
  },
  {
    id: '2',
    title: 'German VAT Return Filing',
    description: 'Monthly VAT return (Umsatzsteuervoranmeldung) due for November 2024',
    dueDate: '10/12/2024',
    daysOverdue: 281,
    country: 'Germany',
    countryCode: 'DE',
    status: 'pending',
    priority: 'medium',
    type: 'filing',
  },
  {
    id: '3',
    title: 'French VAT Payment Due',
    description: 'VAT payment for Q4 2024 transactions',
    dueDate: '15/12/2024',
    daysOverdue: 278,
    country: 'France',
    countryCode: 'FR',
    status: 'pending',
    priority: 'medium',
    type: 'payment',
  },
  {
    id: '4',
    title: 'Netherlands OSS Quarterly Report',
    description: 'One-Stop Shop quarterly return for EU sales',
    dueDate: '20/12/2024',
    daysOverdue: 273,
    country: 'Netherlands',
    countryCode: 'NL',
    status: 'pending',
    priority: 'medium',
    type: 'filing',
  },
  {
    id: '5',
    title: 'GDPR Annual Review',
    description: 'Annual review of data processing activities and compliance',
    dueDate: '31/12/2024',
    daysOverdue: 262,
    country: 'European Union',
    countryCode: 'EU',
    status: 'pending',
    priority: 'medium',
    type: 'regulatory',
  },
  {
    id: '6',
    title: 'EU VAT Rate Changes',
    description: 'New VAT rates effective for digital services in multiple EU countries',
    dueDate: '01/01/2025',
    daysOverdue: 261,
    country: 'European Union',
    countryCode: 'EU',
    status: 'pending',
    priority: 'medium',
    type: 'regulatory',
  },
];

const mockUpdates: RegulatoryUpdate[] = [
  {
    id: '1',
    title: 'EU VAT Directive Amendment',
    description: 'New rules for digital platform services effective January 2025',
    date: '2024-12-01',
    country: 'All EU',
    countryCode: 'EU',
    impact: 'medium',
  },
  {
    id: '2',
    title: 'German UStG Update',
    description: 'Changes to reverse charge mechanism for construction services',
    date: '2024-11-15',
    country: 'Germany',
    countryCode: 'DE',
    impact: 'high',
  },
  {
    id: '3',
    title: 'French DGFiP Circular',
    description: 'Clarification on e-commerce VAT treatment',
    date: '2024-11-10',
    country: 'France',
    countryCode: 'FR',
    impact: 'low',
  },
];

export const ComplianceTab: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const overdueCount = mockEvents.filter((e) => e.status === 'overdue').length;
  const next7DaysCount = mockEvents.filter(
    (e) => e.status === 'pending' && e.daysOverdue <= 7 && e.daysOverdue >= 0
  ).length;
  const regChangesCount = mockEvents.filter((e) => e.type === 'regulatory').length;
  const completedCount = mockEvents.filter((e) => e.status === 'completed').length;

  const filteredEvents =
    activeFilter === 'all'
      ? mockEvents
      : mockEvents.filter((e) => {
          if (activeFilter === 'deadlines') return e.type === 'deadline';
          if (activeFilter === 'filings') return e.type === 'filing';
          if (activeFilter === 'payments') return e.type === 'payment';
          if (activeFilter === 'regulatory') return e.type === 'regulatory';
          if (activeFilter === 'reminders') return e.type === 'reminder';
          return true;
        });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-xl font-semibold text-white">Compliance Calendar</h2>
              <p className="text-sm text-slate-400">Stay ahead of deadlines and regulatory changes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>🔍</span>
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>+</span>
              Add Event
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-400 mb-1">{overdueCount}</div>
            <div className="text-sm text-red-300">Overdue</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{next7DaysCount}</div>
            <div className="text-sm text-yellow-300">Next 7 Days</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-1">{regChangesCount}</div>
            <div className="text-sm text-blue-300">Reg Changes</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">{completedCount}</div>
            <div className="text-sm text-green-300">Completed</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'deadlines', 'filings', 'payments', 'regulatory', 'reminders'] as FilterType[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`bg-slate-800/50 rounded-xl p-5 border-l-4 ${
              event.status === 'overdue'
                ? 'border-l-red-500'
                : event.priority === 'high'
                ? 'border-l-yellow-500'
                : 'border-l-blue-500'
            } border-t border-r border-b border-slate-700/50 hover:border-slate-600/50 transition-all`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                  {event.status === 'overdue' ? (
                    <span className="text-2xl">⚠️</span>
                  ) : event.type === 'filing' ? (
                    <span className="text-2xl">📄</span>
                  ) : event.type === 'payment' ? (
                    <span className="text-2xl">💰</span>
                  ) : event.type === 'regulatory' ? (
                    <span className="text-2xl">⚖️</span>
                  ) : (
                    <span className="text-2xl">⏰</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                    <Badge variant={event.status === 'overdue' ? 'overdue' : 'pending'}>
                      {event.status}
                    </Badge>
                    <CountryFlag countryCode={event.countryCode} showName size="sm" />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span>📅</span>
                      {event.dueDate}
                    </span>
                    {event.daysOverdue > 0 && (
                      <Badge variant="overdue" size="sm">
                        {event.daysOverdue} days overdue
                      </Badge>
                    )}
                    <Badge
                      variant={event.priority === 'high' ? 'high-priority' : 'medium-priority'}
                      size="sm"
                    >
                      Action Required
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <span className="text-slate-400">🔔</span>
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <span className="text-slate-400">🔗</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Regulatory Updates */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔔</span>
          <h2 className="text-xl font-semibold text-white">Recent Regulatory Updates</h2>
        </div>

        <div className="space-y-3">
          {mockUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CountryFlag countryCode={update.countryCode} size="sm" />
                    <h3 className="text-base font-semibold text-white">{update.title}</h3>
                    <Badge
                      variant={
                        update.impact === 'high'
                          ? 'high-priority'
                          : update.impact === 'medium'
                          ? 'medium-priority'
                          : 'default'
                      }
                      size="sm"
                    >
                      {update.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{update.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{update.date}</span>
                    <span>•</span>
                    <span>{update.country}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
