import { create } from "zustand";
import type { Language } from "./translations";
import { translations } from "./translations";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

// Load from localStorage on init
const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem("all-cards-language");
    const validLanguages: Language[] = ["en", "tr"];
    if (stored && validLanguages.includes(stored as Language)) {
      return stored as Language;
    }
  } catch (e) {
    // ignore
  }
  return "en";
};

const initialLanguage = getStoredLanguage();

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: initialLanguage,
  t: translations[initialLanguage],
  setLanguage: (lang) => {
    localStorage.setItem("all-cards-language", lang);
    set({ language: lang, t: translations[lang] });
  },
}));

