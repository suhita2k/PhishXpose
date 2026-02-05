// Real Audio Analysis using Web Audio API
// This module performs actual audio feature extraction, AI detection, and language detection

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  languageScores: { [key: string]: number };
  isLanguageMatch: boolean;
  selectedLanguage: string;
}

export interface AudioAnalysisResult {
  isAI: boolean;
  confidence: number;
  features: ExtractedFeatures;
  reasons: string[];
  languageDetection: LanguageDetectionResult;
}

export interface ExtractedFeatures {
  // Pitch analysis
  pitchMean: number;
  pitchVariance: number;
  pitchRange: number;
  
  // Amplitude/Energy
  rmsEnergy: number;
  energyVariance: number;
  silenceRatio: number;
  
  // Spectral features
  spectralCentroid: number;
  spectralFlatness: number;
  spectralRolloff: number;
  
  // Temporal features
  zeroCrossingRate: number;
  temporalVariation: number;
  
  // Rhythm/Prosody
  rhythmRegularity: number;
  pausePattern: number;
  
  // Language-specific features
  syllableRate: number;
  formantRatio: number;
  vowelDuration: number;
  consonantDensity: number;
  intonationPattern: number;
  stressPattern: number;
}

// Language characteristics based on linguistic research
interface LanguageProfile {
  name: string;
  syllableRate: { min: number; max: number; typical: number };
  pitchRange: { min: number; max: number };
  formantRatio: { min: number; max: number };
  vowelDuration: { min: number; max: number };
  rhythmType: 'syllable-timed' | 'stress-timed' | 'mora-timed';
  zeroCrossingRange: { min: number; max: number };
  intonationVariance: number;
}

const LANGUAGE_PROFILES: { [key: string]: LanguageProfile } = {
  English: {
    name: 'English',
    syllableRate: { min: 4.0, max: 6.5, typical: 5.1 },
    pitchRange: { min: 80, max: 200 },
    formantRatio: { min: 1.1, max: 1.4 },
    vowelDuration: { min: 0.08, max: 0.15 },
    rhythmType: 'stress-timed',
    zeroCrossingRange: { min: 0.04, max: 0.09 },
    intonationVariance: 0.35,
  },
  Tamil: {
    name: 'Tamil',
    syllableRate: { min: 5.5, max: 8.0, typical: 6.8 },
    pitchRange: { min: 90, max: 220 },
    formantRatio: { min: 1.2, max: 1.5 },
    vowelDuration: { min: 0.10, max: 0.20 },
    rhythmType: 'syllable-timed',
    zeroCrossingRange: { min: 0.05, max: 0.10 },
    intonationVariance: 0.42,
  },
  Hindi: {
    name: 'Hindi',
    syllableRate: { min: 5.0, max: 7.5, typical: 6.1 },
    pitchRange: { min: 85, max: 210 },
    formantRatio: { min: 1.15, max: 1.45 },
    vowelDuration: { min: 0.09, max: 0.18 },
    rhythmType: 'syllable-timed',
    zeroCrossingRange: { min: 0.045, max: 0.095 },
    intonationVariance: 0.38,
  },
  Malayalam: {
    name: 'Malayalam',
    syllableRate: { min: 6.0, max: 8.5, typical: 7.2 },
    pitchRange: { min: 95, max: 230 },
    formantRatio: { min: 1.25, max: 1.55 },
    vowelDuration: { min: 0.11, max: 0.22 },
    rhythmType: 'syllable-timed',
    zeroCrossingRange: { min: 0.055, max: 0.11 },
    intonationVariance: 0.45,
  },
  Telugu: {
    name: 'Telugu',
    syllableRate: { min: 5.5, max: 8.0, typical: 6.5 },
    pitchRange: { min: 88, max: 215 },
    formantRatio: { min: 1.18, max: 1.48 },
    vowelDuration: { min: 0.10, max: 0.19 },
    rhythmType: 'syllable-timed',
    zeroCrossingRange: { min: 0.048, max: 0.10 },
    intonationVariance: 0.40,
  },
};

// Decode base64 audio to AudioBuffer
export async function decodeAudioFromBase64(base64Data: string): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Convert base64 to array buffer
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Decode the audio
  const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
  await audioContext.close();
  
  return audioBuffer;
}

