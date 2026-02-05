import { useState, useRef } from 'react';
import { Language, DetectionResponse, ErrorResponse } from '../types';
import { validateApiKey, validateRequest } from '../utils/mockDetection';
import { analyzeAudio, ExtractedFeatures, LanguageDetectionResult } from '../utils/audioAnalyzer';
import { cn } from '../utils/cn';

const languages: Language[] = ['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'];

interface AnalysisDetails {
  features: ExtractedFeatures;
  reasons: string[];
  languageDetection: LanguageDetectionResult;
}

export function ApiDemo() {
  const [apiKey, setApiKey] = useState('sk-voiceguard-demo-key-2024');
  const [language, setLanguage] = useState<Language>('English');
  const [audioBase64, setAudioBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DetectionResponse | ErrorResponse | null>(null);
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetails | null>(null);
  const [languageMismatch, setLanguageMismatch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.mp3')) {
      setResponse({ status: 'error', message: 'Only MP3 files are accepted' });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1] || '';
      setAudioBase64(base64);
      setResponse(null);
      setLanguageMismatch(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse(null);
    setLanguageMismatch(false);

    // Validate API key
    if (!validateApiKey(apiKey)) {
      setResponse({ status: 'error', message: 'Invalid API key or malformed request' });
      setIsLoading(false);
      return;
    }

    // Check if audio is provided
    if (!audioBase64) {
      setResponse({ status: 'error', message: 'Please upload an MP3 audio file to analyze' });
      setIsLoading(false);
      return;
    }

    // Validate request
    const validation = validateRequest(language, 'mp3', audioBase64);
    if (!validation.valid) {
      setResponse({ status: 'error', message: validation.error! });
      setIsLoading(false);
      return;
    }

    try {
      // Perform real audio analysis with language detection
      const analysisResult = await analyzeAudio(audioBase64, language);
      
      // Check for language mismatch
      const langDetection = analysisResult.languageDetection;
      const isLangMismatch = !langDetection.isLanguageMatch && langDetection.confidence > 0.5;
      setLanguageMismatch(isLangMismatch);
      
      // Store analysis details for display
      setAnalysisDetails({
        features: analysisResult.features,
        reasons: analysisResult.reasons,
        languageDetection: langDetection,
      });
      
      // If language mismatch detected, return error
      if (isLangMismatch) {
        setResponse({
          status: 'error',
          message: `Language mismatch detected! You selected "${language}" but the audio appears to be "${langDetection.detectedLanguage}" (${(langDetection.confidence * 100).toFixed(1)}% confidence). Please select the correct language.`
        });
        setIsLoading(false);
        return;
      }
      
      // Generate explanation from analysis reasons
      const explanation = analysisResult.reasons.length > 0 
        ? analysisResult.reasons.join('. ')
        : analysisResult.isAI 
          ? 'Synthetic speech patterns detected in audio signal'
          : 'Natural human speech characteristics confirmed';

      const result: DetectionResponse = {
        status: 'success',
        language,
        classification: analysisResult.isAI ? 'AI_GENERATED' : 'HUMAN',
        confidenceScore: Math.round(analysisResult.confidence * 100) / 100,
        explanation,
      };
      
      setResponse(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setResponse({ 
        status: 'error', 
        message: `Failed to analyze audio: ${(error as Error).message}. Please ensure the file is a valid MP3.`
      });
    }
    
    setIsLoading(false);
  };

  const clearAudio = () => {
    setAudioBase64('');
    setFileName('');
    setResponse(null);
    setAnalysisDetails(null);
    setLanguageMismatch(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">API Demo</h2>
        <p className="mt-2 text-slate-600">Test the voice detection API with your own audio files</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Request Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Request Configuration
            </h3>

            {/* API Key */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                API Key (x-api-key header)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                placeholder="sk-your-api-key"
              />
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-slate-400 font-normal">(Must match audio language)</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setResponse(null);
                      setLanguageMismatch(false);
                    }}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg border transition-all",
                      language === lang
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Audio File (MP3)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,audio/mpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-emerald-400 transition-colors"
              >
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{fileName}</span>
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <svg className="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p className="mt-2 text-sm">Click to upload MP3 file</p>
                    <p className="text-xs text-slate-400">or drag and drop</p>
                  </div>
                )}
              </div>
              {fileName && (
                <button
                  onClick={clearAudio}
                  className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear file
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all",
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200"
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Audio...
                </span>
              ) : (
                'Detect Voice'
              )}
            </button>
          </div>

          {/* Request Preview */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Request Preview</h3>
            <pre className="text-xs text-emerald-400 overflow-x-auto">
{`POST /api/voice-detection
Headers:
  x-api-key: ${apiKey || 'YOUR_SECRET_API_KEY'}
  Content-Type: application/json

Body:
{
  "language": "${language}",
  "audioFormat": "mp3",
  "audioBase64": "${audioBase64 ? audioBase64.substring(0, 40) + '...' : '<BASE64_MP3_DATA>'}"
}`}
            </pre>
          </div>
        </div>

        {/* Response Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              API Response
            </h3>

            {!response && !isLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Submit a request to see the response</p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-emerald-200 animate-pulse"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-slate-500">Analyzing audio features...</p>
                <p className="text-xs text-slate-400">Extracting MFCC, pitch, prosody & detecting language...</p>
              </div>
            )}

            {response && !isLoading && (
              <div className="space-y-4">
                {response.status === 'success' ? (
                  <>
                    {/* Classification Result */}
                    <div className={cn(
                      "rounded-xl p-6 text-center",
                      (response as DetectionResponse).classification === 'AI_GENERATED'
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    )}>
                      <div className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-3",
                        (response as DetectionResponse).classification === 'AI_GENERATED'
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      )}>
                        {(response as DetectionResponse).classification === 'AI_GENERATED' ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {(response as DetectionResponse).classification}
                      </div>
                      <div className="text-3xl font-bold text-slate-900">
                        {((response as DetectionResponse).confidenceScore * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-500">Confidence Score</div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Language</span>
                        <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                          {(response as DetectionResponse).language}
                          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                      <div className="py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Explanation</span>
                        <p className="mt-1 text-sm font-medium text-slate-900">{(response as DetectionResponse).explanation}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={cn(
                    "rounded-xl p-6 text-center",
                    languageMismatch ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"
                  )}>
                    {languageMismatch ? (
                      <>
                        <svg className="mx-auto h-12 w-12 text-amber-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-lg font-semibold text-amber-700">Language Mismatch Detected</div>
                        <p className="mt-2 text-sm text-amber-600">{(response as ErrorResponse).message}</p>
                        
                        {/* Language Scores */}
                        {analysisDetails?.languageDetection && (
                          <div className="mt-4 pt-4 border-t border-amber-200 text-left">
                            <div className="text-xs font-medium text-amber-700 mb-2">Language Detection Scores:</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(analysisDetails.languageDetection.languageScores)
                                .sort(([,a], [,b]) => b - a)
                                .map(([lang, score]) => (
                                  <div 
                                    key={lang} 
                                    className={cn(
                                      "flex justify-between items-center px-2 py-1 rounded",
                                      lang === analysisDetails.languageDetection.detectedLanguage
                                        ? "bg-amber-200 font-semibold"
                                        : "bg-amber-100"
                                    )}
                                  >
                                    <span>{lang}</span>
                                    <span>{(score * 100).toFixed(0)}%</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-lg font-semibold text-red-700">Error</div>
                        <p className="mt-1 text-sm text-red-600">{(response as ErrorResponse).message}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Response JSON */}
          {response && (
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Response JSON</h3>
              <pre className={cn(
                "text-xs overflow-x-auto",
                languageMismatch ? "text-amber-400" : response.status === 'error' ? "text-red-400" : "text-emerald-400"
              )}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Language Detection Details */}
          {analysisDetails?.languageDetection && response?.status === 'success' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Language Detection
              </h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center border border-green-200">
                  <div className="text-xs text-green-600 uppercase tracking-wide">Detected</div>
                  <div className="font-bold text-green-700 text-lg">{analysisDetails.languageDetection.detectedLanguage}</div>
                </div>
                <div className="text-2xl text-green-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Selected</div>
                  <div className="font-bold text-slate-700 text-lg">{analysisDetails.languageDetection.selectedLanguage}</div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 mb-3">Language Confidence Scores:</div>
              <div className="space-y-2">
                {Object.entries(analysisDetails.languageDetection.languageScores)
                  .sort(([,a], [,b]) => b - a)
                  .map(([lang, score]) => (
                    <div key={lang} className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-slate-700">{lang}</div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            lang === analysisDetails.languageDetection.detectedLanguage
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          )}
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-slate-500">{(score * 100).toFixed(0)}%</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          
          {/* Extracted Features Display */}
          {analysisDetails && response?.status === 'success' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Extracted Audio Features
              </h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Pitch Mean</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.pitchMean.toFixed(1)} Hz</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Pitch Variance</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.pitchVariance.toFixed(2)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Pitch Range</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.pitchRange.toFixed(1)} Hz</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Syllable Rate</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.syllableRate.toFixed(2)} /sec</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Formant Ratio</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.formantRatio.toFixed(3)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Vowel Duration</div>
                  <div className="font-semibold text-slate-900">{(analysisDetails.features.vowelDuration * 1000).toFixed(1)} ms</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Spectral Flatness</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.spectralFlatness.toFixed(4)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Zero Crossing Rate</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.zeroCrossingRate.toFixed(4)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Intonation Pattern</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.intonationPattern.toFixed(3)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Stress Pattern</div>
                  <div className="font-semibold text-slate-900">{analysisDetails.features.stressPattern.toFixed(3)}</div>
                </div>
              </div>
              
              {/* Analysis Reasons */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-slate-500 text-xs uppercase tracking-wide mb-2">Detection Reasons</div>
                <ul className="space-y-1">
                  {analysisDetails.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
