export type Language = 'Tamil' | 'English' | 'Hindi' | 'Malayalam' | 'Telugu';

export type Classification = 'AI_GENERATED' | 'HUMAN';

export interface DetectionRequest {
  language: Language;
  audioFormat: 'mp3';
  audioBase64: string;
}

export interface DetectionResponse {
  status: 'success';
  language: Language;
  classification: Classification;
  confidenceScore: number;
  explanation: string;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
}

export interface AudioFeatures {
  mfcc: number[];
  pitchVariation: number;
  spectralFlatness: number;
  prosodyScore: number;
  temporalConsistency: number;
}
