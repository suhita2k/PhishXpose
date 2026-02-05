import { useState } from 'react';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { ApiDemo } from './components/ApiDemo';
import { Documentation } from './components/Documentation';
import { CodeExamples } from './components/CodeExamples';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'demo':
        return <ApiDemo />;
      case 'docs':
        return <Documentation />;
      case 'examples':
        return <CodeExamples />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}
