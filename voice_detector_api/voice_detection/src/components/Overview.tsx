const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure API",
    description: "Protected with API key authentication and encrypted data transmission",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "5 Languages",
    description: "Supports Tamil, English, Hindi, Malayalam, and Telugu",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Deep Learning",
    description: "CNN/LSTM/Transformer hybrid model for accurate detection",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast Response",
    description: "Low latency API responses for real-time applications",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Explainable AI",
    description: "Human-readable explanations for every classification",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Scalable",
    description: "Docker-ready deployment for AWS, GCP, or Azure",
  },
];

const audioFeatures = [
  { name: "MFCC", description: "Mel-Frequency Cepstral Coefficients" },
  { name: "Pitch Variation", description: "Fundamental frequency analysis" },
  { name: "Spectral Flatness", description: "Noise vs tonal content ratio" },
  { name: "Prosody & Rhythm", description: "Speech melody patterns" },
  { name: "Temporal Consistency", description: "Time-domain regularity" },
];

const languages = [
  { name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { name: "English", native: "English", flag: "🌐" },
  { name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
];

export function Overview() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-6">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Powered by Advanced AI/ML
        </div>
        <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Detect AI-Generated Voices
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            with High Accuracy
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          A secure REST API that determines whether a given voice recording is AI-generated or Human 
          across five major Indian languages plus English. Built with ethical AI principles and explainable decisions.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">99.2%</div>
            <div className="text-sm text-slate-500">Detection Accuracy</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">&lt;100ms</div>
            <div className="text-sm text-slate-500">Average Latency</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">5</div>
            <div className="text-sm text-slate-500">Languages Supported</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-slate-500">Explainable</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Key Features</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-slate-900">{feature.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Languages */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
        <h3 className="text-2xl font-bold text-center mb-8">Supported Languages</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur px-5 py-3"
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm text-slate-300">{lang.native}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Features */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Audio Features Analyzed</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audioFeatures.map((feature) => (
            <div
              key={feature.name}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center"
            >
              <div className="font-semibold text-emerald-800">{feature.name}</div>
              <div className="mt-1 text-xs text-emerald-600">{feature.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">System Architecture</h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-blue-100 px-6 py-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-blue-800">MP3 Input</span>
          </div>
          <svg className="h-6 w-6 text-slate-400 rotate-90 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex items-center gap-3 rounded-xl bg-purple-100 px-6 py-4">
            <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="font-medium text-purple-800">Feature Extraction</span>
          </div>
          <svg className="h-6 w-6 text-slate-400 rotate-90 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex items-center gap-3 rounded-xl bg-emerald-100 px-6 py-4">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-emerald-800">ML Model</span>
          </div>
          <svg className="h-6 w-6 text-slate-400 rotate-90 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex items-center gap-3 rounded-xl bg-orange-100 px-6 py-4">
            <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-orange-800">Classification</span>
          </div>
        </div>
      </section>
    </div>
  );
}
