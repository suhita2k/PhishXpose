import { useState } from 'react';
import { Link2, Mail, Scan, Loader2, Shield, Zap, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { performScan } from '../utils/phishingDetector';
import { ScanResult } from '../types';
import { AlertModal } from '../components/AlertModal';

export function Scanner() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'url' | 'email'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async () => {
    const input = activeTab === 'url' ? urlInput : emailInput;
    if (!input.trim()) return;

    setIsScanning(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scanResult = performScan(activeTab, input.trim(), user?.id || 'anonymous');
    setResult(scanResult);
    setIsScanning(false);
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-cyan-400">AI-Powered Detection Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Scan for <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Phishing Threats</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Protect yourself from cyber attacks. Our advanced AI analyzes URLs and emails in real-time to detect phishing attempts.
        </p>
      </div>

      {/* Scanner Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-cyan-500/20 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5" />
        
        {/* Tabs */}
        <div className="relative flex border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-medium transition-all ${
              activeTab === 'url'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Link2 className="h-5 w-5" />
            {t('urlScan')}
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 flex items-center justify-center gap-3 py-5 text-sm font-medium transition-all ${
              activeTab === 'email'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="h-5 w-5" />
            {t('emailScan')}
          </button>
        </div>

        {/* Input Area */}
        <div className="relative p-6">
          {activeTab === 'url' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t('enterUrl')}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>
          ) : (
            <textarea
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={t('enterEmail')}
              rows={8}
              className="w-full px-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
          )}

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={isScanning || (activeTab === 'url' ? !urlInput.trim() : !emailInput.trim())}
            className="mt-6 w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              <>
                <Scan className="h-6 w-6" />
                {t('checkSafety')}
              </>
            )}
          </button>
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent animate-pulse" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Real-Time Analysis</h3>
          <p className="text-sm text-gray-400">Instant threat detection using advanced pattern recognition</p>
        </div>
        <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-sm text-gray-400">Machine learning model that improves with every scan</p>
        </div>
        <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-purple-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Privacy First</h3>
          <p className="text-sm text-gray-400">Your data is encrypted and never shared with third parties</p>
        </div>
      </div>

      {/* Alert Modal */}
      {showModal && result && (
        <AlertModal result={result} onClose={() => setShowModal(false)} />
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
