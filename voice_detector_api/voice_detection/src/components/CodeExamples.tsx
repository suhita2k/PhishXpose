import { useState } from 'react';
import { cn } from '../utils/cn';

const examples = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    code: `import requests
import base64

# Read and encode the audio file
with open('audio_sample.mp3', 'rb') as audio_file:
    audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')

# API endpoint
url = "https://api.voiceguard.ai/v1/api/voice-detection"

# Headers with API key
headers = {
    "x-api-key": "YOUR_SECRET_API_KEY",
    "Content-Type": "application/json"
}

# Request payload
payload = {
    "language": "Tamil",
    "audioFormat": "mp3",
    "audioBase64": audio_base64
}

# Make the API request
response = requests.post(url, json=payload, headers=headers)

# Parse the response
if response.status_code == 200:
    result = response.json()
    print(f"Classification: {result['classification']}")
    print(f"Confidence: {result['confidenceScore']:.2%}")
    print(f"Explanation: {result['explanation']}")
else:
    print(f"Error: {response.json()['message']}")`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    code: `// Using fetch API in Node.js or browser
const fs = require('fs');

async function detectVoice(audioPath, language) {
  // Read and encode the audio file
  const audioBuffer = fs.readFileSync(audioPath);
  const audioBase64 = audioBuffer.toString('base64');

  const response = await fetch(
    'https://api.voiceguard.ai/v1/api/voice-detection',
    {
      method: 'POST',
      headers: {
        'x-api-key': 'YOUR_SECRET_API_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language,
        audioFormat: 'mp3',
        audioBase64: audioBase64,
      }),
    }
  );

  const result = await response.json();

  if (result.status === 'success') {
    console.log('Classification:', result.classification);
    console.log('Confidence:', (result.confidenceScore * 100).toFixed(1) + '%');
    console.log('Explanation:', result.explanation);
  } else {
    console.error('Error:', result.message);
  }

  return result;
}

// Usage
detectVoice('audio_sample.mp3', 'English');`,
  },
  {
    id: 'curl',
    name: 'cURL',
    icon: '🔗',
    code: `# First, encode your audio file to base64
base64 audio_sample.mp3 > audio_base64.txt

# Make the API request
curl -X POST "https://api.voiceguard.ai/v1/api/voice-detection" \\
  -H "x-api-key: YOUR_SECRET_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "language": "Hindi",
    "audioFormat": "mp3",
    "audioBase64": "'$(cat audio_base64.txt)'"
  }'

# Example response:
# {
#   "status": "success",
#   "language": "Hindi",
#   "classification": "HUMAN",
#   "confidenceScore": 0.94,
#   "explanation": "Natural pitch fluctuations and emotional undertones present"
# }`,
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    code: `import java.net.http.*;
import java.net.URI;
import java.nio.file.*;
import java.util.Base64;
import com.google.gson.*;

public class VoiceDetection {
    private static final String API_KEY = "YOUR_SECRET_API_KEY";
    private static final String API_URL = 
        "https://api.voiceguard.ai/v1/api/voice-detection";

    public static void main(String[] args) throws Exception {
        // Read and encode the audio file
        byte[] audioBytes = Files.readAllBytes(Path.of("audio_sample.mp3"));
        String audioBase64 = Base64.getEncoder().encodeToString(audioBytes);

        // Create JSON payload
        JsonObject payload = new JsonObject();
        payload.addProperty("language", "Telugu");
        payload.addProperty("audioFormat", "mp3");
        payload.addProperty("audioBase64", audioBase64);

        // Build HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .header("x-api-key", API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
            .build();

        // Send request and get response
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(
            request, HttpResponse.BodyHandlers.ofString()
        );

        // Parse and display result
        JsonObject result = JsonParser.parseString(response.body())
            .getAsJsonObject();
        System.out.println("Classification: " + 
            result.get("classification").getAsString());
        System.out.println("Confidence: " + 
            result.get("confidenceScore").getAsDouble() * 100 + "%");
    }
}`,
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: '#️⃣',
    code: `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.IO;
using System.Threading.Tasks;

class VoiceDetection
{
    private const string ApiKey = "YOUR_SECRET_API_KEY";
    private const string ApiUrl = 
        "https://api.voiceguard.ai/v1/api/voice-detection";

    static async Task Main(string[] args)
    {
        // Read and encode the audio file
        byte[] audioBytes = await File.ReadAllBytesAsync("audio_sample.mp3");
        string audioBase64 = Convert.ToBase64String(audioBytes);

        // Create request payload
        var payload = new
        {
            language = "Malayalam",
            audioFormat = "mp3",
            audioBase64 = audioBase64
        };

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("x-api-key", ApiKey);

        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync(ApiUrl, content);
        var result = await response.Content.ReadAsStringAsync();
        
        var json = JsonDocument.Parse(result);
        Console.WriteLine($"Classification: {json.RootElement
            .GetProperty("classification").GetString()}");
        Console.WriteLine($"Confidence: {json.RootElement
            .GetProperty("confidenceScore").GetDouble() * 100}%");
    }
}`,
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    code: `package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

const (
    apiKey = "YOUR_SECRET_API_KEY"
    apiURL = "https://api.voiceguard.ai/v1/api/voice-detection"
)

type Request struct {
    Language    string \`json:"language"\`
    AudioFormat string \`json:"audioFormat"\`
    AudioBase64 string \`json:"audioBase64"\`
}

type Response struct {
    Status          string  \`json:"status"\`
    Language        string  \`json:"language"\`
    Classification  string  \`json:"classification"\`
    ConfidenceScore float64 \`json:"confidenceScore"\`
    Explanation     string  \`json:"explanation"\`
}

func main() {
    // Read and encode audio file
    audioData, _ := ioutil.ReadFile("audio_sample.mp3")
    audioBase64 := base64.StdEncoding.EncodeToString(audioData)

    // Create request
    payload := Request{
        Language:    "Tamil",
        AudioFormat: "mp3",
        AudioBase64: audioBase64,
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
    req.Header.Set("x-api-key", apiKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    var result Response
    json.NewDecoder(resp.Body).Decode(&result)

    fmt.Printf("Classification: %s\\n", result.Classification)
    fmt.Printf("Confidence: %.1f%%\\n", result.ConfidenceScore*100)
    fmt.Printf("Explanation: %s\\n", result.Explanation)
}`,
  },
];

