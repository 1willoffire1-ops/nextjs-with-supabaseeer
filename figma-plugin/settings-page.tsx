import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  Settings,
  User,
  BarChart3,
  Crown,
  Users,
  Brain,
  Plug,
  Shield,
  Smartphone,
  Lock,
  Bell,
  Globe,
  Calendar,
  CreditCard,
  HardDrive,
  Receipt,
  Zap,
  FileText,
  Star,
  Plus,
  Upload,
  Copy,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  X,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  Award,
  MessageSquare,
  FileSearch,
  Headphones
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planStep, setPlanStep] = useState(1);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showVatRegModal, setShowVatRegModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Sample data for usage charts
  const usageHistory = [
    { month: 'Aug', transactions: 980, apiCalls: 35000, storage: 12.5 },
    { month: 'Sep', transactions: 1150, apiCalls: 42000, storage: 13.8 },
    { month: 'Oct', transactions: 1200, apiCalls: 38000, storage: 14.2 },
    { month: 'Nov', transactions: 1180, apiCalls: 44000, storage: 14.8 },
    { month: 'Dec', transactions: 1350, apiCalls: 48000, storage: 15.0 },
    { month: 'Jan', transactions: 1247, apiCalls: 45280, storage: 15.2 }
  ];

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
    { id: 'upgrade', label: 'Upgrade', icon: Crown },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'knowledge', label: 'Knowledge', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Top Bar Component
  const TopBar = () => (
    <div className="h-[72px] bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/30 px-8 py-4 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400">Home / Settings</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {hasUnsavedChanges ? (
          <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
            Save Changes
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">All changes saved</span>
          </div>
        )}
      </div>
    </div>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl mx-8 mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-[3px] ${
                activeTab === tab.id
                  ? 'text-teal-400 border-teal-400 bg-teal-400/10 font-semibold'
                  : 'text-gray-400 border-transparent hover:text-teal-400 hover:bg-teal-400/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Account Tab
  const AccountTab = () => {
    const [vatNumber, setVatNumber] = useState('GB123456789');
    const [vatValid, setVatValid] = useState(true);

    const handleVatChange = (v: string) => {
      setVatNumber(v);
      // simple format validation example
      const ok = /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(v.toUpperCase());
      setVatValid(ok);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Information */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            <p className="text-sm text-gray-400">Update your personal information and email address</p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-30 h-30 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-1">
                  <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg border border-slate-600/30 transition-colors">
                    Upload new photo
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Remove photo</button>
                </div>
                <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    defaultValue="john@company.com"
                    className="w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Verified</span>
                  </div>
                </div>
                <button className="text-teal-400 text-sm hover:underline mt-2">Change email</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Finance Manager"
                  className="w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <select aria-label="Country code" className="px-3 py-3 bg-slate-900/60 border border-teal-500/20 rounded-lg text-white">
                    <option>+44</option>
                    <option>+33</option>
                    <option>+49</option>
                    <option>+1</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="20 1234 5678"
                    className="flex-1 px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="Acme Corporation Ltd."
                    readOnly
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/40 rounded-lg text-white opacity-80"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Only admins can change company name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Personal VAT Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => handleVatChange(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border rounded-lg text-white placeholder-gray-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all ${
                      vatValid ? 'border-teal-500/20 focus:border-teal-400' : 'border-red-500/40 focus:border-red-400'
                    }`}
                  />
                  {vatValid ? (
                    <CheckCircle className="w-4 h-4 text-green-400 absolute right-3 top-3" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 absolute right-3 top-3" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Real-time format validation</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Language & Region</h2>
            <p className="text-sm text-gray-400">Set your preferred language and regional settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Language</label>
              <select className="w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all">
                <option>English (UK)</option>
                <option>English (US)</option>
                <option>German</option>
                <option>French</option>
                <option>Spanish</option>
                <option>Italian</option>
                <option>Dutch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              <select className="w-full px-4 py-3 bg-slate-900/60 backdrop-blur-xl border border-teal-500/20 rounded-lg text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all">
                <option>GMT (London)</option>
                <option>CET (Paris)</option>
                <option>EST (New York)</option>
                <option>PST (San Francisco)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Date Format</label>
              <div className="space-y-2">
                {['DD/MM/YYYY (15/01/2025)', 'MM/DD/YYYY (01/15/2025)', 'YYYY-MM-DD (2025-01-15)'].map((format) => (
                  <label key={format} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="dateFormat" defaultChecked={format.startsWith('DD/')} className="text-teal-400" />
                    <span className="text-gray-300">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Time Format</label>
              <div className="space-y-2">
                {['24-hour (14:30)', '12-hour (2:30 PM)'].map((format) => (
                  <label key={format} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="timeFormat" defaultChecked={format.includes('24-hour')} className="text-teal-400" />
                    <span className="text-gray-300">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
              <select className="w-full px-4 py-3 bg-slate-900/60 border border-teal-500/20 rounded-lg text-white">
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>USD ($)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Used for display only</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Number Format</label>
              <div className="space-y-2">
                {['1,234.56 (comma decimal)', '1.234,56 (period decimal)'].map((fmt) => (
                  <label key={fmt} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="numberFormat" defaultChecked={fmt.startsWith('1,234')} className="text-teal-400" />
                    <span className="text-gray-300">{fmt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
              Save Changes
            </button>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Account Status</h2>
            <p className="text-sm text-gray-400">Manage your account status and preferences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="text-white font-medium">Professional Plan</p>
              </div>
              <button onClick={() => setActiveTab('upgrade')} className="px-3 py-1 text-sm bg-teal-500/20 text-teal-400 rounded-md hover:bg-teal-500/30">Upgrade</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> January 10, 2024</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Account ID</p>
                <p className="text-white font-mono">ACC-2024-12345</p>
              </div>
              <button className="px-3 py-1 text-sm text-gray-300 hover:text-white">Copy</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">API Access</p>
                <p className="text-white font-medium">Enabled</p>
              </div>
              <button onClick={() => setActiveTab('integrations')} className="px-3 py-1 text-sm text-teal-400 hover:underline">View API Keys</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-red-500/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            <p className="text-sm text-gray-400">Irreversible actions that affect your account</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-red-500/20">
              <div>
                <h3 className="font-medium text-white">Deactivate Account</h3>
                <p className="text-sm text-gray-400">Temporarily disable your account</p>
                <p className="text-xs text-gray-500">You can reactivate anytime</p>
              </div>
              <button className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                Deactivate Account
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">Delete Account</h3>
                <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                <p className="text-xs text-red-400">This action cannot be undone</p>
              </div>
              <button className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Usage Tab
  const UsageTab = () => {
    const [sections, setSections] = useState({
      transactions: true,
      storage: false,
      api: false,
      features: false,
    });

    const storageData = [
      { name: 'Documents', value: 8.5, color: '#14F195' },
      { name: 'Invoices', value: 4.2, color: '#00D9B4' },
      { name: 'Reports', value: 2.1, color: '#00BFA6' },
      { name: 'Other', value: 0.4, color: '#64748B' },
    ];

    const toggle = (key: keyof typeof sections) => setSections(s => ({ ...s, [key]: !s[key] }));

    return (
      <div className="space-y-8">
        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Receipt, label: 'Transactions', current: '1,247', limit: 'of 5,000', progress: 25, status: 'Well within limit', color: 'text-green-400' },
            { icon: HardDrive, label: 'Storage', current: '15.2 GB', limit: 'of 50 GB', progress: 30, status: '30% used', color: 'text-blue-400' },
            { icon: Zap, label: 'API Calls', current: '45,280', limit: 'of 100,000', progress: 45, status: 'Normal usage', color: 'text-yellow-400' },
            { icon: Users, label: 'Team Members', current: '8', limit: 'of 15', progress: 53, status: '53% used', color: 'text-purple-400' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <span className="text-gray-400 text-sm">{item.label}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-3xl font-bold text-white">{item.current}</span>
                    <span className="text-sm text-gray-400 ml-2">{item.limit}</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className={`text-sm ${item.color}`}>{item.status}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Chart */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Usage Over Time</h2>
            <select className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 180, 0.1)" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis yAxisId="left" stroke="#94A3B8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(26, 31, 46, 0.95)',
                    border: '1px solid rgba(0, 217, 180, 0.3)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#00D9B4" strokeWidth={2} name="Transactions" />
                <Line yAxisId="left" type="monotone" dataKey="apiCalls" stroke="#14F195" strokeWidth={2} name="API Calls" />
                <Line yAxisId="right" type="monotone" dataKey="storage" stroke="#00BFA6" strokeWidth={2} name="Storage (GB)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

  // Upgrade Tab
  const UpgradeTab = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Current Plan Banner */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-teal-500/30 shadow-[0_0_0_1px_rgba(0,217,180,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20">
              <Star className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Professional Plan</h3>
              <p className="text-gray-400">Next billing: Feb 1, 2025 • <span className="text-green-400">Active</span></p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl text-white font-bold">€149<span className="text-sm text-gray-400">/month</span></div>
            <div className="text-sm text-gray-400">5,000 transactions • 50 GB • 15 members • API access</div>
            <div className="flex gap-4 justify-end mt-3">
              <button className="text-teal-400 hover:underline text-sm">Change billing cycle</button>
              <button className="text-red-400 hover:underline text-sm">Cancel subscription</button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Choose Your Plan</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Billing:</span>
            <button className="px-3 py-1 rounded-full bg-slate-800/50 text-white">Monthly</button>
            <button className="px-3 py-1 rounded-full bg-slate-800/30 text-gray-400 hover:text-white">Annual <span className="text-teal-400">(save 20%)</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
            <div className="text-gray-400 font-semibold">STARTER</div>
            <div className="mt-4 text-3xl text-white font-bold">€49</div>
            <div className="text-sm text-gray-400">per month</div>
            <p className="mt-4 text-gray-300">Perfect for small businesses</p>
            <ul className="mt-4 space-y-2 text-gray-300 text-sm">
              <li>✓ 1,000 transactions</li>
              <li>✓ 10 GB storage</li>
              <li>✓ 3 team members</li>
              <li>✓ Email support</li>
              <li>✓ Basic reporting</li>
              <li>✓ 5 countries</li>
            </ul>
            <button onClick={() => setShowPlanModal(true)} className="mt-6 w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Choose Plan</button>
          </div>

          {/* Professional */}
          <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-teal-500/40 shadow-[0_0_30px_rgba(0,217,180,0.08)] scale-[1.02]">
            <div className="absolute -top-3 right-4 px-2 py-1 rounded-full text-xs bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-semibold">MOST POPULAR</div>
            <div className="text-gray-400 font-semibold">PROFESSIONAL</div>
            <div className="mt-4 text-3xl text-white font-bold">€149</div>
            <div className="text-sm text-gray-400">per month</div>
            <p className="mt-4 text-gray-300">For growing businesses</p>
            <ul className="mt-4 space-y-2 text-gray-300 text-sm">
              <li>✓ 5,000 transactions</li>
              <li>✓ 50 GB storage</li>
              <li>✓ 15 team members</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced reporting</li>
              <li>✓ API access</li>
              <li>✓ Unlimited countries</li>
              <li>✓ Custom integrations</li>
            </ul>
            <button className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Current Plan ✓</button>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
            <div className="text-gray-400 font-semibold">ENTERPRISE</div>
            <div className="mt-4 text-3xl text-white font-bold">Custom</div>
            <div className="text-sm text-gray-400">pricing</div>
            <p className="mt-4 text-gray-300">For large organizations</p>
            <ul className="mt-4 space-y-2 text-gray-300 text-sm">
              <li>✓ Unlimited transactions</li>
              <li>✓ Unlimited storage</li>
              <li>✓ Unlimited team members</li>
              <li>✓ 24/7 dedicated support</li>
              <li>✓ Custom reporting & API</li>
              <li>✓ SLA guarantee</li>
              <li>✓ Dedicated account manager</li>
              <li>✓ On-premise option</li>
            </ul>
            <button className="mt-6 w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Contact Sales</button>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h2 className="text-xl font-semibold text-white mb-4">Compare Plans</h2>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 pr-4">Feature</th>
                <th className="py-2 pr-4">Starter</th>
                <th className="py-2 pr-4">Professional</th>
                <th className="py-2 pr-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ['Transactions / month', '1,000', '5,000', 'Unlimited'],
                ['Storage', '10 GB', '50 GB', 'Unlimited'],
                ['Team members', '3', '15', 'Unlimited'],
                ['API access', '✗', '✓', '✓'],
                ['Advanced analytics', '✗', '✓', '✓'],
                ['SSO', '✗', 'Pro+', '✓'],
                ['Audit logs', '✗', '✓', '✓'],
                ['Priority support', '✗', '✓', '✓'],
              ].map((row, i) => (
                <tr key={i} className="border-t border-slate-700/30">
                  {row.map((cell, j) => (
                    <td key={j} className="py-3 pr-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Optional Add-Ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Plus, title: '+2,000 Transactions', price: '+€29/month', desc: 'Need more capacity?' },
            { icon: HardDrive, title: '+50 GB Storage', price: '+€19/month', desc: '' },
            { icon: Users, title: '+5 Team Members', price: '+€39/month', desc: '' },
            { icon: Headphones, title: 'Premium Support', price: '+€99/month', desc: '24/7 priority support with 1-hour response' },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 hover:shadow-[0_0_0_1px_rgba(0,217,180,0.15)] transition">
                <Icon className="w-6 h-6 text-teal-400" />
                <h3 className="mt-3 text-white font-semibold">{a.title}</h3>
                <p className="text-gray-400 text-sm">{a.price}</p>
                {a.desc && <p className="text-gray-400 text-sm mt-2">{a.desc}</p>}
                <button className="mt-4 w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Add to plan</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Invoice #</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Download</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ['Jan 1, 2025', 'INV-2025-001', 'Professional Plan', '€149.00', 'Paid'],
                  ['Dec 1, 2024', 'INV-2024-012', 'Professional Plan', '€149.00', 'Paid'],
                  ['Nov 1, 2024', 'INV-2024-011', 'Professional Plan', '€149.00', 'Paid'],
                ].map((r, i) => (
                  <tr key={i} className="border-t border-slate-700/30">
                    <td className="py-2 pr-4">{r[0]}</td>
                    <td className="py-2 pr-4">{r[1]}</td>
                    <td className="py-2 pr-4">{r[2]}</td>
                    <td className="py-2 pr-4">{r[3]}</td>
                    <td className="py-2 pr-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">{r[4]}</span></td>
                    <td className="py-2 pr-4 text-teal-400">Download</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-teal-400" />
              <div>
                <p className="text-white">Visa ending in 4242</p>
                <p className="text-sm text-gray-400">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Update card</button>
              <button className="text-gray-400 hover:text-white text-sm">Remove</button>
            </div>
          </div>
          <button className="mt-6 w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">+ Add payment method</button>
        </div>
      </div>
    </div>
  );

  // Team Tab
  const TeamTab = () => (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Members', value: '8', subtitle: 'of 15', progress: 53 },
          { label: 'Active Now', value: '3', subtitle: null, indicator: true },
          { label: 'Pending Invites', value: '2', subtitle: 'View invites' },
          { label: 'Roles', value: '4 types', subtitle: 'Manage roles' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
            <div className="space-y-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              {stat.progress && (
                <div className="w-full bg-slate-700/30 rounded-full h-1">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1 rounded-full" style={{ width: `${stat.progress}%` }} />
                </div>
              )}
              <p className="text-sm text-gray-400">{stat.label}</p>
              {stat.subtitle && <p className="text-xs text-teal-400 cursor-pointer hover:underline">{stat.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Team Members</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search members..."
              className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm placeholder-gray-400"
            />
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'active', isYou: true },
            { name: 'Sarah Jones', email: 'sarah@company.com', role: 'Editor', status: 'active' },
            { name: 'Mike Wilson', email: 'mike@company.com', role: 'Viewer', status: 'inactive' }
          ].map((member, idx) => (
            <div key={idx} className="bg-slate-800/30 rounded-lg p-6 border border-slate-600/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {member.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{member.name}</span>
                      {member.isYou && <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">You</span>}
                    </div>
                    <p className="text-sm text-gray-400">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'Admin' ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400' :
                        member.role === 'Editor' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {member.role}
                      </span>
                      <span className="text-xs text-gray-500">Member since Jan 2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors">
                    View Profile
                  </button>
                  <button 
                    onClick={() => { setSelectedMember(member); setShowEditMemberModal(true); }}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Edit Role
                  </button>
                  {!member.isYou && (
                    <button 
                      onClick={() => { setSelectedMember(member); setShowRemoveMemberModal(true); }}
                      className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <h2 className="text-xl font-semibold text-white mb-4">Pending Invitations</h2>
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 flex items-center justify-between">
          <div>
            <div className="text-white">sarah.jones@email.com</div>
            <div className="text-sm text-gray-400">Role: Editor • Invited: Jan 10, 2025 • Expires in 5 days</div>
          </div>
          <div className="flex gap-3 text-sm">
            <button className="text-teal-400 hover:underline">Resend</button>
            <button className="text-red-400 hover:text-red-300">Cancel</button>
          </div>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Roles & Permissions</h2>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Create Custom Role</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr><th className="py-2 pr-4">Permission</th><th className="py-2 pr-4">Admin</th><th className="py-2 pr-4">Editor</th><th className="py-2 pr-4">Viewer</th><th className="py-2 pr-4">Custom</th></tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                ['Create VAT returns','✓','✓','✗','?'],
                ['Edit VAT returns','✓','✓','✗','?'],
                ['Submit VAT returns','✓','✓','✗','?'],
                ['Delete VAT returns','✓','✗','✗','?'],
                ['View transactions','✓','✓','✓','?'],
                ['Upload transactions','✓','✓','✗','?'],
                ['Export reports','✓','✓','✓','?'],
                ['Invite members','✓','✗','✗','?'],
              ].map((row, i) => (
                <tr key={i} className="border-t border-slate-700/30">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Knowledge Tab
  const KnowledgeTab = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Overview */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30 flex items-start gap-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20">
          <Lightbulb className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Knowledge Base</h2>
          <p className="text-sm text-gray-400">The more you teach VATANA, the smarter it gets at handling your specific VAT scenarios.</p>
        </div>
      </div>

      {/* Custom Rules */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Custom VAT Rules</h3>
          </div>
          <button onClick={() => setShowRuleModal(true)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">+ Add Rule</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Digital Services - UK Customers', desc: 'Apply reverse charge for UK B2B digital services when customer provides valid VAT number', scope: 'Sales • Digital Products', country: 'United Kingdom', date: 'Dec 15, 2024', active: true },
            { name: 'EU B2C - Country Rate', desc: 'Use customer country rate for EU B2C digital services', scope: 'Sales • Digital Products', country: 'EU', date: 'Nov 02, 2024', active: true },
          ].map((r, i) => (
            <div key={i} className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <h4 className="text-white font-semibold">{r.name}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${r.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{r.active ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">{r.desc}</p>
              <div className="mt-3 text-xs text-gray-400">Applies to: {r.scope} • Countries: {r.country} • Created: {r.date}</div>
              <div className="mt-4 flex gap-3 text-sm">
                <button className="text-gray-300 hover:text-white">Edit</button>
                <button className="text-gray-300 hover:text-white">Duplicate</button>
                <button className="text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Custom Categories</h3>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">+ Add Category</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <h4 className="text-white font-semibold">Software as a Service (SaaS)</h4>
            <p className="text-sm text-gray-400 mt-1">Default VAT Rate: 20% (Standard)</p>
            <ul className="mt-3 text-sm text-gray-300 list-disc pl-5 space-y-1">
              <li>EU B2C: Use customer's country rate</li>
              <li>EU B2B: Reverse charge if VAT ID provided</li>
              <li>Non-EU: Zero-rated</li>
            </ul>
            <div className="text-xs text-gray-500 mt-3">Products in this category: 47</div>
            <div className="mt-4 flex gap-3 text-sm">
              <button className="text-gray-300 hover:text-white">Edit</button>
              <button className="text-gray-300 hover:text-white">View Products</button>
              <button className="text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
          <div className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <h4 className="text-white font-semibold">Consulting Services</h4>
            <p className="text-sm text-gray-400 mt-1">Default VAT Rate: 20% (Standard)</p>
            <div className="text-xs text-gray-500 mt-3">Products in this category: 12</div>
          </div>
        </div>
      </div>

      {/* Entity Profiles */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Entity Profiles</h3>
          <div className="flex gap-3">
            <input className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" placeholder="Search entities..." />
            <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">
              <option>All</option><option>Customers</option><option>Suppliers</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Acme Corporation Ltd.', vat: 'GB123456789', country: 'United Kingdom', type: 'B2B Customer', tx: 127, totalVat: '€45,280' },
            { name: 'Globex GmbH', vat: 'DE129384756', country: 'Germany', type: 'Supplier', tx: 74, totalVat: '€12,610' },
          ].map((e, i) => (
            <div key={i} className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <h4 className="text-white font-semibold">{e.name}</h4>
              <p className="text-sm text-gray-400 mt-1">VAT: {e.vat} <span className="text-green-400">✓ Verified</span></p>
              <p className="text-sm text-gray-400">Country: {e.country} • Type: {e.type}</p>
              <p className="text-sm text-gray-400 mt-2">Transactions: {e.tx} • Total VAT: {e.totalVat}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <button className="text-gray-300 hover:text-white">Edit Profile</button>
                <button className="text-teal-400 hover:underline">View History</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Templates */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Document Recognition Templates</h3>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">+ Create Template</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Invoice Template - Standard', status: 'Active', acc: '98%', docs: '1,247' },
            { title: 'Receipt Template - Simplified', status: 'Active', acc: '94%', docs: '832' },
            { title: 'Credit Note Template', status: 'Draft', acc: '—', docs: '—' },
          ].map((t, i) => (
            <div key={i} className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <h4 className="text-white font-semibold">{t.title}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{t.status}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">Accuracy: {t.acc} • Documents processed: {t.docs}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <button className="text-gray-300 hover:text-white">Edit</button>
                <button className="text-gray-300 hover:text-white">Test</button>
                <button className="text-gray-300 hover:text-white">Duplicate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Training Feedback */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Training Feedback</h3>
        <div className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <h4 className="text-white font-semibold">Transaction Classification</h4>
          <p className="text-sm text-gray-400 mt-1">Transaction: TXN-2024-12345 • Amount: €1,250.00</p>
          <div className="mt-3 text-sm text-gray-300">
            <p>AI Suggestion:</p>
            <p>Category: Digital Services • VAT Rate: 20% • Confidence: 87%</p>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg">✓ Correct</button>
            <button className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg">✗ Incorrect - Let me fix it</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Integrations Tab
  const IntegrationsTab = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Connected */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Connected Integrations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'QuickBooks Online', connected: 'Jan 10, 2024', last: '2 hours ago', syncing: ['Invoices (1,247)','Expenses (892)','Customers (156)'] },
            { name: 'Xero', connected: 'May 2, 2024', last: '1 day ago', syncing: ['Invoices','Contacts'] },
            { name: 'Stripe', connected: 'Feb 8, 2024', last: '3 hours ago', syncing: ['Payments'] },
          ].map((app, i) => (
            <div key={i} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{app.name}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Connected</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Connected: {app.connected} • Last sync: {app.last}</p>
              <div className="mt-3 text-sm text-gray-300">
                <p className="text-gray-400">Syncing:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {app.syncing.map(s => <li key={s}>✓ {s}</li>)}
                </ul>
              </div>
              <div className="mt-4 flex gap-3 text-sm">
                <button onClick={() => setShowConfigureModal(true)} className="text-gray-300 hover:text-white">Configure</button>
                <button className="text-gray-300 hover:text-white">Sync Now</button>
                <button className="text-red-400 hover:text-red-300">Disconnect</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Available Integrations</h2>
          <div className="flex gap-3">
            <input className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm" placeholder="Search integrations..." />
            <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm">
              <option>All</option><option>Accounting</option><option>Payments</option><option>E-commerce</option><option>Communication</option><option>CRM</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Sage','FreshBooks','Wave','Zoho Books','PayPal','Square','WooCommerce','Magento','BigCommerce','Salesforce','HubSpot','Zapier','Google Sheets','Dropbox'
          ].map((name) => (
            <div key={name} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
              <div className="text-white font-semibold">{name}</div>
              <p className="text-sm text-gray-400 mt-2">Connect to {name} to sync data</p>
              <button onClick={() => setShowConnectModal(true)} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Connect</button>
            </div>
          ))}
        </div>
      </div>

      {/* API Access */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">API Access</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Status: <span className="text-green-400 font-medium">Enabled</span></p>
            <p className="text-gray-400 text-sm">Usage: 45,280 of 100,000 calls</p>
            <div className="mt-2 w-64 bg-slate-700/30 rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{width:'45%'}} /></div>
          </div>
          <div className="text-sm text-teal-400">
            <a className="hover:underline" href="#">View API Documentation</a>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Production Key', key: 'pk_live_••••••••••••1234', created: 'Jan 10, 2024', last: '2 hours ago' },
            { name: 'Sandbox Key', key: 'pk_test_••••••••••••9876', created: 'Mar 22, 2024', last: '1 day ago' },
          ].map((k) => (
            <div key={k.key} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{k.name}</div>
                  <div className="text-gray-400">{k.key}</div>
                </div>
                <div className="flex gap-3">
                  <button className="text-gray-300 hover:text-white">Regenerate</button>
                  <button className="text-red-400 hover:text-red-300">Delete</button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Created: {k.created} • Last used: {k.last}</div>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">+ Create API Key</button>
      </div>

      {/* Sync Settings */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Synchronization Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 mb-2">Sync Frequency</p>
            {['Real-time','Every 15 minutes','Every hour','Every 6 hours','Daily','Manual only'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-gray-300">
                <input type="radio" name="syncfreq" defaultChecked={opt==='Every hour'} className="text-teal-400" /> {opt}
              </label>
            ))}
          </div>
          <div>
            <p className="text-gray-300 mb-2">Sync Direction</p>
            {['VATANA → Connected Apps','Connected Apps → VATANA','Two-way sync'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" defaultChecked={opt.includes('Two-way') || opt.includes('VATANA →')} className="text-teal-400" /> {opt}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Save Settings</button>
        </div>
      </div>
    </div>
  );

  // Compliance Tab
  const ComplianceTab = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Compliance Score', value: '98/100', status: 'Excellent', icon: Shield },
          { title: 'Active Registrations', value: '8 countries', status: 'All verified', icon: Globe },
          { title: 'Upcoming Deadlines', value: '3', status: 'Next: Jan 31, 2025', icon: Calendar },
          { title: 'Audit Readiness', value: 'Fully Prepared', status: 'Last audit: Jun 2024', icon: FileSearch },
        ].map((s, i) => {
          const Icon = s.icon as any;
          return (
            <div key={i} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-teal-400" />
                <div>
                  <div className="text-white font-semibold">{s.value}</div>
                  <div className="text-sm text-gray-400">{s.title}</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">{s.status}</div>
            </div>
          );
        })}
      </div>

      {/* VAT Registrations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">VAT Registrations</h2>
          <button onClick={() => setShowVatRegModal(true)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">+ Add Registration</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { country: 'United Kingdom', flag: '🇬🇧', vat: 'GB123456789', next: 'Jan 31, 2025 (12 days)' },
            { country: 'Germany', flag: '🇩🇪', vat: 'DE129384756', next: 'Feb 10, 2025 (22 days)' },
          ].map((r, i) => (
            <div key={i} className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{r.flag} {r.country}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Verified</span>
              </div>
              <p className="text-sm text-gray-300 mt-2">VAT Number: {r.vat}</p>
              <p className="text-sm text-gray-400">Next Return: {r.next}</p>
              <ul className="mt-3 text-sm text-gray-300 list-disc pl-5 space-y-1">
                <li>✓ VAT number valid</li>
                <li>✓ Registration up to date</li>
                <li>✓ All returns filed on time</li>
              </ul>
              <div className="mt-4 flex gap-3 text-sm">
                <button className="text-gray-300 hover:text-white">View Details</button>
                <button className="text-gray-300 hover:text-white">Update</button>
                <button className="text-gray-300 hover:text-white">Certificate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compliance Requirements</h3>
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">United Kingdom</div>
            <div className="text-sm text-gray-400">8/10 requirements met</div>
          </div>
          <div className="mt-3 w-full bg-slate-700/30 rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{width:'80%'}}/></div>
          <ul className="mt-4 text-sm text-gray-300 space-y-1">
            <li>✓ VAT registration active</li>
            <li>✓ Current VAT certificate on file</li>
            <li>✓ All returns filed for current year</li>
            <li>✓ No outstanding VAT payments</li>
            <li>⚠ Insurance certificate expires soon</li>
            <li>⏳ Annual audit due in 3 months</li>
          </ul>
        </div>
      </div>

      {/* Regulatory Updates */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Regulatory Updates</h3>
          <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white text-sm"><option>All Countries</option><option>UK</option><option>Germany</option></select>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">EU VAT Rate Changes 2025</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">Medium</span>
            </div>
            <p className="text-sm text-gray-400">Jan 5, 2025 • Affects: Germany, France</p>
            <p className="text-sm text-gray-300 mt-2">New reduced VAT rates take effect for specific product categories starting April 1, 2025.</p>
            <div className="mt-3 text-sm text-gray-400">Action required by: Mar 15, 2025</div>
            <div className="mt-3 flex gap-3 text-sm">
              <button className="text-teal-400 hover:underline">View Details</button>
              <button className="text-gray-300 hover:text-white">Mark as Read</button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Export Audit Log</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400"><tr><th className="py-2 pr-4">Timestamp</th><th className="py-2 pr-4">User</th><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Details</th><th className="py-2 pr-4">IP</th><th className="py-2 pr-4">Status</th></tr></thead>
            <tbody className="text-gray-300">
              <tr className="border-t border-slate-700/30"><td className="py-2 pr-4">Jan 15, 2025 14:30</td><td className="py-2 pr-4">John Doe</td><td className="py-2 pr-4">VAT Return Submitted</td><td className="py-2 pr-4">UK Q4 2024</td><td className="py-2 pr-4">82.45.67.89</td><td className="py-2 pr-4 text-green-400">Success</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Documents */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compliance Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Registration Certificates', count: 8, icon: Award, status: 'All current' },
            { title: 'Returns & Submissions', count: 52, icon: FileText, status: 'Complete' },
            { title: 'Audit Reports', count: 3, icon: FileSearch, status: 'Up to date' },
            { title: 'Compliance Letters', count: 12, icon: Mail, status: 'All addressed' },
            { title: 'Authority Correspondence', count: 7, icon: MessageSquare, status: 'Current' },
            { title: 'Proof of Submission', count: 52, icon: CheckCircle, status: 'All received' },
          ].map((d, i) => {
            const Icon = d.icon as any; 
            return (
              <div key={i} className="p-5 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-teal-400" />
                  <div className="text-white font-semibold">{d.title}</div>
                </div>
                <div className="text-sm text-gray-300 mt-2">Count: {d.count}</div>
                <div className="text-sm text-gray-400">Status: {d.status}</div>
                <div className="mt-3 flex gap-3 text-sm">
                  <button className="text-gray-300 hover:text-white">Upload</button>
                  <button className="text-gray-300 hover:text-white">Download All</button>
                  <button className="text-teal-400 hover:underline">Share</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Mobile Tab
  const MobileTab = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <h2 className="text-2xl font-bold text-white">VATANA on the Go</h2>
        <p className="text-gray-400 mt-2">Manage VAT compliance from anywhere with our mobile apps</p>
        <ul className="mt-4 text-sm text-gray-300 space-y-1">
          <li>✓ Upload receipts with camera</li>
          <li>✓ Approve transactions on the go</li>
          <li>✓ Get real-time notifications</li>
          <li>✓ View dashboards and reports</li>
          <li>✓ Biometric authentication</li>
        </ul>
        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">App Store</button>
          <button className="px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Google Play</button>
        </div>
      </div>

      {/* Mobile Settings */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Mobile App Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white">Push Notifications</div>
              <div className="text-sm text-gray-400">VAT deadlines, team activities, system alerts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Devices</h3>
        <div className="space-y-4">
          {[
            { name: 'iPhone 14 Pro', os: 'iOS 17.2 • VATANA v2.1.0', status: 'Current', location: 'London, UK', now: true },
            { name: 'Samsung Galaxy S23', os: 'Android 14 • VATANA v2.1.0', status: '', location: 'London, UK', now: false },
          ].map((d, i) => (
            <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{d.name} {d.status && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-teal-500/20 text-teal-400">{d.status}</span>}</div>
                <div className="text-sm text-gray-400">{d.os}</div>
                <div className="text-xs text-gray-500">Last active: {d.now ? 'Now' : '2 days ago'} • Location: {d.location}</div>
              </div>
              <button className="text-sm text-gray-300 hover:text-white">{d.now ? 'View Details' : 'Remove Device'}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Mode */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Offline Access</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white">Enable Offline Mode</div>
            <div className="text-sm text-gray-400">Access key features without internet</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
        <div className="mt-4 text-sm text-gray-300">
          <div>Data to Cache:</div>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Recent transactions (last 30 days)</li>
            <li>Current period VAT returns</li>
            <li>Team members</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Security Tab
  const SecurityTab = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Security Score */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 mb-4">
            <Shield className="w-12 h-12 text-teal-400" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">92/100</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            Strong Security
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Authentication', score: 95, status: 'good' },
            { label: 'Access Control', score: 90, status: 'good' },
            { label: 'Data Protection', score: 95, status: 'good' },
            { label: 'Monitoring', score: 88, status: 'warning' }
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold text-white">{item.score}/100</div>
              <div className="text-sm text-gray-400">{item.label}</div>
              <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${item.status === 'good' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Enable 2FA for all team members (2 pending)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>All other checks passed</span>
          </div>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <h2 className="text-xl font-semibold text-white mb-6">Authentication</h2>
        
        <div className="space-y-6">
          {/* Password Settings */}
          <div>
            <h3 className="font-medium text-white mb-3">Password Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-300">Current Password Strength:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-32 bg-slate-700/30 rounded-full h-2">
                      <div className="w-full bg-green-400 h-2 rounded-full" />
                    </div>
                    <span className="text-sm text-green-400">Strong</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-lg border border-slate-600/30 transition-colors"
                >
                  Change Password
                </button>
              </div>
              <p className="text-sm text-gray-400">Last changed: 45 days ago</p>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div>
            <h3 className="font-medium text-white mb-3">Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <span className="text-white">Authenticator App</span>
                    <p className="text-sm text-gray-400">Primary method</p>
                  </div>
                </div>
                <div className="text-green-400 text-sm font-medium">Enabled</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                  <div>
                    <span className="text-white">SMS</span>
                    <p className="text-sm text-gray-400">+44 •••• 1234</p>
                  </div>
                </div>
                <button className="text-teal-400 text-sm hover:underline">Enable</button>
              </div>

              <button className="text-teal-400 text-sm hover:underline">View Backup Codes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Active Sessions</h2>
          <button className="text-red-400 text-sm hover:underline">End All Other Sessions</button>
        </div>

        <div className="space-y-4">
          {[
            { device: 'MacBook Pro', browser: 'Safari 17', os: 'macOS Sonoma', location: 'London, UK', ip: '82.45.67.89', current: true },
            { device: 'iPhone 14 Pro', browser: 'VATANA App', os: 'iOS 17.2', location: 'London, UK', ip: '82.45.67.90', current: false }
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  {session.device.includes('iPhone') ? <Smartphone className="w-5 h-5 text-gray-400" /> : <Monitor className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{session.device}</span>
                    {session.current && <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full">Current</span>}
                  </div>
                  <p className="text-sm text-gray-400">{session.browser} • {session.os}</p>
                  <p className="text-xs text-gray-500">{session.location} • {session.ip}</p>
                  <p className="text-xs text-gray-500">Last active: {session.current ? 'Just now' : '2 hours ago'}</p>
                </div>
              </div>
              {!session.current && (
                <button className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  End Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Notifications Tab
  const NotificationsTab = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Notification Categories */}
      <div className="space-y-6">
        {[
          {
            title: 'VAT & Compliance',
            description: 'VAT returns, deadlines, and compliance updates',
            notifications: [
              { name: 'VAT Return Due', description: 'Reminder when VAT return deadline approaches', email: true, inApp: true, push: false },
              { name: 'VAT Return Submitted', description: 'Confirmation when return is filed', email: true, inApp: true, push: false },
              { name: 'Validation Issues', description: 'Alert when transactions need attention', email: true, inApp: true, push: false },
            ]
          },
          {
            title: 'Team Activity',
            description: 'Team member updates and collaboration',
            notifications: [
              { name: 'New Team Member', description: 'When someone joins team', email: true, inApp: true, push: false },
              { name: 'Comments & Mentions', description: 'When someone @mentions you', email: true, inApp: true, push: true },
              { name: 'Task Assignments', description: 'When task assigned to you', email: true, inApp: true, push: true },
            ]
          },
          {
            title: 'Reports & Analytics',
            description: 'Report generation and anomalies',
            notifications: [
              { name: 'Scheduled Reports', description: 'When scheduled report ready', email: true, inApp: true, push: false },
              { name: 'Anomaly Detection', description: 'Unusual patterns detected', email: true, inApp: true, push: true },
            ]
          },
          {
            title: 'System & Security',
            description: 'Security alerts and system notifications',
            notifications: [
              { name: 'Security Alerts', description: 'Login from new device, suspicious activity', email: true, inApp: true, push: true },
              { name: 'System Maintenance', description: 'Scheduled downtime', email: true, inApp: true, push: false },
              { name: 'Integration Sync', description: 'Sync completions and errors', email: true, inApp: true, push: false },
            ]
          },
          {
            title: 'Account & Billing',
            description: 'Billing reminders and payments',
            notifications: [
              { name: 'Billing Reminders', description: 'Upcoming payment due', email: true, inApp: true, push: false },
              { name: 'Payment Failures', description: 'Failed payment attempts', email: true, inApp: true, push: true },
            ]
          },
          {
            title: 'Product Updates',
            description: 'New features and updates',
            notifications: [
              { name: 'New Features', description: 'New functionality available', email: true, inApp: true, push: false },
              { name: 'Feature Updates', description: 'Changes to existing features', email: false, inApp: true, push: false },
            ]
          }
        ].map((category) => (
          <div key={category.title} className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/30">
            <div className="p-6 border-b border-slate-700/30">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
                <button className="text-teal-400 text-sm hover:underline">All on/off</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {category.notifications.map((notification) => (
                <div key={notification.name} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{notification.name}</h4>
                    <p className="text-sm text-gray-400">{notification.description}</p>
                  </div>
                  <div className="flex gap-6 ml-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={notification.email} className="text-teal-400" />
                      <span className="text-sm text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={notification.inApp} className="text-teal-400" />
                      <span className="text-sm text-gray-300">In-app</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={notification.push} className="text-teal-400" />
                      <span className="text-sm text-gray-300">Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notification Delivery */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <h2 className="text-xl font-semibold text-white mb-6">Delivery Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-white mb-3">Email Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Frequency</label>
                <div className="space-y-2">
                  {['Real-time (as they happen)', 'Hourly digest', 'Daily digest at 9:00 AM', 'Weekly digest on Monday'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="emailFrequency" defaultChecked={option.includes('Daily')} className="text-teal-400" />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-3">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-white">Quiet Hours</span>
                  <p className="text-sm text-gray-400">10:00 PM - 7:00 AM</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Do Not Disturb */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <h2 className="text-xl font-semibold text-white mb-6">Do Not Disturb</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white">Enable Do Not Disturb</div>
            <div className="text-sm text-gray-400">Mutes all non-critical notifications</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-teal-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Snooze for 1 hour</button>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Snooze until tomorrow</button>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Snooze for 1 week</button>
        </div>
      </div>

      {/* Notification Center */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Notifications</h2>
          <div className="flex gap-3 text-sm">
            <button className="text-teal-400 hover:underline">Mark all as read</button>
            <button className="text-gray-300 hover:text-white">Clear all</button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { title: 'VAT Return Due Soon', desc: 'Your UK Q4 2024 return is due in 7 days', time: 'Jan 15, 2025 at 9:00 AM' },
            { title: 'Report Generated', desc: 'Monthly Summary report is ready to download', time: 'Jan 14, 2025 at 4:20 PM' },
          ].map((n, i) => (
            <div key={i} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="text-white font-medium">{n.title}</div>
              <div className="text-sm text-gray-300">{n.desc}</div>
              <div className="text-xs text-gray-500 mt-1">{n.time}</div>
              <div className="mt-3 flex gap-3 text-sm">
                <button className="text-teal-400 hover:underline">View</button>
                <button className="text-gray-300 hover:text-white">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-8 border border-slate-700/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Notification History</h2>
          <button className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Export as CSV</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400"><tr><th className="py-2 pr-4">Date/Time</th><th className="py-2 pr-4">Type</hth><th className="py-2 pr-4">Title</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Action</th></tr></thead>
            <tbody className="text-gray-300">
              <tr className="border-t border-slate-700/30"><td className="py-2 pr-4">Jan 15, 2025 09:00</td><td className="py-2 pr-4">VAT & Compliance</td><td className="py-2 pr-4">VAT Return Due Soon</td><td className="py-2 pr-4">Unread</td><td className="py-2 pr-4 text-teal-400">Open</td></tr>
              <tr className="border-t border-slate-700/30"><td className="py-2 pr-4">Jan 14, 2025 16:20</td><td className="py-2 pr-4">Reports</td><td className="py-2 pr-4">Report Generated</td><td className="py-2 pr-4">Read</td><td className="py-2 pr-4 text-teal-400">Open</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Password Change Modal
  const PasswordModal = () => (
    showPasswordModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Invite Member Modal
  const InviteModal = () => (
    showInviteModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="sarah.jones@email.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Role</label>
              <div className="space-y-2">
                {['Admin', 'Editor', 'Viewer'].map((role) => (
                  <label key={role} className="flex items-start gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <input type="radio" name="role" defaultChecked={role === 'Editor'} className="text-teal-400 mt-1" />
                    <div>
                      <span className="text-white font-medium">{role}</span>
                      <p className="text-sm text-gray-400">
                        {role === 'Admin' && 'Full access to all features'}
                        {role === 'Editor' && 'Can create and edit VAT returns'}
                        {role === 'Viewer' && 'Read-only access'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Plan Change Modal
  const PlanChangeModal = () => (
    showPlanModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Change Plan</h2>
            <button onClick={() => { setShowPlanModal(false); setPlanStep(1); }} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {planStep === 1 && (
            <div className="space-y-4">
              <p className="text-gray-300">You're changing from <span className="font-medium text-white">Professional</span> to <span className="font-medium text-white">Starter</span>.</p>
              <p className="text-sm text-gray-400">Price difference will be prorated.</p>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" className="text-teal-400" /> I understand the terms
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setShowPlanModal(false); setPlanStep(1); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setPlanStep(2)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Confirm</button>
              </div>
            </div>
          )}
          {planStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-300">Payment summary • Final charge: €0.00 (prorated)</p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setShowPlanModal(false); setPlanStep(1); }} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button onClick={() => setPlanStep(3)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Confirm & Pay</button>
              </div>
            </div>
          )}
          {planStep === 3 && (
            <div className="text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
              <div className="text-white font-semibold">Plan updated successfully!</div>
              <button onClick={() => { setShowPlanModal(false); setPlanStep(1); }} className="mt-2 px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white">Close</button>
            </div>
          )}
        </div>
      </div>
    )
  );

  // Add Rule Modal
  const AddRuleModal = () => (
    showRuleModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-xl mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Add Custom Rule</h2>
            <button onClick={() => setShowRuleModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <input className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white" placeholder="Rule name" />
            <textarea className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white" placeholder="Description" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white"><option>Category</option></select>
              <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white"><option>Priority</option></select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowRuleModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={() => setShowRuleModal(false)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Save Rule</button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Connect Integration Modal
  const ConnectIntegrationModal = () => (
    showConnectModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Connect Integration</h2>
            <button onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <p className="text-gray-300">You will be redirected to the provider to authenticate and grant permissions.</p>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowConnectModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={() => setShowConnectModal(false)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Continue</button>
          </div>
        </div>
      </div>
    )
  );

  // Configure Integration Modal
  const ConfigureIntegrationModal = () => (
    showConfigureModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-2xl mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Configure Integration</h2>
            <button onClick={() => setShowConfigureModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-medium mb-2">Map Fields</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-gray-300">Invoice Number</span><select className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded text-white"><option>invoice_no</option></select></div>
                <div className="flex items-center justify-between"><span className="text-gray-300">Date</span><select className="px-2 py-1 bg-slate-800/50 border border-slate-600/30 rounded text-white"><option>date</option></select></div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Sync Options</h3>
              {['Import existing data on first sync','Sync only invoices over €100','Two-way sync'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" className="text-teal-400"/> {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowConfigureModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={() => setShowConfigureModal(false)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </div>
    )
  );

  // Add VAT Registration Modal
  const AddVatRegistrationModal = () => (
    showVatRegModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-2xl mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Add VAT Registration</h2>
            <button onClick={() => setShowVatRegModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white"><option>Country</option></select>
            <input className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white" placeholder="VAT Number" />
            <input className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white" placeholder="Registration date" />
            <select className="px-3 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white"><option>Authority</option></select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowVatRegModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button onClick={() => setShowVatRegModal(false)} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </div>
    )
  );

  // Edit Member Modal
  const EditMemberModal = () => (
    showEditMemberModal && selectedMember && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Member Role</h2>
            <button onClick={() => { setShowEditMemberModal(false); setSelectedMember(null); }} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Member Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-medium">{selectedMember.name}</div>
                <div className="text-sm text-gray-400">{selectedMember.email}</div>
              </div>
            </div>

            {/* Current Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Role</label>
              <div className="px-4 py-3 bg-slate-800/50 rounded-lg text-gray-400">
                {selectedMember.role}
              </div>
            </div>

            {/* New Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Change Role To</label>
              <div className="space-y-2">
                {['Admin', 'Editor', 'Viewer'].filter(role => role !== selectedMember.role).map((role) => (
                  <label key={role} className="flex items-start gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <input type="radio" name="newRole" className="text-teal-400 mt-1" />
                    <div>
                      <span className="text-white font-medium">{role}</span>
                      <p className="text-sm text-gray-400">
                        {role === 'Admin' && 'Full access to all features'}
                        {role === 'Editor' && 'Can create and edit VAT returns'}
                        {role === 'Viewer' && 'Read-only access'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Permissions */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="text-teal-400" />
                <span className="text-sm text-gray-300">Custom permissions (override role defaults)</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => { setShowEditMemberModal(false); setSelectedMember(null); }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { setShowEditMemberModal(false); setSelectedMember(null); }}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Remove Member Modal
  const RemoveMemberModal = () => (
    showRemoveMemberModal && selectedMember && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-xl p-8 w-full max-w-lg mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Remove Team Member</h2>
            <button onClick={() => { setShowRemoveMemberModal(false); setSelectedMember(null); }} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            {/* Member Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Remove {selectedMember.name}?</h3>
              <p className="text-gray-400">Are you sure you want to remove <strong>{selectedMember.name}</strong> from your team?</p>
            </div>

            {/* Consequences */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">This will:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Remove their access to VATANA immediately</li>
                <li>• Preserve their historical data and contributions</li>
                <li>• Send them a notification about the removal</li>
                <li>• Allow you to re-invite them later if needed</li>
              </ul>
            </div>

            {/* Confirmation */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="text-red-400" />
                <span className="text-sm text-gray-300">I understand this will revoke all access for {selectedMember.name}</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => { setShowRemoveMemberModal(false); setSelectedMember(null); }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { setShowRemoveMemberModal(false); setSelectedMember(null); }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account': return <AccountTab />;
      case 'usage': return <UsageTab />;
      case 'upgrade': return <UpgradeTab />;
      case 'team': return <TeamTab />;
      case 'knowledge': return <KnowledgeTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'compliance': return <ComplianceTab />;
      case 'mobile': return <MobileTab />;
      case 'security': return <SecurityTab />;
      case 'notifications': return <NotificationsTab />;
      default: return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
          <p className="text-gray-400">This section is coming soon.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
      <TopBar />
      <TabNavigation />
      <div className="px-8 pb-12">
        {renderTabContent()}
      </div>
      <PasswordModal />
      <InviteModal />
      <PlanChangeModal />
      <AddRuleModal />
      <ConnectIntegrationModal />
      <ConfigureIntegrationModal />
      <AddVatRegistrationModal />
      <EditMemberModal />
      <RemoveMemberModal />
    </div>
  );
};

// Missing Monitor component for device sessions
const Monitor = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export default SettingsPage;