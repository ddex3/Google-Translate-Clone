import {
  TranslateRequest,
  TranslateResponse,
  TranslateErrorResponse,
} from "../types/translation";

const API_URL = "/translate";

export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData: TranslateErrorResponse = await response.json();
    throw new Error(errorData.error || "Translation failed.");
  }

  return response.json() as Promise<TranslateResponse>;
}
