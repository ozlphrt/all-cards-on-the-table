import React, { useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";

export const JoinGameScreen: React.FC = () => {
  const { joinGame, setScreen } = useSessionStore();
  const { t } = useLanguageStore();
  const [playerName, setPlayerName] = useState("");
  const [gamePin, setGamePin] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!playerName.trim() || !gamePin.trim()) return;
    if (gamePin.length !== 4 || !/^\d+$/.test(gamePin)) {
      setError(t.gameFlow.invalidPin);
      return;
    }
    
    const success = joinGame(gamePin.trim(), playerName.trim());
    if (success) {
      setScreen("WAITING_ROOM");
    } else {
      setError(t.gameFlow.invalidPin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
      <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <h2 className="text-2xl font-serif mb-4">{t.gameFlow.joinGame}</h2>
        <p className="text-sm text-[#C6B9A5] mb-6">
          {t.gameFlow.joinGameDescription}
        </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-[#8B8172] mb-2 block">
              {t.gameFlow.yourName}
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-sm text-[#F7F2E9] placeholder-[#8B8172] focus:outline-none focus:border-[rgba(208,169,107,0.3)]"
              placeholder={t.gameFlow.namePlaceholder}
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError("");
              }}
            />
          </div>
          
          <div>
            <label className="text-xs text-[#8B8172] mb-2 block">
              {t.gameFlow.enterPin}
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-sm text-[#F7F2E9] placeholder-[#8B8172] focus:outline-none focus:border-[rgba(208,169,107,0.3)] text-center font-mono text-2xl tracking-wider"
              placeholder={t.gameFlow.pinPlaceholder}
              value={gamePin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setGamePin(value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerName.trim() && gamePin.length === 4) {
                  handleJoin();
                }
              }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setScreen("WELCOME")}
            className="flex-1 px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
          >
            {t.setup.back}
          </button>
          <button
            onClick={handleJoin}
            disabled={!playerName.trim() || gamePin.length !== 4}
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {t.gameFlow.joinGame}
          </button>
        </div>
      </div>
    </div>
  );
};

