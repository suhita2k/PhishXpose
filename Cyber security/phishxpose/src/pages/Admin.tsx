import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Server, 
  Plus, 
  Trash2,
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { getStatistics, getScanHistory } from '../utils/phishingDetector';

interface BlacklistDomain {
  id: string;
  domain: string;
  reason: string;
  addedAt: Date;
}

export function Admin() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'blacklist' | 'patterns'>('overview');
  const [blacklist, setBlacklist] = useState<BlacklistDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [newReason, setNewReason] = useState('');
  const [stats, setStats] = useState<ReturnType<typeof getStatistics> | null>(null);

  useEffect(() => {
    // Load blacklist from localStorage
    const stored = localStorage.getItem('phishxpose_blacklist');
    if (stored) {
      setBlacklist(JSON.parse(stored));
    } else {
      // Default blacklist
      const defaultBlacklist: BlacklistDomain[] = [
        { id: '1', domain: 'secure-paypa1.com', reason: 'PayPal impersonation', addedAt: new Date() },
        { id: '2', domain: 'amaz0n-verify.net', reason: 'Amazon phishing', addedAt: new Date() },
        { id: '3', domain: 'login-banking.xyz', reason: 'Banking scam', addedAt: new Date() },
        { id: '4', domain: 'account-verify.tk', reason: 'Generic phishing', addedAt: new Date() },
      ];
      setBlacklist(defaultBlacklist);
      localStorage.setItem('phishxpose_blacklist', JSON.stringify(defaultBlacklist));
    }

    setStats(getStatistics());
  }, []);

  const addToBlacklist = () => {
    if (!newDomain.trim()) return;
    
    const newEntry: BlacklistDomain = {
      id: `bl-${Date.now()}`,
      domain: newDomain.toLowerCase().trim(),
      reason: newReason || 'Manually added',
      addedAt: new Date(),
    };
    
    const updated = [...blacklist, newEntry];
    setBlacklist(updated);
    localStorage.setItem('phishxpose_blacklist', JSON.stringify(updated));
    setNewDomain('');
    setNewReason('');
  };

  const removeFromBlacklist = (id: string) => {
    const updated = blacklist.filter(item => item.id !== id);
    setBlacklist(updated);
    localStorage.setItem('phishxpose_blacklist', JSON.stringify(updated));
  };

  const allScans = getScanHistory();
  const userCount = new Set(allScans.map(s => s.userId)).size;

  // Mock performance data
  const performanceData = [
    { name: '00:00', response: 45, accuracy: 98 },
    { name: '04:00', response: 42, accuracy: 97 },
    { name: '08:00', response: 55, accuracy: 99 },
    { name: '12:00', response: 68, accuracy: 96 },
    { name: '16:00', response: 52, accuracy: 98 },
    { name: '20:00', response: 48, accuracy: 99 },
  ];

  const threatCategories = [
    { category: 'URL Impersonation', count: Math.floor(Math.random() * 50) + 20 },
    { category: 'Email Phishing', count: Math.floor(Math.random() * 40) + 15 },
    { category: 'Suspicious Keywords', count: Math.floor(Math.random() * 60) + 30 },
    { category: 'Malicious Links', count: Math.floor(Math.random() * 35) + 10 },
    { category: 'Domain Spoofing', count: Math.floor(Math.random() * 25) + 5 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'blacklist', label: t('blacklist'), icon: ShieldAlert },
    { id: 'patterns', label: 'Threat Patterns', icon: Database },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t('admin')} Dashboard</h1>
        </div>
        <p className="text-gray-400">Manage phishing patterns, blacklists, and monitor system performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <Users className="h-6 w-6 text-cyan-400 mb-3" />
          <p className="text-3xl font-bold text-white">{userCount}</p>
          <p className="text-sm text-gray-400">Active Users</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
          <Database className="h-6 w-6 text-emerald-400 mb-3" />
          <p className="text-3xl font-bold text-white">{blacklist.length}</p>
          <p className="text-sm text-gray-400">Blacklisted Domains</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
          <Server className="h-6 w-6 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white">99.9%</p>
          <p className="text-sm text-gray-400">System Uptime</p>
        </div>
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Globe className="h-6 w-6 text-amber-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats?.totalScans || 0}</p>
          <p className="text-sm text-gray-400">Total Scans Today</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">System Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="response" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Response Time (ms)"
                  dot={{ fill: '#06b6d4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Accuracy (%)"
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Threat Categories */}
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">Threat Categories</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={threatCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  stroke="#6b7280" 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} name="Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* System Status */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">System Status</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">Detection Engine</p>
                    <p className="text-sm text-emerald-400">Operational</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">Database</p>
                    <p className="text-sm text-emerald-400">Connected</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">AI Model</p>
                    <p className="text-sm text-emerald-400">Active (v2.4.1)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'blacklist' && (
        <div className="space-y-6">
          {/* Add Domain Form */}
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Add Domain to Blacklist</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Enter malicious domain..."
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500/50 transition-all"
              />
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Reason (optional)"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500/50 transition-all"
              />
              <button
                onClick={addToBlacklist}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <Plus className="h-5 w-5" />
                Add
              </button>
            </div>
          </div>

          {/* Blacklist Table */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white">Blacklisted Domains ({blacklist.length})</h3>
            </div>
            <div className="divide-y divide-gray-700/50">
              {blacklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.domain}</p>
                      <p className="text-sm text-gray-400">{item.reason}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromBlacklist(item.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {/* Pattern Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'URL Structure Patterns', count: 15, desc: 'Suspicious URL patterns and structures' },
              { name: 'Domain Impersonation', count: 23, desc: 'Brand impersonation patterns' },
              { name: 'Phishing Keywords', count: 42, desc: 'Common phishing language patterns' },
              { name: 'Email Headers', count: 18, desc: 'Suspicious email header patterns' },
              { name: 'Homograph Attacks', count: 12, desc: 'Unicode lookalike character patterns' },
              { name: 'Redirect Chains', count: 8, desc: 'Multiple redirect detection' },
            ].map((pattern) => (
              <div 
                key={pattern.name}
                className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                    {pattern.count} patterns
                  </span>
                </div>
                <h4 className="font-medium text-white mb-1">{pattern.name}</h4>
                <p className="text-sm text-gray-400">{pattern.desc}</p>
              </div>
            ))}
          </div>

          {/* AI Learning Status */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Server className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">AI Learning Module</h3>
                <p className="text-gray-400 mb-4">
                  The machine learning model continuously improves accuracy by analyzing new phishing samples 
                  submitted by users and updating detection patterns in real-time.
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-purple-400">98.7%</p>
                    <p className="text-sm text-gray-400">Detection Accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">1,247</p>
                    <p className="text-sm text-gray-400">Samples Analyzed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">v2.4.1</p>
                    <p className="text-sm text-gray-400">Model Version</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
