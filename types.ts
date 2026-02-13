export enum AppMode {
  SCENE = 'SCENE',
  OBJECT = 'OBJECT'
}

export type Language = 'fr' | 'en' | 'ar';

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface TtsOptions {
  rate?: number;
  volume?: number;
  pitch?: number;
  lang?: string;
}