export function CodeExamples() {
  const [activeExample, setActiveExample] = useState('python');
  const [copied, setCopied] = useState(false);

  const currentExample = examples.find(e => e.id === activeExample)!;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Code Examples</h2>
        <p className="mt-2 text-slate-600">Ready-to-use examples in popular programming languages</p>
      </div>

      {/* Language Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeExample === example.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
            )}
          >
            <span>{example.icon}</span>
            <span>{example.name}</span>
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between bg-slate-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-medium text-slate-400">
              {currentExample.name} Example
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              copied
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            )}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="bg-slate-900 p-6 text-sm text-slate-300 overflow-x-auto max-h-[500px]">
          <code>{currentExample.code}</code>
        </pre>
      </div>

      {/* Quick Start Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Start Guide</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">1</div>
            <div>
              <h4 className="font-medium text-slate-900">Get API Key</h4>
              <p className="text-sm text-slate-500">Sign up and obtain your API key from the dashboard</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">2</div>
            <div>
              <h4 className="font-medium text-slate-900">Prepare Audio</h4>
              <p className="text-sm text-slate-500">Ensure your audio is in MP3 format</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">3</div>
            <div>
              <h4 className="font-medium text-slate-900">Encode to Base64</h4>
              <p className="text-sm text-slate-500">Convert the audio file to Base64 string</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">4</div>
            <div>
              <h4 className="font-medium text-slate-900">Make Request</h4>
              <p className="text-sm text-slate-500">Send POST request with language and audio data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Best Practices
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Use high-quality audio recordings (44.1kHz or higher)</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Minimum audio duration of 3 seconds recommended</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Specify correct language for better accuracy</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Implement retry logic for network failures</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Store API keys securely in environment variables</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-emerald-800">Cache responses for repeated analysis of same audio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
