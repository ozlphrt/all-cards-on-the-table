import React from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";

export const WelcomeScreen: React.FC = () => {
  const setScreen = useSessionStore((s) => s.setScreen);
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
      <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <h1 className="text-3xl font-serif mb-3">{t.welcome.title}</h1>
        <p className="text-sm text-[#C6B9A5] mb-8">
          {t.welcome.tagline}
        </p>
        <div className="space-y-3">
          <div className="relative">
            <button
              onClick={() => setScreen("CREATE_GAME")}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] font-medium hover:opacity-90 transition-opacity opacity-60 cursor-not-allowed"
              disabled
            >
              {t.welcome.createGame}
            </button>
            <span className="absolute top-2 right-2 text-xs bg-[rgba(0,0,0,0.6)] text-[#C6B9A5] px-2 py-0.5 rounded">
              {t.welcome.underConstruction || "Under Construction"}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setScreen("JOIN_GAME")}
              className="w-full py-3 rounded-2xl border border-[rgba(255,255,255,0.12)] text-[#C6B9A5] font-medium hover:border-[rgba(255,255,255,0.18)] transition-colors opacity-60 cursor-not-allowed"
              disabled
            >
              {t.welcome.joinGame}
            </button>
            <span className="absolute top-2 right-2 text-xs bg-[rgba(0,0,0,0.6)] text-[#C6B9A5] px-2 py-0.5 rounded">
              {t.welcome.underConstruction || "Under Construction"}
            </span>
          </div>
          <button
            onClick={() => setScreen("SINGLE_PLAYER")}
            className="w-full py-3 rounded-2xl border border-[rgba(255,255,255,0.12)] text-[#C6B9A5] font-medium hover:border-[rgba(255,255,255,0.18)] transition-colors"
          >
            {t.welcome.singlePlayer}
          </button>
        </div>
      </div>
    </div>
  );
};

