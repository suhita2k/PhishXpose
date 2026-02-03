import { Link } from 'react-router-dom';
import { 
  Shield, 
  Scan, 
  Zap, 
  Lock, 
  Globe, 
  Users, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Mail,
  Link2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Home() {
  useLanguage(); // For language context availability

  const features = [
    {
      icon: Scan,
      title: 'Real-Time Detection',
      description: 'Instantly analyze URLs and emails for phishing threats with our advanced detection engine.',
      color: 'cyan',
    },
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Machine learning model that continuously improves accuracy by learning from new threats.',
      color: 'amber',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared. We prioritize your security and privacy.',
      color: 'purple',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Access PhishXpose in multiple languages for global cybersecurity protection.',
      color: 'emerald',
    },
    {
      icon: AlertTriangle,
      title: 'Instant Alerts',
      description: 'Receive immediate warnings with detailed explanations when threats are detected.',
      color: 'red',
    },
    {
      icon: Users,
      title: 'User Education',
      description: 'Learn about phishing tactics with safety tips and awareness guidance.',
      color: 'blue',
    },
  ];

  const stats = [
    { value: '99.8%', label: 'Detection Rate' },
    { value: '<50ms', label: 'Response Time' },
    { value: '10M+', label: 'Threats Blocked' },
    { value: '24/7', label: 'Protection' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-20 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-cyan-400">AI-Powered Cybersecurity Protection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Protect Yourself From
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Phishing Attacks
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            PhishXpose uses advanced AI to detect phishing emails and malicious URLs in real-time. 
            Stay protected with instant alerts, detailed threat analysis, and educational insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scanner"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              <Scan className="h-5 w-5" />
              Start Scanning
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Demo */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="relative rounded-2xl bg-gray-800/50 border border-cyan-500/20 p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5" />
              <div className="relative flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Link2 className="h-4 w-4" />
                    Example scan
                  </div>
                  <p className="text-gray-300 font-mono text-sm">
                    https://secure-paypa1.com/login
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-medium">Phishing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 border-y border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comprehensive Protection Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to stay safe from phishing attacks and cyber threats
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:border-${feature.color}-500/30 transition-all hover:bg-gray-800/50`}
            >
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-7 w-7 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How PhishXpose Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simple, fast, and effective phishing detection in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Paste URL or Email',
              description: 'Enter the suspicious URL or paste the email content you want to analyze',
              icon: Mail,
            },
            {
              step: '02',
              title: 'AI Analysis',
              description: 'Our advanced AI engine analyzes patterns, keywords, and threat indicators',
              icon: Zap,
            },
            {
              step: '03',
              title: 'Get Results',
              description: 'Receive instant results with detailed risk factors and safety recommendations',
              icon: CheckCircle,
            },
          ].map((item, index) => (
            <div key={item.step} className="relative">
              {index < 2 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent z-0" />
              )}
              <div className="relative text-center p-8 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                <div className="text-6xl font-bold text-gray-800 absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 border border-cyan-500/20 p-12 md:p-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative text-center">
            <Shield className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Stay Protected?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of users who trust PhishXpose to keep them safe from phishing attacks. 
              Start scanning for free today.
            </p>
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              <Scan className="h-5 w-5" />
              Start Free Scan
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