// Extract features from audio buffer
function extractFeatures(audioBuffer: AudioBuffer): ExtractedFeatures {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const length = channelData.length;
  const duration = length / sampleRate;
  
  // === RMS Energy & Variance ===
  let sumSquares = 0;
  const frameSize = Math.floor(sampleRate * 0.025); // 25ms frames
  const energyValues: number[] = [];
  
  for (let i = 0; i < length; i += frameSize) {
    let frameEnergy = 0;
    const end = Math.min(i + frameSize, length);
    for (let j = i; j < end; j++) {
      frameEnergy += channelData[j] * channelData[j];
    }
    frameEnergy = Math.sqrt(frameEnergy / (end - i));
    energyValues.push(frameEnergy);
    sumSquares += frameEnergy;
  }
  
  const rmsEnergy = sumSquares / energyValues.length;
  const energyVariance = calculateVariance(energyValues);
  
  // Silence ratio (frames with very low energy)
  const silenceThreshold = rmsEnergy * 0.1;
  const silentFrames = energyValues.filter(e => e < silenceThreshold).length;
  const silenceRatio = silentFrames / energyValues.length;
  
  // === Zero Crossing Rate ===
  let zeroCrossings = 0;
  for (let i = 1; i < length; i++) {
    if ((channelData[i] >= 0) !== (channelData[i - 1] >= 0)) {
      zeroCrossings++;
    }
  }
  const zeroCrossingRate = zeroCrossings / length;
  
  // === Pitch Analysis using Autocorrelation ===
  const pitchValues = estimatePitch(channelData, sampleRate);
  const pitchMean = pitchValues.length > 0 ? average(pitchValues) : 150;
  const pitchVariance = pitchValues.length > 0 ? calculateVariance(pitchValues) : 0;
  const pitchRange = pitchValues.length > 0 ? Math.max(...pitchValues) - Math.min(...pitchValues) : 0;
  
  // === Spectral Features ===
  const spectralFeatures = calculateSpectralFeatures(channelData, sampleRate);
  
  // === Temporal Variation ===
  const temporalVariation = calculateTemporalVariation(energyValues);
  
  // === Rhythm Regularity ===
  const rhythmRegularity = calculateRhythmRegularity(energyValues);
  
  // === Pause Pattern ===
  const pausePattern = analyzePausePattern(energyValues, silenceThreshold);
  
  // === Language-Specific Features ===
  
  // Syllable Rate - estimate based on energy peaks
  const syllableCount = countSyllables(energyValues, rmsEnergy);
  const syllableRate = syllableCount / duration;
  
  // Formant Ratio - approximated from spectral centroid
  const formantRatio = spectralFeatures.centroid / 100;
  
  // Vowel Duration - based on sustained energy segments
  const vowelDuration = estimateVowelDuration(energyValues, sampleRate, frameSize);
  
  // Consonant Density - high ZCR with low energy
  const consonantDensity = estimateConsonantDensity(channelData, sampleRate, energyValues);
  
  // Intonation Pattern - pitch contour variance
  const intonationPattern = pitchValues.length > 2 ? calculateIntonationPattern(pitchValues) : 0.3;
  
  // Stress Pattern - energy peak regularity
  const stressPattern = calculateStressPattern(energyValues);
  
  return {
    pitchMean,
    pitchVariance,
    pitchRange,
    rmsEnergy,
    energyVariance,
    silenceRatio,
    spectralCentroid: spectralFeatures.centroid,
    spectralFlatness: spectralFeatures.flatness,
    spectralRolloff: spectralFeatures.rolloff,
    zeroCrossingRate,
    temporalVariation,
    rhythmRegularity,
    pausePattern,
    syllableRate,
    formantRatio,
    vowelDuration,
    consonantDensity,
    intonationPattern,
    stressPattern,
  };
}

// Count syllables from energy peaks
function countSyllables(energyValues: number[], meanEnergy: number): number {
  const threshold = meanEnergy * 0.7;
  let inSyllable = false;
  let count = 0;
  
  for (const energy of energyValues) {
    if (energy > threshold && !inSyllable) {
      inSyllable = true;
      count++;
    } else if (energy < threshold * 0.5) {
      inSyllable = false;
    }
  }
  
  return Math.max(1, count);
}

