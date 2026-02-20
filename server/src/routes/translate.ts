import { Router, Request, Response } from "express";
import { translateText } from "../services/googleTranslate";
import { validateTranslateInput } from "../middleware/validateInput";
import { translateRateLimiter } from "../middleware/rateLimit";
import {
  TranslateRequest,
  TranslateResponse,
  TranslateErrorResponse,
} from "../types/translation";

const router = Router();

router.post(
  "/",
  translateRateLimiter,
  validateTranslateInput,
  async (
    req: Request<object, TranslateResponse | TranslateErrorResponse, TranslateRequest>,
    res: Response<TranslateResponse | TranslateErrorResponse>
  ) => {
    try {
      const { text, source, target } = req.body;
      const result = await translateText({ text, source, target });
      res.json(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Translation failed.";
      console.error("Translation error:", message);
      res.status(500).json({
        error: "Translation service error.",
        details:
          process.env.NODE_ENV === "development" ? message : undefined,
      });
    }
  }
);

export default router;
