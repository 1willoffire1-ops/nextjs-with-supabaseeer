'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
  avatar: string;
  lastActive: string;
}

interface Permission {
  id: string;
  label: string;
  checked: boolean;
}

interface Role {
  id: string;
  title: string;
  icon: string;
  permissions: Permission[];
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'owner',
    status: 'active',
    avatar: 'SJ',
    lastActive: '06:40:05',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'admin',
    status: 'active',
    avatar: 'MC',
    lastActive: '04:30:05',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@company.com',
    role: 'editor',
    status: 'active',
    avatar: 'EW',
    lastActive: '06:40:05',
  },
];

const mockRoles: Role[] = [
  {
    id: 'owner',
    title: 'Owner',
    icon: '👑',
    permissions: [
      { id: '1', label: 'Full system access', checked: true },
      { id: '2', label: 'Billing management', checked: true },
      { id: '3', label: 'Team management', checked: true },
      { id: '4', label: 'All data operations', checked: true },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: '⚙️',
    permissions: [
      { id: '1', label: 'Upload data', checked: true },
      { id: '2', label: 'Review errors', checked: true },
      { id: '3', label: 'Approve returns', checked: true },
      { id: '4', label: 'Manage integrations', checked: true },
    ],
  },
  {
    id: 'editor',
    title: 'Editor',
    icon: '✏️',
    permissions: [
      { id: '1', label: 'Upload data', checked: true },
      { id: '2', label: 'Review errors', checked: true },
      { id: '3', label: 'Edit configurations', checked: true },
    ],
  },
  {
    id: 'viewer',
    title: 'Viewer',
    icon: '👁️',
    permissions: [
      { id: '1', label: 'View dashboards', checked: true },
      { id: '2', label: 'Download reports', checked: true },
      { id: '3', label: 'Read-only access', checked: true },
    ],
  },
];

const mockActivity: TimelineItem[] = [
  {
    id: '1',
    user: 'Mike Chen',
    action: 'Uploaded Q4 2024 invoices (156 records)',
    timestamp: '19/09/2025, 04:20:05',
    avatar: '📤',
  },
  {
    id: '2',
    user: 'Emma Wilson',
    action: 'Fixed errors in German transactions',
    timestamp: '18/09/2025, 02:30:05',
    avatar: '🔧',
  },
  {
    id: '3',
    user: 'Sarah Johnson',
    action: 'Approved VAT return for December 2024',
    timestamp: '19/09/2025, 00:40:05',
    avatar: '✅',
  },
];

export const TeamTab: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    console.log('Inviting:', email);
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Team Members Section */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <h2 className="text-xl font-semibold text-white">
              Team Members ({mockTeamMembers.length})
            </h2>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleInvite}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Invite
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {mockTeamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-200 font-medium">{member.name}</span>
                    <Badge variant={member.role === 'owner' ? 'info' : 'default'}>
                      {member.role}
                    </Badge>
                    <Badge variant="active">{member.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Last active</p>
                  <p className="text-sm text-slate-300">{member.lastActive}</p>
                </div>
                <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                  <span className="text-slate-400">⋮</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permissions Section */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🛡️</span>
          <h2 className="text-xl font-semibold text-white">Role Permissions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRoles.map((role) => (
            <div
              key={role.id}
              className="p-5 bg-slate-700/30 rounded-lg border border-slate-600/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{role.icon}</span>
                <h3 className="text-lg font-semibold text-white">{role.title}</h3>
              </div>
              <div className="space-y-2">
                {role.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={permission.checked}
                      readOnly
                      className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                    />
                    <label className="text-sm text-slate-300">{permission.label}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">⏱️</span>
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        <Timeline items={mockActivity} />
      </div>
    </div>
  );
};