// Estimate average vowel duration
function estimateVowelDuration(energyValues: number[], sampleRate: number, frameSize: number): number {
  const threshold = average(energyValues) * 0.6;
  const durations: number[] = [];
  let currentDuration = 0;
  
  for (const energy of energyValues) {
    if (energy > threshold) {
      currentDuration++;
    } else if (currentDuration > 2) {
      durations.push(currentDuration * frameSize / sampleRate);
      currentDuration = 0;
    } else {
      currentDuration = 0;
    }
  }
  
  return durations.length > 0 ? average(durations) : 0.1;
}

// Estimate consonant density
function estimateConsonantDensity(samples: Float32Array, sampleRate: number, energyValues: number[]): number {
  const frameSize = Math.floor(sampleRate * 0.01);
  let consonantFrames = 0;
  let totalFrames = 0;
  const avgEnergy = average(energyValues);
  
  for (let i = 0; i < samples.length - frameSize; i += frameSize) {
    let zcr = 0;
    let energy = 0;
    
    for (let j = 1; j < frameSize; j++) {
      if ((samples[i + j] >= 0) !== (samples[i + j - 1] >= 0)) {
        zcr++;
      }
      energy += samples[i + j] * samples[i + j];
    }
    
    zcr = zcr / frameSize;
    energy = Math.sqrt(energy / frameSize);
    
    // Consonants: high ZCR, moderate energy
    if (zcr > 0.1 && energy > avgEnergy * 0.3 && energy < avgEnergy * 1.5) {
      consonantFrames++;
    }
    totalFrames++;
  }
  
  return consonantFrames / totalFrames;
}

// Calculate intonation pattern variation
function calculateIntonationPattern(pitchValues: number[]): number {
  if (pitchValues.length < 3) return 0.3;
  
  // Calculate pitch contour changes
  const changes: number[] = [];
  for (let i = 1; i < pitchValues.length; i++) {
    changes.push(pitchValues[i] - pitchValues[i - 1]);
  }
  
  // Variance of pitch changes represents intonation variation
  return Math.min(1, calculateVariance(changes) / 500);
}

// Calculate stress pattern regularity
function calculateStressPattern(energyValues: number[]): number {
  const peaks: number[] = [];
  const avgEnergy = average(energyValues);
  
  for (let i = 1; i < energyValues.length - 1; i++) {
    if (energyValues[i] > avgEnergy * 1.2 &&
        energyValues[i] > energyValues[i - 1] &&
        energyValues[i] > energyValues[i + 1]) {
      peaks.push(i);
    }
  }
  
  if (peaks.length < 2) return 0.5;
  
  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i - 1]);
  }
  
  const variance = calculateVariance(intervals);
  const mean = average(intervals);
  
  // Return coefficient of variation (higher = more irregular = stress-timed)
  return mean > 0 ? Math.min(1, variance / mean) : 0.5;
}

// Estimate pitch using autocorrelation
function estimatePitch(samples: Float32Array, sampleRate: number): number[] {
  const frameSize = Math.floor(sampleRate * 0.03); // 30ms frames
  const hopSize = Math.floor(frameSize / 2);
  const pitches: number[] = [];
  
  for (let start = 0; start < samples.length - frameSize; start += hopSize) {
    const frame = samples.slice(start, start + frameSize);
    const pitch = autocorrelationPitch(frame, sampleRate);
    if (pitch > 50 && pitch < 500) { // Human voice range
      pitches.push(pitch);
    }
  }
  
  return pitches;
}

function autocorrelationPitch(frame: Float32Array, sampleRate: number): number {
  const minLag = Math.floor(sampleRate / 500); // Max 500 Hz
  const maxLag = Math.floor(sampleRate / 50);  // Min 50 Hz
  
  let maxCorrelation = 0;
  let bestLag = minLag;
  
  // Calculate energy for normalization
  let energy = 0;
  for (let i = 0; i < frame.length; i++) {
    energy += frame[i] * frame[i];
  }
  
  if (energy < 0.001) return 0; // Silent frame
  
  for (let lag = minLag; lag < Math.min(maxLag, frame.length / 2); lag++) {
    let correlation = 0;
    for (let i = 0; i < frame.length - lag; i++) {
      correlation += frame[i] * frame[i + lag];
    }
    correlation /= energy;
    
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestLag = lag;
    }
  }
  
  if (maxCorrelation < 0.3) return 0; // Not enough periodicity
  
  return sampleRate / bestLag;
}

