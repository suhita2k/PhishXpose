import { RiskFactor, ScanResult } from '../types';

// Suspicious keywords commonly found in phishing emails
const suspiciousKeywords = [
  { word: 'verify now', severity: 'high' as const, description: 'Urgent verification request - common phishing tactic' },
  { word: 'account blocked', severity: 'high' as const, description: 'Account threat - creates fear to prompt action' },
  { word: 'account suspended', severity: 'high' as const, description: 'Account threat - creates urgency' },
  { word: 'confirm your identity', severity: 'high' as const, description: 'Identity request - attempts to steal credentials' },
  { word: 'urgent action required', severity: 'high' as const, description: 'Urgency tactic - pressures immediate action' },
  { word: 'click here immediately', severity: 'high' as const, description: 'Immediate action demand - bypasses rational thinking' },
  { word: 'your account will be closed', severity: 'high' as const, description: 'Threat of loss - fear-based manipulation' },
  { word: 'update your payment', severity: 'high' as const, description: 'Payment update request - targets financial data' },
  { word: 'login to secure', severity: 'medium' as const, description: 'Security-themed login request' },
  { word: 'winner', severity: 'medium' as const, description: 'Prize claim - too good to be true offers' },
  { word: 'you have won', severity: 'medium' as const, description: 'Prize notification - common scam tactic' },
  { word: 'free gift', severity: 'medium' as const, description: 'Free offer - bait for personal information' },
  { word: 'limited time offer', severity: 'low' as const, description: 'Time pressure tactic' },
  { word: 'act now', severity: 'medium' as const, description: 'Urgency pressure' },
  { word: 'dear customer', severity: 'low' as const, description: 'Generic greeting - lack of personalization' },
  { word: 'dear user', severity: 'low' as const, description: 'Generic greeting - legitimate companies use your name' },
  { word: 'social security', severity: 'high' as const, description: 'SSN request - identity theft attempt' },
  { word: 'bank account', severity: 'medium' as const, description: 'Banking information request' },
  { word: 'credit card', severity: 'medium' as const, description: 'Credit card information request' },
  { word: 'password expired', severity: 'high' as const, description: 'Password reset scam' },
];

// Known phishing domain patterns
const suspiciousDomainPatterns = [
  { pattern: /paypa[l1]/, description: 'PayPal lookalike domain' },
  { pattern: /amaz[o0]n/, description: 'Amazon lookalike domain' },
  { pattern: /app[l1]e/, description: 'Apple lookalike domain' },
  { pattern: /g[o0][o0]g[l1]e/, description: 'Google lookalike domain' },
  { pattern: /micr[o0]s[o0]ft/, description: 'Microsoft lookalike domain' },
  { pattern: /faceb[o0][o0]k/, description: 'Facebook lookalike domain' },
  { pattern: /netf[l1]ix/, description: 'Netflix lookalike domain' },
  { pattern: /bank[o0]famerica/, description: 'Bank of America lookalike' },
  { pattern: /we[l1][l1]sfarg[o0]/, description: 'Wells Fargo lookalike' },
  { pattern: /secure-/, description: 'Fake security prefix' },
  { pattern: /-secure/, description: 'Fake security suffix' },
  { pattern: /login-/, description: 'Suspicious login prefix' },
  { pattern: /-login/, description: 'Suspicious login suffix' },
  { pattern: /verify-/, description: 'Suspicious verify prefix' },
  { pattern: /update-/, description: 'Suspicious update prefix' },
];

// Suspicious TLDs
const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.link', '.tk', '.ml', '.ga', '.cf', '.gq'];

// Known safe domains
const safeDomains = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'apple.com',
  'microsoft.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'github.com',
  'netflix.com', 'paypal.com', 'ebay.com', 'reddit.com', 'wikipedia.org',
  'yahoo.com', 'bing.com', 'dropbox.com', 'spotify.com', 'adobe.com'
];

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function hasIPAddress(url: string): boolean {
  const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  return ipPattern.test(url);
}

function hasEncodedCharacters(url: string): boolean {
  return /%[0-9a-fA-F]{2}/.test(url) && url.includes('%2F');
}

function hasSuspiciousSubdomains(domain: string): boolean {
  const parts = domain.split('.');
  return parts.length > 3;
}

function hasHomographAttack(domain: string): boolean {
  // Check for non-ASCII characters that look like ASCII
  const nonAscii = /[^\x00-\x7F]/;
  return nonAscii.test(domain);
}

