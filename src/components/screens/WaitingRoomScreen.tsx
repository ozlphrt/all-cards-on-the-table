import React, { useEffect } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";

export const WaitingRoomScreen: React.FC = () => {
  const { players, gameState, syncGameState, setScreen } = useSessionStore();
  const { t } = useLanguageStore();

  // Sync state periodically
  useEffect(() => {
    if (gameState.gamePin) {
      const interval = setInterval(() => {
        syncGameState();
      }, 2000); // Sync every 2 seconds

      return () => clearInterval(interval);
    }
  }, [gameState.gamePin, syncGameState]);

  const canStart = players.length >= 2 && gameState.isHost;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
      <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.65)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] shadow-2xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <h2 className="text-2xl font-serif mb-4">
          {gameState.isHost ? t.gameFlow.createGame : t.gameFlow.joinGame}
        </h2>
        
        {gameState.gamePin && (
          <div className="mb-6">
            <label className="text-xs text-[#8B8172] mb-2 block">
              {t.gameFlow.gamePin}
            </label>
            <div className="px-4 py-3 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-2xl font-mono text-center tracking-wider">
              {gameState.gamePin}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="text-xs text-[#8B8172] mb-2 block">
            {t.setup.players} ({players.length})
          </label>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="px-4 py-2 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] text-sm"
              >
                {player.name}
                {gameState.isHost && player.id === players[0]?.id && (
                  <span className="ml-2 text-xs text-[#D0A96B]">(Host)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-[#C6B9A5] mb-6 text-center">
          {gameState.isHost
            ? t.gameFlow.waitingForPlayers
            : "Waiting for host to start the game..."}
        </p>

        {gameState.isHost && (
          <div className="flex gap-3">
            <button
              onClick={() => setScreen("WELCOME")}
              className="flex-1 px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
            >
              {t.setup.back}
            </button>
            <button
              onClick={() => setScreen("SETUP_SESSION")}
              disabled={!canStart}
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {t.gameFlow.startGame}
            </button>
          </div>
        )}

        {!gameState.isHost && (
          <button
            onClick={() => setScreen("WELCOME")}
            className="w-full px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
          >
            {t.setup.back}
          </button>
        )}
      </div>
    </div>
  );
};

