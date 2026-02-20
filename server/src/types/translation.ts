export interface TranslateRequest {
  text: string;
  source: string;
  target: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface TranslateErrorResponse {
  error: string;
  details?: string;
}