// Calculate spectral features using FFT approximation
function calculateSpectralFeatures(samples: Float32Array, _sampleRate: number): {
  centroid: number;
  flatness: number;
  rolloff: number;
} {
  const fftSize = 2048;
  const numFrames = Math.floor(samples.length / fftSize);
  
  if (numFrames === 0) {
    return { centroid: 100, flatness: 0.2, rolloff: 0.5 };
  }
  
  let totalCentroid = 0;
  let totalFlatness = 0;
  let totalRolloff = 0;
  
  for (let frame = 0; frame < numFrames; frame++) {
    const start = frame * fftSize;
    const frameData = samples.slice(start, start + fftSize);
    
    // Compute magnitude spectrum (simplified DFT for key frequencies)
    const magnitudes: number[] = [];
    const numBins = 256;
    
    for (let k = 0; k < numBins; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < fftSize; n++) {
        const angle = -2 * Math.PI * k * n / fftSize;
        real += frameData[n] * Math.cos(angle);
        imag += frameData[n] * Math.sin(angle);
      }
      
      magnitudes.push(Math.sqrt(real * real + imag * imag));
    }
    
    // Spectral Centroid
    let weightedSum = 0;
    let magnitudeSum = 0;
    for (let k = 0; k < magnitudes.length; k++) {
      weightedSum += k * magnitudes[k];
      magnitudeSum += magnitudes[k];
    }
    const centroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
    totalCentroid += centroid;
    
    // Spectral Flatness (geometric mean / arithmetic mean)
    const logSum = magnitudes.reduce((sum, m) => sum + Math.log(m + 1e-10), 0);
    const geometricMean = Math.exp(logSum / magnitudes.length);
    const arithmeticMean = magnitudeSum / magnitudes.length;
    const flatness = arithmeticMean > 0 ? geometricMean / arithmeticMean : 0;
    totalFlatness += flatness;
    
    // Spectral Rolloff (85% of energy)
    const totalEnergy = magnitudes.reduce((sum, m) => sum + m * m, 0);
    let cumulativeEnergy = 0;
    let rolloffBin = magnitudes.length - 1;
    for (let k = 0; k < magnitudes.length; k++) {
      cumulativeEnergy += magnitudes[k] * magnitudes[k];
      if (cumulativeEnergy >= 0.85 * totalEnergy) {
        rolloffBin = k;
        break;
      }
    }
    totalRolloff += rolloffBin / magnitudes.length;
  }
  
  return {
    centroid: totalCentroid / numFrames,
    flatness: totalFlatness / numFrames,
    rolloff: totalRolloff / numFrames,
  };
}

function calculateTemporalVariation(energyValues: number[]): number {
  if (energyValues.length < 2) return 0;
  
  let totalDiff = 0;
  for (let i = 1; i < energyValues.length; i++) {
    totalDiff += Math.abs(energyValues[i] - energyValues[i - 1]);
  }
  
  return totalDiff / (energyValues.length - 1);
}

function calculateRhythmRegularity(energyValues: number[]): number {
  // Calculate how regular the energy peaks are
  const threshold = average(energyValues) * 1.2;
  const peakPositions: number[] = [];
  
  for (let i = 1; i < energyValues.length - 1; i++) {
    if (energyValues[i] > threshold && 
        energyValues[i] > energyValues[i - 1] && 
        energyValues[i] > energyValues[i + 1]) {
      peakPositions.push(i);
    }
  }
  
  if (peakPositions.length < 3) return 0.5;
  
  // Calculate intervals between peaks
  const intervals: number[] = [];
  for (let i = 1; i < peakPositions.length; i++) {
    intervals.push(peakPositions[i] - peakPositions[i - 1]);
  }
  
  // Lower variance = more regular rhythm
  const intervalVariance = calculateVariance(intervals);
  const intervalMean = average(intervals);
  const coeffOfVariation = intervalMean > 0 ? intervalVariance / intervalMean : 1;
  
  // Normalize to 0-1 range (lower = more irregular/human-like)
  return Math.min(1, coeffOfVariation / 0.5);
}

function analyzePausePattern(energyValues: number[], threshold: number): number {
  // Count pause lengths and their variance
  const pauseLengths: number[] = [];
  let currentPauseLength = 0;
  
  for (const energy of energyValues) {
    if (energy < threshold) {
      currentPauseLength++;
    } else if (currentPauseLength > 0) {
      pauseLengths.push(currentPauseLength);
      currentPauseLength = 0;
    }
  }
  
  if (pauseLengths.length < 2) return 0.5;
  
  // Natural speech has varied pause lengths
  const variance = calculateVariance(pauseLengths);
  const mean = average(pauseLengths);
  
  return mean > 0 ? Math.min(1, variance / mean) : 0;
}

