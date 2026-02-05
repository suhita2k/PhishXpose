import { cn } from '../utils/cn';

interface EndpointSectionProps {
  method: string;
  endpoint: string;
  description: string;
  children: React.ReactNode;
}

function EndpointSection({ method, endpoint, description, children }: EndpointSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
            {method}
          </span>
          <code className="text-sm font-medium text-slate-900">{endpoint}</code>
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function CodeBlock({ title, language, children }: { title: string; language: string; children: string }) {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <span className="text-xs text-slate-500">{language}</span>
      </div>
      <pre className="bg-slate-900 p-4 text-xs text-slate-300 overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Documentation() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">API Documentation</h2>
        <p className="mt-2 text-slate-600">Complete reference for the Voice Detection API</p>
      </div>

      {/* Base URL */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="font-semibold text-emerald-900 mb-2">Base URL</h3>
        <code className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
          https://api.voiceguard.ai/v1
        </code>
      </div>

      {/* Authentication */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Authentication
        </h3>
        <p className="text-slate-600 mb-4">
          All API requests require authentication using an API key passed in the request header.
        </p>
        <CodeBlock title="Header" language="http">
{`x-api-key: YOUR_SECRET_API_KEY`}
        </CodeBlock>
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-medium text-amber-800">Security Note</h4>
              <p className="text-sm text-amber-700">Never expose your API key in client-side code. Always make API calls from your backend server.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Detection Endpoint */}
      <EndpointSection
        method="POST"
        endpoint="/api/voice-detection"
        description="Analyze an audio file to determine if the voice is AI-generated or human"
      >
        <div className="space-y-6">
          {/* Request Body */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Request Body</h4>
            <CodeBlock title="Request" language="JSON">
{`{
  "language": "Tamil",
  "audioFormat": "mp3",
  "audioBase64": "BASE64_MP3_DATA"
}`}
            </CodeBlock>
          </div>

          {/* Parameters Table */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Required</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">language</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">One of: Tamil, English, Hindi, Malayalam, Telugu</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">audioFormat</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">Must be "mp3"</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">audioBase64</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">Base64 encoded MP3 audio data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Success Response */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">200</span>
              Success Response
            </h4>
            <CodeBlock title="Response" language="JSON">
{`{
  "status": "success",
  "language": "Tamil",
  "classification": "AI_GENERATED",
  "confidenceScore": 0.91,
  "explanation": "Unnatural pitch consistency and robotic speech patterns detected"
}`}
            </CodeBlock>
          </div>

          {/* Response Fields */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Response Fields</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">status</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3 text-sm text-slate-600">"success" or "error"</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">language</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3 text-sm text-slate-600">The language specified in the request</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">classification</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3 text-sm text-slate-600">"AI_GENERATED" or "HUMAN"</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">confidenceScore</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">number</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Confidence level between 0.0 and 1.0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">explanation</code></td>
                    <td className="px-4 py-3 text-sm text-slate-600">string</td>
                    <td className="px-4 py-3 text-sm text-slate-600">Human-readable reason for the classification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Error Response */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">4xx/5xx</span>
              Error Response
            </h4>
            <CodeBlock title="Response" language="JSON">
{`{
  "status": "error",
  "message": "Invalid API key or malformed request"
}`}
            </CodeBlock>
          </div>

          {/* Error Codes */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Error Codes</h4>
            <div className="space-y-2">
              {[
                { code: '400', message: 'Bad Request', description: 'Invalid request body or parameters' },
                { code: '401', message: 'Unauthorized', description: 'Invalid or missing API key' },
                { code: '415', message: 'Unsupported Media Type', description: 'Audio format not supported' },
                { code: '422', message: 'Unprocessable Entity', description: 'Unsupported language' },
                { code: '500', message: 'Internal Server Error', description: 'Server-side processing error' },
              ].map((error) => (
                <div key={error.code} className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-3">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    error.code.startsWith('4') ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  )}>
                    {error.code}
                  </span>
                  <span className="font-medium text-slate-900">{error.message}</span>
                  <span className="text-sm text-slate-500">{error.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EndpointSection>

      {/* Rate Limiting */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Rate Limiting</h3>
        <p className="text-slate-600 mb-4">
          API requests are rate limited to ensure fair usage and system stability.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">100</div>
            <div className="text-sm text-slate-500">requests/minute</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">10,000</div>
            <div className="text-sm text-slate-500">requests/day</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">10 MB</div>
            <div className="text-sm text-slate-500">max file size</div>
          </div>
        </div>
      </div>
    </div>
  );
}
