export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface ScanResult {
  id: string;
  userId: string;
  type: 'url' | 'email';
  input: string;
  result: 'safe' | 'phishing' | 'suspicious';
  score: number;
  riskFactors: RiskFactor[];
  timestamp: Date;
}

export interface RiskFactor {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PhishingPattern {
  id: string;
  pattern: string;
  type: 'keyword' | 'domain' | 'structure';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DashboardStats {
  totalScans: number;
  phishingDetected: number;
  safeUrls: number;
  suspiciousUrls: number;
  recentScans: ScanResult[];
  dailyStats: { date: string; scans: number; phishing: number }[];
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}