export function analyzeUrl(url: string): { score: number; riskFactors: RiskFactor[] } {
  const riskFactors: RiskFactor[] = [];
  let score = 0;

  const domain = extractDomain(url);
  
  // Check if it's a known safe domain
  if (safeDomains.some(safe => domain === safe || domain.endsWith(`.${safe}`))) {
    return { score: 0, riskFactors: [] };
  }

  // Check for IP address in URL
  if (hasIPAddress(url)) {
    riskFactors.push({
      category: 'URL Structure',
      description: 'URL contains IP address instead of domain name',
      severity: 'high',
    });
    score += 30;
  }

  // Check for encoded characters
  if (hasEncodedCharacters(url)) {
    riskFactors.push({
      category: 'URL Structure',
      description: 'URL contains suspicious encoded characters',
      severity: 'medium',
    });
    score += 15;
  }

  // Check for suspicious subdomains
  if (hasSuspiciousSubdomains(domain)) {
    riskFactors.push({
      category: 'Domain Structure',
      description: 'Excessive subdomains detected',
      severity: 'medium',
    });
    score += 10;
  }

  // Check for homograph attacks
  if (hasHomographAttack(domain)) {
    riskFactors.push({
      category: 'Domain Structure',
      description: 'Possible homograph attack - uses lookalike characters',
      severity: 'high',
    });
    score += 35;
  }

  // Check suspicious domain patterns
  for (const { pattern, description } of suspiciousDomainPatterns) {
    if (pattern.test(domain)) {
      riskFactors.push({
        category: 'Domain Impersonation',
        description,
        severity: 'high',
      });
      score += 25;
    }
  }

  // Check suspicious TLDs
  for (const tld of suspiciousTLDs) {
    if (domain.endsWith(tld)) {
      riskFactors.push({
        category: 'Domain',
        description: `Suspicious top-level domain: ${tld}`,
        severity: 'medium',
      });
      score += 15;
    }
  }

  // Check for @ symbol (credential harvesting attempt)
  if (url.includes('@')) {
    riskFactors.push({
      category: 'URL Structure',
      description: 'URL contains @ symbol - possible credential harvesting',
      severity: 'high',
    });
    score += 30;
  }

  // Check for multiple protocols
  if ((url.match(/https?:\/\//g) || []).length > 1) {
    riskFactors.push({
      category: 'URL Structure',
      description: 'Multiple protocol declarations in URL',
      severity: 'high',
    });
    score += 25;
  }

  // Check URL length (very long URLs are suspicious)
  if (url.length > 100) {
    riskFactors.push({
      category: 'URL Structure',
      description: 'Unusually long URL',
      severity: 'low',
    });
    score += 5;
  }

  return { score: Math.min(score, 100), riskFactors };
}

export function analyzeEmail(content: string): { score: number; riskFactors: RiskFactor[] } {
  const riskFactors: RiskFactor[] = [];
  let score = 0;
  const lowerContent = content.toLowerCase();

  // Check for suspicious keywords
  for (const { word, severity, description } of suspiciousKeywords) {
    if (lowerContent.includes(word.toLowerCase())) {
      riskFactors.push({
        category: 'Suspicious Language',
        description: `"${word}" - ${description}`,
        severity,
      });
      score += severity === 'high' ? 15 : severity === 'medium' ? 10 : 5;
    }
  }

  // Check for URLs in content
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = content.match(urlPattern) || [];
  
  for (const url of urls) {
    const urlAnalysis = analyzeUrl(url);
    if (urlAnalysis.score > 0) {
      riskFactors.push({
        category: 'Embedded Link',
        description: `Suspicious link detected: ${url.substring(0, 50)}...`,
        severity: urlAnalysis.score > 50 ? 'high' : 'medium',
      });
      score += urlAnalysis.score / 2;
    }
  }

  // Check for urgency indicators
  const urgencyPatterns = [/!!!/, /urgent/i, /immediately/i, /now!/i, /asap/i];
  let urgencyCount = 0;
  for (const pattern of urgencyPatterns) {
    if (pattern.test(content)) {
      urgencyCount++;
    }
  }
  if (urgencyCount > 2) {
    riskFactors.push({
      category: 'Writing Style',
      description: 'Excessive urgency language detected',
      severity: 'medium',
    });
    score += 15;
  }

  // Check for grammar issues (simplified)
  const grammarPatterns = [/\btheir\s+is\b/i, /\byour\s+been\b/i, /\bdear\s+valued\b/i];
  for (const pattern of grammarPatterns) {
    if (pattern.test(content)) {
      riskFactors.push({
        category: 'Writing Style',
        description: 'Suspicious grammar patterns detected',
        severity: 'low',
      });
      score += 5;
      break;
    }
  }

  // Check for requests for sensitive information
  const sensitivePatterns = [/password/i, /ssn/i, /social\s+security/i, /credit\s+card/i, /bank\s+account/i, /pin\s+number/i];
  for (const pattern of sensitivePatterns) {
    if (pattern.test(content)) {
      riskFactors.push({
        category: 'Information Request',
        description: 'Requests sensitive personal information',
        severity: 'high',
      });
      score += 20;
      break;
    }
  }

  return { score: Math.min(score, 100), riskFactors };
}

export function performScan(type: 'url' | 'email', input: string, userId: string): ScanResult {
  const analysis = type === 'url' ? analyzeUrl(input) : analyzeEmail(input);
  
  let result: 'safe' | 'phishing' | 'suspicious';
  if (analysis.score < 20) {
    result = 'safe';
  } else if (analysis.score < 50) {
    result = 'suspicious';
  } else {
    result = 'phishing';
  }

  const scanResult: ScanResult = {
    id: `scan-${Date.now()}`,
    userId,
    type,
    input,
    result,
    score: analysis.score,
    riskFactors: analysis.riskFactors,
    timestamp: new Date(),
  };

  // Store in localStorage
  const history = JSON.parse(localStorage.getItem('phishxpose_history') || '[]');
  history.unshift(scanResult);
  localStorage.setItem('phishxpose_history', JSON.stringify(history.slice(0, 100)));

  return scanResult;
}

export function getScanHistory(userId?: string): ScanResult[] {
  let history = JSON.parse(localStorage.getItem('phishxpose_history') || '[]');
  
  // Initialize with demo data if empty
  if (history.length === 0) {
    const demoData: ScanResult[] = [
      {
        id: 'demo-1',
        userId: 'demo',
        type: 'url',
        input: 'https://secure-paypa1.com/login/verify',
        result: 'phishing',
        score: 85,
        riskFactors: [
          { category: 'Domain Impersonation', description: 'PayPal lookalike domain', severity: 'high' },
          { category: 'URL Structure', description: 'Suspicious login prefix', severity: 'medium' }
        ],
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 'demo-2',
        userId: 'demo',
        type: 'email',
        input: 'Dear Customer, Your account has been suspended. Verify now to restore access immediately!',
        result: 'phishing',
        score: 70,
        riskFactors: [
          { category: 'Suspicious Language', description: '"account suspended" - Account threat - creates urgency', severity: 'high' },
          { category: 'Suspicious Language', description: '"verify now" - Urgent verification request', severity: 'high' },
          { category: 'Writing Style', description: 'Generic greeting - lack of personalization', severity: 'low' }
        ],
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: 'demo-3',
        userId: 'demo',
        type: 'url',
        input: 'https://www.google.com',
        result: 'safe',
        score: 0,
        riskFactors: [],
        timestamp: new Date(Date.now() - 10800000),
      },
      {
        id: 'demo-4',
        userId: 'demo',
        type: 'url',
        input: 'https://login-banking.xyz/secure',
        result: 'suspicious',
        score: 45,
        riskFactors: [
          { category: 'Domain', description: 'Suspicious top-level domain: .xyz', severity: 'medium' },
          { category: 'URL Structure', description: 'Suspicious login prefix', severity: 'medium' }
        ],
        timestamp: new Date(Date.now() - 14400000),
      },
      {
        id: 'demo-5',
        userId: 'demo',
        type: 'url',
        input: 'https://github.com/features',
        result: 'safe',
        score: 0,
        riskFactors: [],
        timestamp: new Date(Date.now() - 18000000),
      },
    ];
    localStorage.setItem('phishxpose_history', JSON.stringify(demoData));
    history = demoData;
  }
  
  if (userId) {
    return history.filter((scan: ScanResult) => scan.userId === userId);
  }
  return history;
}

export function getStatistics() {
  const history: ScanResult[] = JSON.parse(localStorage.getItem('phishxpose_history') || '[]');
  
  const totalScans = history.length;
  const phishingDetected = history.filter(s => s.result === 'phishing').length;
  const safeUrls = history.filter(s => s.result === 'safe').length;
  const suspiciousUrls = history.filter(s => s.result === 'suspicious').length;

  // Generate daily stats for the last 7 days
  const dailyStats: { date: string; scans: number; phishing: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayScans = history.filter(s => 
      new Date(s.timestamp).toISOString().split('T')[0] === dateStr
    );
    
    dailyStats.push({
      date: dateStr,
      scans: dayScans.length,
      phishing: dayScans.filter(s => s.result === 'phishing').length,
    });
  }

  return {
    totalScans,
    phishingDetected,
    safeUrls,
    suspiciousUrls,
    recentScans: history.slice(0, 10),
    dailyStats,
  };
}
