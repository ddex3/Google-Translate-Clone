import { v2 } from "@google-cloud/translate";
import { env } from "../config/env";
import { TranslateRequest, TranslateResponse } from "../types/translation";

const translateClient = new v2.Translate({
  projectId: env.GOOGLE_PROJECT_ID,
  key: env.GOOGLE_API_KEY,
});

export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  const { text, source, target } = request;

  const options: v2.TranslateRequest = {
    from: source === "auto" ? undefined : source,
    to: target,
  };

  const [translation, apiResponse] = await translateClient.translate(
    text,
    options
  );

  const detectedSourceLanguage =
    source === "auto"
      ? apiResponse?.data?.translations?.[0]?.detectedSourceLanguage
      : undefined;

  return {
    translatedText: Array.isArray(translation)
      ? translation.join("")
      : translation,
    detectedSourceLanguage,
  };
}
