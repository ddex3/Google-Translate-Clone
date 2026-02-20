import { Request, Response, NextFunction } from "express";
import { TranslateRequest, TranslateErrorResponse } from "../types/translation";

const MAX_TEXT_LENGTH = 5000;

const VALID_LANGUAGE_CODES = new Set([
  "auto", "af", "sq", "am", "ar", "hy", "as", "ay", "az", "bm", "eu", "be",
  "bn", "bho", "bs", "bg", "ca", "ceb", "zh", "zh-CN", "zh-TW", "co", "hr",
  "cs", "da", "dv", "doi", "nl", "en", "eo", "et", "ee", "fil", "fi", "fr",
  "fy", "gl", "ka", "de", "el", "gn", "gu", "ht", "ha", "haw", "he", "hi",
  "hmn", "hu", "is", "ig", "ilo", "id", "ga", "it", "ja", "jv", "kn", "kk",
  "km", "rw", "gom", "ko", "kri", "ku", "ckb", "ky", "lo", "la", "lv", "ln",
  "lt", "lg", "lb", "mk", "mai", "mg", "ms", "ml", "mt", "mi", "mr", "mni-Mtei",
  "lus", "mn", "my", "ne", "no", "ny", "or", "om", "ps", "fa", "pl", "pt",
  "pa", "qu", "ro", "ru", "sm", "sa", "gd", "nso", "sr", "st", "sn", "sd",
  "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tl", "tg", "ta", "tt",
  "te", "th", "ti", "ts", "tr", "tk", "ak", "uk", "ur", "ug", "uz", "vi",
  "cy", "xh", "yi", "yo", "zu",
]);

export function validateTranslateInput(
  req: Request,
  res: Response<TranslateErrorResponse>,
  next: NextFunction
): void {
  const { text, source, target } = req.body as Partial<TranslateRequest>;

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Field 'text' is required and must be a string." });
    return;
  }

  if (text.trim().length === 0) {
    res.status(400).json({ error: "Field 'text' must not be empty." });
    return;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    res.status(400).json({
      error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters.`,
    });
    return;
  }

  if (!source || typeof source !== "string") {
    res.status(400).json({ error: "Field 'source' is required and must be a string." });
    return;
  }

  if (!target || typeof target !== "string") {
    res.status(400).json({ error: "Field 'target' is required and must be a string." });
    return;
  }

  if (!VALID_LANGUAGE_CODES.has(source)) {
    res.status(400).json({ error: `Invalid source language code: '${source}'.` });
    return;
  }

  if (!VALID_LANGUAGE_CODES.has(target) || target === "auto") {
    res.status(400).json({ error: `Invalid target language code: '${target}'.` });
    return;
  }

  if (source === target && source !== "auto") {
    res.status(400).json({ error: "Source and target languages must be different." });
    return;
  }

  next();
}
