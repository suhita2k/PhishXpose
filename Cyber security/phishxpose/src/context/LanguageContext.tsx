import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, Translations } from '../types';

const translations: Translations = {
  appName: { en: 'PhishXpose', es: 'PhishXpose', fr: 'PhishXpose', de: 'PhishXpose', zh: 'PhishXpose' },
  tagline: { 
    en: 'AI-Powered Phishing Detection', 
    es: 'Detección de Phishing con IA', 
    fr: 'Détection de Phishing par IA', 
    de: 'KI-gestützte Phishing-Erkennung', 
    zh: 'AI驱动的钓鱼检测' 
  },
  checkSafety: { en: 'Check Safety', es: 'Verificar Seguridad', fr: 'Vérifier la Sécurité', de: 'Sicherheit Prüfen', zh: '检查安全性' },
  enterUrl: { en: 'Enter URL to scan...', es: 'Ingrese URL para escanear...', fr: 'Entrez l\'URL à analyser...', de: 'URL zum Scannen eingeben...', zh: '输入要扫描的URL...' },
  enterEmail: { en: 'Paste email content here...', es: 'Pegue el contenido del correo aquí...', fr: 'Collez le contenu de l\'email ici...', de: 'E-Mail-Inhalt hier einfügen...', zh: '在此粘贴电子邮件内容...' },
  safe: { en: 'Safe', es: 'Seguro', fr: 'Sûr', de: 'Sicher', zh: '安全' },
  phishing: { en: 'Phishing Detected', es: 'Phishing Detectado', fr: 'Phishing Détecté', de: 'Phishing Erkannt', zh: '检测到钓鱼' },
  suspicious: { en: 'Suspicious', es: 'Sospechoso', fr: 'Suspect', de: 'Verdächtig', zh: '可疑' },
  dashboard: { en: 'Dashboard', es: 'Panel de Control', fr: 'Tableau de Bord', de: 'Dashboard', zh: '仪表板' },
  scanner: { en: 'Scanner', es: 'Escáner', fr: 'Scanner', de: 'Scanner', zh: '扫描器' },
  history: { en: 'History', es: 'Historial', fr: 'Historique', de: 'Verlauf', zh: '历史记录' },
  admin: { en: 'Admin', es: 'Admin', fr: 'Admin', de: 'Admin', zh: '管理员' },
  login: { en: 'Login', es: 'Iniciar Sesión', fr: 'Connexion', de: 'Anmelden', zh: '登录' },
  register: { en: 'Register', es: 'Registrarse', fr: 'S\'inscrire', de: 'Registrieren', zh: '注册' },
  logout: { en: 'Logout', es: 'Cerrar Sesión', fr: 'Déconnexion', de: 'Abmelden', zh: '登出' },
  urlScan: { en: 'URL Scan', es: 'Escaneo de URL', fr: 'Scan d\'URL', de: 'URL-Scan', zh: 'URL扫描' },
  emailScan: { en: 'Email Scan', es: 'Escaneo de Email', fr: 'Scan d\'Email', de: 'E-Mail-Scan', zh: '邮件扫描' },
  riskFactors: { en: 'Risk Factors', es: 'Factores de Riesgo', fr: 'Facteurs de Risque', de: 'Risikofaktoren', zh: '风险因素' },
  safetyTips: { en: 'Safety Tips', es: 'Consejos de Seguridad', fr: 'Conseils de Sécurité', de: 'Sicherheitstipps', zh: '安全提示' },
  totalScans: { en: 'Total Scans', es: 'Escaneos Totales', fr: 'Analyses Totales', de: 'Gesamtscans', zh: '总扫描次数' },
  threatsDetected: { en: 'Threats Detected', es: 'Amenazas Detectadas', fr: 'Menaces Détectées', de: 'Erkannte Bedrohungen', zh: '检测到的威胁' },
  recentActivity: { en: 'Recent Activity', es: 'Actividad Reciente', fr: 'Activité Récente', de: 'Letzte Aktivität', zh: '最近活动' },
  blacklist: { en: 'Blacklist', es: 'Lista Negra', fr: 'Liste Noire', de: 'Schwarze Liste', zh: '黑名单' },
  statistics: { en: 'Statistics', es: 'Estadísticas', fr: 'Statistiques', de: 'Statistiken', zh: '统计数据' },
  email: { en: 'Email', es: 'Correo', fr: 'Email', de: 'E-Mail', zh: '电子邮件' },
  password: { en: 'Password', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', zh: '密码' },
  name: { en: 'Name', es: 'Nombre', fr: 'Nom', de: 'Name', zh: '姓名' },
  analyzing: { en: 'Analyzing...', es: 'Analizando...', fr: 'Analyse en cours...', de: 'Analysiere...', zh: '分析中...' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