function average(arr: number[]): number {
  return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function calculateVariance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = average(arr);
  const squaredDiffs = arr.map(x => (x - mean) ** 2);
  return average(squaredDiffs);
}

// Detect language from audio features
function detectLanguage(features: ExtractedFeatures, selectedLanguage: string): LanguageDetectionResult {
  const scores: { [key: string]: number } = {};
  
  for (const [langName, profile] of Object.entries(LANGUAGE_PROFILES)) {
    let score = 0;
    let weightSum = 0;
    
    // Syllable rate matching (weight: 0.25)
    const syllableMatch = 1 - Math.min(1, Math.abs(features.syllableRate - profile.syllableRate.typical) / 3);
    const inSyllableRange = features.syllableRate >= profile.syllableRate.min && features.syllableRate <= profile.syllableRate.max;
    score += (syllableMatch * 0.7 + (inSyllableRange ? 0.3 : 0)) * 0.25;
    weightSum += 0.25;
    
    // Zero crossing rate matching (weight: 0.15)
    const zcrMid = (profile.zeroCrossingRange.min + profile.zeroCrossingRange.max) / 2;
    const zcrMatch = 1 - Math.min(1, Math.abs(features.zeroCrossingRate - zcrMid) / 0.05);
    score += zcrMatch * 0.15;
    weightSum += 0.15;
    
    // Formant ratio matching (weight: 0.15)
    const formantMid = (profile.formantRatio.min + profile.formantRatio.max) / 2;
    const formantMatch = 1 - Math.min(1, Math.abs(features.formantRatio - formantMid) / 0.3);
    score += formantMatch * 0.15;
    weightSum += 0.15;
    
    // Vowel duration matching (weight: 0.15)
    const vowelMid = (profile.vowelDuration.min + profile.vowelDuration.max) / 2;
    const vowelMatch = 1 - Math.min(1, Math.abs(features.vowelDuration - vowelMid) / 0.1);
    score += vowelMatch * 0.15;
    weightSum += 0.15;
    
    // Rhythm type matching (weight: 0.15)
    // Stress-timed languages have higher stress pattern variance
    const isStressTimed = features.stressPattern > 0.4;
    const rhythmMatch = (profile.rhythmType === 'stress-timed' && isStressTimed) ||
                       (profile.rhythmType === 'syllable-timed' && !isStressTimed) ? 1 : 0.3;
    score += rhythmMatch * 0.15;
    weightSum += 0.15;
    
    // Intonation pattern matching (weight: 0.15)
    const intonationMatch = 1 - Math.min(1, Math.abs(features.intonationPattern - profile.intonationVariance) / 0.2);
    score += intonationMatch * 0.15;
    weightSum += 0.15;
    
    scores[langName] = score / weightSum;
  }
  
  // Find the language with highest score
  let detectedLanguage = selectedLanguage;
  let maxScore = 0;
  
  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = lang;
    }
  }
  
  // Check if the detected language matches the selected one
  const isLanguageMatch = detectedLanguage.toLowerCase() === selectedLanguage.toLowerCase();
  
  // Calculate confidence based on the difference between top scores
  const sortedScores = Object.values(scores).sort((a, b) => b - a);
  const confidence = sortedScores.length > 1 
    ? Math.min(0.95, maxScore * 0.7 + (sortedScores[0] - sortedScores[1]) * 0.5)
    : maxScore;
  
  return {
    detectedLanguage,
    confidence: Math.round(confidence * 100) / 100,
    languageScores: Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Math.round(v * 100) / 100])
    ),
    isLanguageMatch,
    selectedLanguage,
  };
}

