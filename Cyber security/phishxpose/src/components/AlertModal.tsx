import { AlertTriangle, CheckCircle, XCircle, X, Shield, Lightbulb } from 'lucide-react';
import { ScanResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AlertModalProps {
  result: ScanResult;
  onClose: () => void;
}

const safetyTips = [
  "Always verify the sender's email address carefully",
  "Hover over links before clicking to see the actual URL",
  "Never share passwords or sensitive information via email",
  "Look for HTTPS and a padlock icon in your browser",
  "Be wary of urgent requests or threats in messages",
  "When in doubt, contact the company directly through official channels",
  "Enable two-factor authentication on all accounts",
  "Keep your software and antivirus up to date",
];

export function AlertModal({ result, onClose }: AlertModalProps) {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (result.result) {
      case 'safe':
        return {
          icon: CheckCircle,
          color: 'emerald',
          bgGradient: 'from-emerald-500/20 to-green-500/20',
          borderColor: 'border-emerald-500/30',
          iconColor: 'text-emerald-400',
          title: t('safe'),
          message: 'This appears to be legitimate and safe.',
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          color: 'amber',
          bgGradient: 'from-amber-500/20 to-orange-500/20',
          borderColor: 'border-amber-500/30',
          iconColor: 'text-amber-400',
          title: t('suspicious'),
          message: 'Proceed with caution. Some red flags detected.',
        };
      case 'phishing':
        return {
          icon: XCircle,
          color: 'red',
          bgGradient: 'from-red-500/20 to-rose-500/20',
          borderColor: 'border-red-500/30',
          iconColor: 'text-red-400',
          title: t('phishing'),
          message: 'High risk of phishing attack detected!',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const randomTips = safetyTips.sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl bg-gradient-to-b ${config.bgGradient} border ${config.borderColor} bg-gray-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}>
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${config.bgGradient}`}>
              <Icon className={`h-10 w-10 ${config.iconColor}`} />
              {result.result === 'phishing' && (
                <div className="absolute inset-0 animate-ping rounded-2xl bg-red-500/30" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${config.iconColor}`}>
                {config.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{config.message}</p>
            </div>
          </div>

          {/* Threat Score */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Threat Score</span>
              <span className={`text-lg font-bold ${config.iconColor}`}>
                {result.score}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.result === 'safe' ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  result.result === 'suspicious' ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                  'bg-gradient-to-r from-red-500 to-rose-400'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        {result.riskFactors.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
              <Shield className="h-4 w-4 text-cyan-400" />
              {t('riskFactors')}
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
              {result.riskFactors.map((factor, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    factor.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    factor.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-gray-500/10 border-gray-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      factor.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                      factor.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {factor.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{factor.category}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="px-6 pb-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            {t('safetyTips')}
          </h3>
          <ul className="space-y-2">
            {randomTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-cyan-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
