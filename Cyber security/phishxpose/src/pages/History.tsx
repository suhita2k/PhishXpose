import { useState, useEffect } from 'react';
import { History as HistoryIcon, Link2, Mail, CheckCircle, AlertTriangle, XCircle, Trash2, Search, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getScanHistory } from '../utils/phishingDetector';
import { ScanResult } from '../types';
import { AlertModal } from '../components/AlertModal';

export function History() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'url' | 'email'>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'safe' | 'suspicious' | 'phishing'>('all');
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const data = getScanHistory(user?.id);
    setHistory(data);
    setFilteredHistory(data);
  }, [user]);

  useEffect(() => {
    let filtered = history;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.input.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    if (filterResult !== 'all') {
      filtered = filtered.filter(item => item.result === filterResult);
    }
    
    setFilteredHistory(filtered);
  }, [history, searchTerm, filterType, filterResult]);

  const clearHistory = () => {
    localStorage.setItem('phishxpose_history', '[]');
    setHistory([]);
    setFilteredHistory([]);
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'safe':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'phishing':
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getResultBadge = (result: string) => {
    const styles = {
      safe: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      suspicious: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      phishing: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[result as keyof typeof styles];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-cyan-400" />
            {t('history')}
          </h1>
          <p className="text-gray-400 mt-1">View your past scans and detected threats</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scans..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'url' | 'email')}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="url">URL Scans</option>
            <option value="email">Email Scans</option>
          </select>
        </div>

        {/* Result Filter */}
        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value as 'all' | 'safe' | 'suspicious' | 'phishing')}
          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Results</option>
          <option value="safe">Safe Only</option>
          <option value="suspicious">Suspicious Only</option>
          <option value="phishing">Phishing Only</option>
        </select>
      </div>

      {/* Results */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gray-800/30 border border-gray-700/50">
          <HistoryIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Scan History</h3>
          <p className="text-gray-500">
            {history.length === 0 
              ? 'Start scanning URLs and emails to see your history here'
              : 'No results match your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setSelectedResult(scan)}
              className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-800/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${
                  scan.type === 'url' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                }`}>
                  {scan.type === 'url' 
                    ? <Link2 className="h-5 w-5 text-purple-400" />
                    : <Mail className="h-5 w-5 text-blue-400" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-lg border text-xs font-medium ${getResultBadge(scan.result)}`}>
                      {scan.result.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 truncate group-hover:text-white transition-colors">
                    {scan.input.length > 100 ? `${scan.input.substring(0, 100)}...` : scan.input}
                  </p>
                  {scan.riskFactors.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {scan.riskFactors.length} risk factor{scan.riskFactors.length > 1 ? 's' : ''} detected
                    </p>
                  )}
                </div>

                {/* Result Icon */}
                <div className="flex-shrink-0">
                  {getResultIcon(scan.result)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {history.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {history.filter(h => h.result === 'safe').length}
            </p>
            <p className="text-sm text-gray-400">{t('safe')}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {history.filter(h => h.result === 'suspicious').length}
            </p>
            <p className="text-sm text-gray-400">{t('suspicious')}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-2xl font-bold text-red-400">
              {history.filter(h => h.result === 'phishing').length}
            </p>
            <p className="text-sm text-gray-400">{t('phishing')}</p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedResult && (
        <AlertModal result={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  );
}
