import { useState, useEffect, useRef, useCallback } from "react";
import { translateText } from "./api/translate";
import {
  languages,
  AUTO_DETECT,
  DEFAULT_SOURCE,
  DEFAULT_TARGET,
} from "./config/languages";
import { Language } from "./types/translation";
import LanguageSelector from "./components/LanguageSelector";
import TextPanel from "./components/TextPanel";
import SwapButton from "./components/SwapButton";
import CopyButton from "./components/CopyButton";
import Loader from "./components/Loader";

const sourceLanguages: Language[] = [AUTO_DETECT, ...languages];
const targetLanguages: Language[] = languages;

const SOURCE_QUICK_ACCESS = ["auto", "he", "en", "ar"];
const TARGET_QUICK_ACCESS = ["he", "en", "ar"];

export default function App() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState(DEFAULT_SOURCE);
  const [targetLang, setTargetLang] = useState(DEFAULT_TARGET);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doTranslate = useCallback(
    async (text: string, source: string, target: string) => {
      if (!text.trim()) {
        setTranslatedText("");
        setDetectedLang(null);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await translateText({ text, source, target });
        if (!controller.signal.aborted) {
          setTranslatedText(result.translatedText);
          setDetectedLang(result.detectedSourceLanguage ?? null);
        }
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : "Translation failed.";
          setError(message);
          setTranslatedText("");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      doTranslate(sourceText, sourceLang, targetLang);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [sourceText, sourceLang, targetLang, doTranslate]);

  function handleSwap() {
    if (sourceLang === "auto") return;
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevTranslated = translatedText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setSourceText(prevTranslated);
  }

  function handleClear() {
    setSourceText("");
    setTranslatedText("");
    setError(null);
    setDetectedLang(null);
  }

  return (
    <>
      <header className="header">
        <a href="/" className="header-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#4285f4">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
          </svg>
          <span className="header-title">Translate by Shaked Angel</span>
        </a>
      </header>

      <main className="translator-wrapper">
        <div className="translator-container">
          <div className="panel panel-source">
            <div className="panel-header">
              <LanguageSelector
                languages={sourceLanguages}
                selectedCode={sourceLang}
                quickAccessCodes={SOURCE_QUICK_ACCESS}
                onSelect={setSourceLang}
              />
            </div>
            <div className="panel-body">
              {sourceText && (
                <button
                  className="clear-button"
                  onClick={handleClear}
                  title="Clear"
                  aria-label="Clear source text"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <TextPanel
                value={sourceText}
                onChange={setSourceText}
                placeholder="Enter text"
              />
            </div>
            <div className="panel-footer">
              <div>
                {detectedLang && (
                  <span className="detected-lang">
                    Detected:{" "}
                    {languages.find((l) => l.code === detectedLang)?.name ??
                      detectedLang}
                  </span>
                )}
              </div>
              <div />
            </div>
          </div>

          <div className="swap-button-wrapper">
            <SwapButton
              onClick={handleSwap}
              disabled={sourceLang === "auto"}
            />
          </div>

          <div className="panel panel-target">
            <div className="panel-header">
              <LanguageSelector
                languages={targetLanguages}
                selectedCode={targetLang}
                quickAccessCodes={TARGET_QUICK_ACCESS}
                onSelect={setTargetLang}
              />
            </div>
            <div className="panel-body">
              {loading ? (
                <Loader />
              ) : (
                <TextPanel
                  value={translatedText}
                  readOnly
                  placeholder="Translation"
                />
              )}
              {error && (
                <div className="error-banner">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                  <button
                    className="error-dismiss"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <div className="panel-footer">
              <div />
              <CopyButton text={translatedText} />
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
            </svg>
            <span>Translate by Shaked Angel</span>
          </div>
          <div className="footer-links">
            <a href="https://github.com/ddex3" target="_blank" rel="noopener noreferrer" className="footer-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a href="https://github.com/ddex3/Google-Translate-Clone" target="_blank" rel="noopener noreferrer" className="footer-link">
              Source Code
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Shaked Angel. All rights reserved.</p>
          <p className="footer-sub">Powered by Google Cloud Translation API</p>
        </div>
      </footer>
    </>
  );
}
