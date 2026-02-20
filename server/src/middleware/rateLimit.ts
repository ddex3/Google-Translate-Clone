import rateLimit from "express-rate-limit";

export const translateRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many translation requests. Please try again shortly.",
  },
});
