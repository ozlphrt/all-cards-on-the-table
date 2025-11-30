import React, { useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";

export const CreateGameScreen: React.FC = () => {
  const { createGame, setScreen } = useSessionStore();
  const { t } = useLanguageStore();
  const [playerName, setPlayerName] = useState("");
  const [gamePin, setGamePin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!playerName.trim()) return;
    const pin = createGame(playerName.trim());
    setGamePin(pin);
  };

  const copyPin = () => {
    if (gamePin) {
      navigator.clipboard.writeText(gamePin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (gamePin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
        <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <h2 className="text-2xl font-serif mb-4">{t.gameFlow.createGame}</h2>
          <p className="text-sm text-[#C6B9A5] mb-6">
            {t.gameFlow.createGameDescription}
          </p>
          
          <div className="mb-6">
            <label className="text-xs text-[#8B8172] mb-2 block">
              {t.gameFlow.gamePin}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-2xl font-mono text-center tracking-wider">
                {gamePin}
              </div>
              <button
                onClick={copyPin}
                className="px-4 py-3 rounded-xl bg-[rgba(208,169,107,0.2)] border border-[rgba(208,169,107,0.4)] text-sm text-[#D0A96B] hover:bg-[rgba(208,169,107,0.3)] transition-colors"
              >
                {copied ? t.gameFlow.pinCopied : t.gameFlow.copyPin}
              </button>
            </div>
          </div>

          <p className="text-sm text-[#C6B9A5] mb-6 text-center">
            {t.gameFlow.waitingForPlayers}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setScreen("WELCOME")}
              className="flex-1 px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
            >
              {t.setup.back}
            </button>
            <button
              onClick={() => setScreen("SETUP_SESSION")}
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm hover:opacity-90 transition-opacity"
            >
              {t.gameFlow.startGame}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
      <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <h2 className="text-2xl font-serif mb-4">{t.gameFlow.createGame}</h2>
        <p className="text-sm text-[#C6B9A5] mb-6">
          {t.gameFlow.createGameDescription}
        </p>
        
        <div className="mb-6">
          <label className="text-xs text-[#8B8172] mb-2 block">
            {t.gameFlow.yourName}
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-sm text-[#F7F2E9] placeholder-[#8B8172] focus:outline-none focus:border-[rgba(208,169,107,0.3)]"
            placeholder={t.gameFlow.namePlaceholder}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && playerName.trim()) {
                handleCreate();
              }
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setScreen("WELCOME")}
            className="flex-1 px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
          >
            {t.setup.back}
          </button>
          <button
            onClick={handleCreate}
            disabled={!playerName.trim()}
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {t.gameFlow.createGame}
          </button>
        </div>
      </div>
    </div>
  );
};