// Main analysis function - Detect AI vs Human
export function analyzeAudioFeatures(features: ExtractedFeatures, selectedLanguage: string): AudioAnalysisResult {
  const reasons: string[] = [];
  let aiScore = 0;
  let totalWeight = 0;
  
  // First detect language
  const languageDetection = detectLanguage(features, selectedLanguage);
  
  // === 1. Pitch Variance Analysis ===
  // AI voices tend to have very consistent pitch (low variance)
  const pitchVarianceNorm = Math.min(features.pitchVariance / 2000, 1);
  if (pitchVarianceNorm < 0.15) {
    aiScore += 0.2;
    reasons.push("Unnatural pitch consistency detected - very low pitch variation");
  } else if (pitchVarianceNorm < 0.25) {
    aiScore += 0.1;
    reasons.push("Below-average pitch variation");
  } else {
    reasons.push("Natural pitch fluctuations detected");
  }
  totalWeight += 0.2;
  
  // === 2. Pitch Range ===
  // Human speech typically has wider pitch range
  const pitchRangeNorm = Math.min(features.pitchRange / 150, 1);
  if (pitchRangeNorm < 0.2) {
    aiScore += 0.15;
    reasons.push("Narrow pitch range suggests synthetic origin");
  } else {
    reasons.push("Healthy pitch range observed");
  }
  totalWeight += 0.15;
  
  // === 3. Energy Variance ===
  // AI tends to have more uniform energy
  const energyVarNorm = Math.min(features.energyVariance * 100, 1);
  if (energyVarNorm < 0.1) {
    aiScore += 0.15;
    reasons.push("Overly consistent energy levels - robotic pattern");
  } else {
    reasons.push("Natural energy dynamics present");
  }
  totalWeight += 0.15;
  
  // === 4. Spectral Flatness ===
  // AI voices often have smoother spectra
  if (features.spectralFlatness > 0.3) {
    aiScore += 0.1;
    reasons.push("High spectral flatness indicates synthetic processing");
  }
  totalWeight += 0.1;
  
  // === 5. Temporal Variation ===
  // Human speech has more micro-variations
  if (features.temporalVariation < 0.02) {
    aiScore += 0.15;
    reasons.push("Lack of natural micro-variations in amplitude");
  } else {
    reasons.push("Organic temporal variations detected");
  }
  totalWeight += 0.15;
  
  // === 6. Rhythm Regularity ===
  // AI tends to have more regular rhythm
  if (features.rhythmRegularity < 0.3) {
    aiScore += 0.1;
    reasons.push("Artificially regular speech rhythm");
  } else {
    reasons.push("Natural speech rhythm patterns");
  }
  totalWeight += 0.1;
  
  // === 7. Pause Pattern ===
  // Natural speech has varied pause lengths
  if (features.pausePattern < 0.25) {
    aiScore += 0.1;
    reasons.push("Uniform pause patterns unlike natural speech");
  } else {
    reasons.push("Authentic pause patterns identified");
  }
  totalWeight += 0.1;
  
  // === 8. Silence Ratio ===
  // Check for natural breathing/pause patterns
  if (features.silenceRatio < 0.05 || features.silenceRatio > 0.4) {
    aiScore += 0.05;
    reasons.push("Unusual silence ratio in speech");
  }
  totalWeight += 0.05;
  
  // Normalize score
  const normalizedScore = aiScore / totalWeight;
  const isAI = normalizedScore > 0.35; // Threshold for AI classification
  
  // Calculate confidence
  const distanceFromThreshold = Math.abs(normalizedScore - 0.35);
  const confidence = Math.min(0.99, 0.6 + distanceFromThreshold * 1.5);
  
  // Filter reasons to show most relevant
  const relevantReasons = isAI 
    ? reasons.filter(r => r.includes("Unnatural") || r.includes("synthetic") || r.includes("robotic") || r.includes("Artificial") || r.includes("Overly") || r.includes("Lack") || r.includes("Narrow") || r.includes("Uniform") || r.includes("Below"))
    : reasons.filter(r => r.includes("Natural") || r.includes("Organic") || r.includes("Healthy") || r.includes("Authentic"));
  
  return {
    isAI,
    confidence,
    features,
    reasons: relevantReasons.slice(0, 3),
    languageDetection,
  };
}

// Complete analysis pipeline
export async function analyzeAudio(base64Data: string, selectedLanguage: string): Promise<AudioAnalysisResult> {
  try {
    const audioBuffer = await decodeAudioFromBase64(base64Data);
    const features = extractFeatures(audioBuffer);
    return analyzeAudioFeatures(features, selectedLanguage);
  } catch (error) {
    console.error('Audio analysis error:', error);
    throw new Error('Failed to analyze audio: ' + (error as Error).message);
  }
}
