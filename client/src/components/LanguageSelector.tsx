import { useState, useRef, useEffect } from "react";
import { Language } from "../types/translation";

interface LanguageSelectorProps {
  languages: Language[];
  selectedCode: string;
  quickAccessCodes: string[];
  onSelect: (code: string) => void;
}

export default function LanguageSelector({
  languages,
  selectedCode,
  quickAccessCodes,
  onSelect,
}: LanguageSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const quickAccessLangs = quickAccessCodes
    .map((code) => languages.find((l) => l.code === code))
    .filter((l): l is Language => l !== undefined);

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]);

  const selectedName =
    languages.find((l) => l.code === selectedCode)?.name ?? selectedCode;

  return (
    <div className="language-selector" ref={dropdownRef}>
      <div className="language-tabs">
        {quickAccessLangs.map((lang) => (
          <button
            key={lang.code}
            className={`language-tab ${selectedCode === lang.code ? "active" : ""}`}
            onClick={() => onSelect(lang.code)}
          >
            {lang.name}
          </button>
        ))}
        <button
          className={`language-tab language-tab-more ${
            !quickAccessCodes.includes(selectedCode) ? "active" : ""
          }`}
          onClick={() => setDropdownOpen((o) => !o)}
          title="More languages"
        >
          {!quickAccessCodes.includes(selectedCode) ? selectedName : "More"}
          <span className="dropdown-arrow">▾</span>
        </button>
      </div>

      {dropdownOpen && (
        <>
          <div
            className="language-dropdown-overlay"
            onClick={() => {
              setDropdownOpen(false);
              setSearch("");
            }}
          />
          <div className="language-dropdown">
            <div className="language-search-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                className="language-search"
                placeholder="Search languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ul className="language-list">
              {filtered.map((lang) => (
                <li
                  key={lang.code}
                  className={`language-option ${selectedCode === lang.code ? "selected" : ""}`}
                  onClick={() => {
                    onSelect(lang.code);
                    setDropdownOpen(false);
                    setSearch("");
                  }}
                >
                  {lang.name}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="language-option no-results">No results</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
