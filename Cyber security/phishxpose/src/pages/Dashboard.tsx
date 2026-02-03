import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { getStatistics } from '../utils/phishingDetector';
import { DashboardStats } from '../types';

export function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const data = getStatistics();
    setStats(data);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Safe', value: stats.safeUrls, color: '#10b981' },
    { name: 'Suspicious', value: stats.suspiciousUrls, color: '#f59e0b' },
    { name: 'Phishing', value: stats.phishingDetected, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const statCards = [
    {
      label: t('totalScans'),
      value: stats.totalScans,
      icon: Scan,
      color: 'cyan',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      label: t('threatsDetected'),
      value: stats.phishingDetected,
      icon: ShieldAlert,
      color: 'red',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      iconColor: 'text-red-400',
    },
    {
      label: 'Safe URLs',
      value: stats.safeUrls,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Suspicious',
      value: stats.suspiciousUrls,
      icon: AlertTriangle,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-cyan-400" />
          {t('dashboard')}
        </h1>
        <p className="text-gray-400 mt-1">Monitor your security analytics and threat detection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-5 rounded-xl ${card.bgColor} border ${card.borderColor} hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              Scan Activity (Last 7 Days)
            </h3>
          </div>
          
          {stats.dailyStats.some(d => d.scans > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.dailyStats}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorScans)"
                  name="Total Scans"
                />
                <Area 
                  type="monotone" 
                  dataKey="phishing" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorPhishing)"
                  name="Phishing Detected"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Activity className="h-12 w-12 mb-3 opacity-50" />
              <p>No activity data yet</p>
              <p className="text-sm">Start scanning to see your activity</p>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Threat Distribution</h3>
          
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-400">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>No data to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-cyan-400" />
          {t('recentActivity')}
        </h3>
        
        {stats.recentScans.length > 0 ? (
          <div className="space-y-3">
            {stats.recentScans.slice(0, 5).map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    scan.result === 'safe' ? 'bg-emerald-400' :
                    scan.result === 'suspicious' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-gray-300 text-sm truncate max-w-md">
                      {scan.input.substring(0, 50)}{scan.input.length > 50 ? '...' : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {scan.type.toUpperCase()} • {new Date(scan.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  scan.result === 'safe' ? 'bg-emerald-500/20 text-emerald-400' :
                  scan.result === 'suspicious' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {scan.result.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
