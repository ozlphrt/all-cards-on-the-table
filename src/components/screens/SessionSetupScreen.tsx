import React, { useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";
import type { DeckTag, IntensityLevel } from "../../data/cards";

const getDecks = (t: ReturnType<typeof useLanguageStore.getState>["t"]): { id: DeckTag; label: string }[] => [
  { id: "all", label: t.decks.all },
  { id: "nostalgia", label: t.decks.nostalgia },
  { id: "love", label: t.decks.love },
  { id: "identity", label: t.decks.identity },
  { id: "deep_waters", label: t.decks.deepWaters },
  { id: "shadow", label: t.decks.shadows },
  { id: "philosophy", label: t.decks.philosophy },
  { id: "story", label: t.decks.story },
  { id: "couple", label: t.decks.couple },
];

export const SessionSetupScreen: React.FC = () => {
  const {
    players,
    settings,
    gameState,
    updateSettings,
    setScreen,
    startSession,
    syncGameState,
  } = useSessionStore();
  const { t } = useLanguageStore();
  const allDecks = getDecks(t);

  const toggleDeck = (id: DeckTag) => {
    const current = settings.selectedDeckTags;
    const exists = current.includes(id);
    let next = current;
    if (exists) next = current.filter((d) => d !== id);
    else next = [...current, id];

    // always ensure all is present
    if (!next.includes("all")) next = ["all", ...next];

    updateSettings({ selectedDeckTags: next });
    if (gameState.gamePin) syncGameState();
  };

  const setMinIntensity = (level: IntensityLevel) => {
    const newMin = level;
    const currentMax = settings.maxIntensity;
    // Ensure min doesn't exceed max
    if (newMin > currentMax) {
      updateSettings({ minIntensity: newMin, maxIntensity: newMin });
    } else {
      updateSettings({ minIntensity: newMin });
    }
    if (gameState.gamePin) syncGameState();
  };

  const setMaxIntensity = (level: IntensityLevel) => {
    const newMax = level;
    const currentMin = settings.minIntensity;
    // Ensure max doesn't go below min
    if (newMax < currentMin) {
      updateSettings({ minIntensity: newMax, maxIntensity: newMax });
    } else {
      updateSettings({ maxIntensity: newMax });
    }
    if (gameState.gamePin) syncGameState();
  };

  return (
    <div className="min-h-screen px-4 py-6 text-[#F7F2E9] bg-[radial-gradient(circle_at_top,_#201824,_#050509)]">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif">{t.setup.title}</h2>
          <LanguageSelector />
        </div>

        {/* Players */}
        <section className="bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-[#C6B9A5]">
            {t.setup.players} ({players.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(30,25,45,0.9)] text-xs"
              >
                <span>{p.name}</span>
                {gameState.isHost && p.id === players[0]?.id && (
                  <span className="text-[#D0A96B]">(Host)</span>
                )}
              </div>
            ))}
          </div>
          {gameState.gamePin && (
            <p className="text-xs text-[#8B8172] mt-2">
              Players join via PIN: {gameState.gamePin}
            </p>
          )}
        </section>

        {/* Deck selection */}
        <section className="bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-[#C6B9A5]">
            {t.setup.decks}
          </h3>
          <div className="flex flex-wrap gap-2">
            {allDecks.map((deck) => {
              const active = settings.selectedDeckTags.includes(deck.id);
              return (
                <button
                  key={deck.id}
                  onClick={() => toggleDeck(deck.id)}
                  className={`px-3 py-1 rounded text-xs border transition
                    ${
                      active
                        ? "bg-[#D0A96B] text-[#1a1208] border-transparent"
                        : "bg-[rgba(25,20,40,0.9)] text-[#C6B9A5] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]"
                    }
                  `}
                >
                  {deck.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Intensity */}
        <section className="bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-[#C6B9A5]">
            {t.setup.intensity}
          </h3>
          <p className="text-xs text-[#8B8172] mb-1">
            {t.setup.intensityDescription}
          </p>
          <div className="flex items-center gap-2 justify-center relative">
            <div className="absolute left-0 top-0 text-[10px] text-[#8B8172]">Min</div>
            <div className="absolute right-0 top-0 text-[10px] text-[#8B8172]">Max</div>
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isMin = settings.minIntensity === lvl;
              const isMax = settings.maxIntensity === lvl;
              const isInRange = lvl >= settings.minIntensity && lvl <= settings.maxIntensity;
              
              return (
                <button
                  key={lvl}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const isLeftClick = clickX < rect.width / 2;
                    
                    if (isLeftClick) {
                      // Left click sets minimum
                      setMinIntensity(lvl as IntensityLevel);
                    } else {
                      // Right click sets maximum
                      setMaxIntensity(lvl as IntensityLevel);
                    }
                  }}
                  className="flex flex-col items-center text-xs relative group"
                  title={`Click left for min, right for max`}
                >
                  <span
                    className={`w-10 h-7 rounded flex items-center justify-center border transition relative
                      ${
                        isMin || isMax
                          ? "bg-gradient-to-b from-[#F4C879] to-[#D0A96B] text-[#1a1208] border-transparent"
                          : isInRange
                          ? "bg-[rgba(208,169,107,0.3)] text-[#C6B9A5] border-[rgba(208,169,107,0.4)]"
                          : "bg-[rgba(20,20,30,0.9)] text-[#8B8172] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]"
                      }
                    `}
                  >
                    {lvl}
                  </span>
                  {isMin && (
                    <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[8px] text-[#D0A96B]">min</span>
                  )}
                  {isMax && (
                    <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[8px] text-[#D0A96B]">max</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-center text-xs text-[#8B8172] mt-4">
            Intensity range: {settings.minIntensity} - {settings.maxIntensity}
          </div>
        </section>

        <div className="flex gap-3 justify-end pt-4">
          <button
            className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5] hover:border-[rgba(255,255,255,0.18)] transition-colors"
            onClick={() => setScreen("WELCOME")}
          >
            {t.setup.back}
          </button>
          <button
            disabled={players.length < 2}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            onClick={() => {
              if (gameState.gamePin) syncGameState();
              startSession();
            }}
          >
            {t.setup.beginEvening}
          </button>
        </div>
      </div>
    </div>
  );
};

