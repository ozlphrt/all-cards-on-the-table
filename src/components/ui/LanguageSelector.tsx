import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguageStore } from "../../i18n/languageStore";
import type { Language } from "../../i18n/translations";

const languages: { code: Language; label: string; flagCode: string }[] = [
  { code: "en", label: "English", flagCode: "us" },
  { code: "tr", label: "Türkçe", flagCode: "tr" },
];

const getFlagUrl = (flagCode: string, size: number = 40) => {
  return `https://flagcdn.com/w${size}/${flagCode}.png`;
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative z-[100]">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-6 rounded bg-[rgba(25,20,40,0.9)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all flex items-center justify-center hover:scale-110 overflow-hidden"
          aria-label="Select language"
        >
          <img
            src={getFlagUrl(currentLanguage.flagCode, 40)}
            alt={currentLanguage.label}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-48 rounded-xl bg-[rgba(25,20,40,0.95)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl z-[99999] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left text-sm transition-colors ${
                language === lang.code
                  ? "bg-[rgba(208,169,107,0.2)] text-[#D0A96B]"
                  : "text-[#C6B9A5] hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              <img
                src={getFlagUrl(lang.flagCode, 40)}
                alt={lang.label}
                className="w-7 h-5 object-cover rounded"
                loading="lazy"
              />
              <span>{lang.label}</span>
              {language === lang.code && (
                <span className="ml-auto text-[#D0A96B]">✓</span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

