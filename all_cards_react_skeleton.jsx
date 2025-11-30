// ALL_CARDS_REACT_SKELETON.md
// High-level React + TypeScript skeleton for "All Cards on the Table"
// Assumes a Vite + React + TS setup, with Zustand for state management.

// Suggested project structure:
// src/
//   main.tsx
//   App.tsx
//   data/cards.ts
//   state/sessionStore.ts
//   components/layout/AppShell.tsx
//   components/screens/WelcomeScreen.tsx
//   components/screens/SessionSetupScreen.tsx
//   components/screens/MainGameScreen.tsx
//   components/screens/ClosingRitualScreen.tsx
//   components/ui/CandleIntensitySelector.tsx
//   components/ui/DeckChips.tsx
//   components/ui/PlayerStrip.tsx
//   components/ui/QuestionCard.tsx
//   components/ui/CardCarousel.tsx
//   components/ui/AnswerOverlay.tsx

// This file provides core code snippets for these pieces.

// -----------------------------
// src/data/cards.ts
// -----------------------------

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export type ThemeTag =
  | "nostalgia"
  | "love"
  | "identity"
  | "deep_waters"
  | "shadow"
  | "philosophy"
  | "story"
  | "couple"
  | "group"
  | "closing";

export type DeckTag =
  | "master"
  | "nostalgia"
  | "love"
  | "identity"
  | "deep_waters"
  | "shadow"
  | "philosophy"
  | "story"
  | "couple"
  | "group"
  | "closing";

export type CardFormat =
  | "solo"
  | "solo_with_followup"
  | "story"
  | "story_with_followup"
  | "couple"
  | "couple_with_followup"
  | "group"
  | "closing_personal"
  | "closing_group";

export interface Card {
  id: string;
  text: string;
  intensity_level: IntensityLevel;
  themes: ThemeTag[];
  formats: CardFormat[];
  deck_tags: DeckTag[];
  is_story_card?: boolean;
  is_couple_card?: boolean;
  is_closing_card?: boolean;
  notes?: string;
}

// TODO: generate this array from ALL_CARDS_QUESTION_SET_MASTER.md
export const ALL_CARDS: Card[] = [];

// -----------------------------
// src/state/sessionStore.ts
// -----------------------------

import { create } from "zustand";
import type { Card, DeckTag, IntensityLevel } from "../data/cards";

export interface Player {
  id: string;
  name: string;
  coupleGroupId?: string;
}

export interface SessionSettings {
  selectedDeckTags: DeckTag[];
  maxIntensity: IntensityLevel;
  autoIncreaseIntensity: boolean;
  isTimedMode: boolean;
  roundDurationSeconds?: number;
}

export type ScreenState =
  | "WELCOME"
  | "SETUP_SESSION"
  | "LOBBY"
  | "IN_ROUND"
  | "ANSWER_PHASE"
  | "CLOSING_GROUP"
  | "CLOSING_PERSONAL"
  | "SESSION_SUMMARY";

export interface SessionState {
  players: Player[];
  settings: SessionSettings;
  usedCardIds: Set<string>;
  skippedCardIds: Set<string>;
  answeredInCurrentCycle: Set<string>;
  favorites: Set<string>;
  currentRoundNumber: number;
  currentScreen: ScreenState;
  currentCandidateCards: Card[]; // the 3 cards shown this round
  currentSelectedCard: Card | null;
  currentAnsweringPlayerId: string | null;
}

interface SessionStore extends SessionState {
  setScreen: (screen: ScreenState) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updateSettings: (partial: Partial<SessionSettings>) => void;
  startSession: () => void;
  pickNewCards: (allCards: Card[]) => void;
  selectCard: (cardId: string) => void;
  selectAnsweringPlayer: (playerId: string) => void;
  markAnswered: () => void;
  skipCurrentSet: () => void;
  toggleFavorite: (cardId: string) => void;
}

const defaultSettings: SessionSettings = {
  selectedDeckTags: ["master"],
  maxIntensity: 2,
  autoIncreaseIntensity: false,
  isTimedMode: false,
};

const initialState: SessionState = {
  players: [],
  settings: defaultSettings,
  usedCardIds: new Set(),
  skippedCardIds: new Set(),
  answeredInCurrentCycle: new Set(),
  favorites: new Set(),
  currentRoundNumber: 0,
  currentScreen: "WELCOME",
  currentCandidateCards: [],
  currentSelectedCard: null,
  currentAnsweringPlayerId: null,
};

function getEligibleCards(all: Card[], settings: SessionSettings): Card[] {
  return all.filter((card) => {
    const inSelectedDeck = card.deck_tags.some((tag) =>
      settings.selectedDeckTags.includes(tag)
    );
    const underMaxIntensity = card.intensity_level <= settings.maxIntensity;
    return inSelectedDeck && underMaxIntensity;
  });
}

function excludeUsedAndSkipped(cards: Card[], state: SessionState): Card[] {
  return cards.filter(
    (card) =>
      !state.usedCardIds.has(card.id) && !state.skippedCardIds.has(card.id)
  );
}

function pickRandomCards(cards: Card[], count: number): Card[] {
  const pool = [...cards];
  const result: Card[] = [];
  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }
  return result;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  setScreen: (screen) => set({ currentScreen: screen }),

  addPlayer: (name) =>
    set((state) => ({
      players: [
        ...state.players,
        { id: crypto.randomUUID(), name },
      ],
    })),

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  updateSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),

  startSession: () => {
    const state = get();
    const eligible = excludeUsedAndSkipped(
      getEligibleCards(ALL_CARDS, state.settings),
      state
    );
    const candidateCards = pickRandomCards(eligible, 3);
    set({
      currentScreen: "IN_ROUND",
      currentCandidateCards: candidateCards,
      currentSelectedCard: null,
      currentAnsweringPlayerId: null,
      currentRoundNumber: 1,
    });
  },

  pickNewCards: (allCards) => {
    const state = get();
    const eligible = excludeUsedAndSkipped(
      getEligibleCards(allCards, state.settings),
      state
    );
    const candidateCards = pickRandomCards(eligible, 3);
    set({ currentCandidateCards: candidateCards, currentSelectedCard: null });
  },

  selectCard: (cardId) => {
    const { currentCandidateCards } = get();
    const card = currentCandidateCards.find((c) => c.id === cardId) || null;
    set({ currentSelectedCard: card });
  },

  selectAnsweringPlayer: (playerId) => {
    set({
      currentAnsweringPlayerId: playerId,
      currentScreen: "ANSWER_PHASE",
    });
  },

  markAnswered: () => {
    const state = get();
    const { currentSelectedCard, currentAnsweringPlayerId } = state;
    if (!currentSelectedCard || !currentAnsweringPlayerId) return;

    const usedCardIds = new Set(state.usedCardIds);
    usedCardIds.add(currentSelectedCard.id);

    const answeredInCurrentCycle = new Set(state.answeredInCurrentCycle);
    answeredInCurrentCycle.add(currentAnsweringPlayerId);

    set({
      usedCardIds,
      answeredInCurrentCycle,
      currentSelectedCard: null,
      currentAnsweringPlayerId: null,
      currentScreen: "IN_ROUND",
      currentRoundNumber: state.currentRoundNumber + 1,
    });
  },

  skipCurrentSet: () => {
    const state = get();
    const skippedCardIds = new Set(state.skippedCardIds);
    state.currentCandidateCards.forEach((c) => skippedCardIds.add(c.id));
    set({ skippedCardIds });
    const eligible = excludeUsedAndSkipped(
      getEligibleCards(ALL_CARDS, state.settings),
      { ...state, skippedCardIds }
    );
    const candidateCards = pickRandomCards(eligible, 3);
    set({ currentCandidateCards: candidateCards, currentSelectedCard: null });
  },

  toggleFavorite: (cardId) => {
    const state = get();
    const favorites = new Set(state.favorites);
    if (favorites.has(cardId)) favorites.delete(cardId);
    else favorites.add(cardId);
    set({ favorites });
  },
}));

// -----------------------------
// src/App.tsx
// -----------------------------

import React from "react";
import { useSessionStore } from "./state/sessionStore";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { SessionSetupScreen } from "./components/screens/SessionSetupScreen";
import { MainGameScreen } from "./components/screens/MainGameScreen";
import { ClosingRitualScreen } from "./components/screens/ClosingRitualScreen";

export const App: React.FC = () => {
  const screen = useSessionStore((s) => s.currentScreen);

  if (screen === "WELCOME") return <WelcomeScreen />;
  if (screen === "SETUP_SESSION") return <SessionSetupScreen />;
  if (screen === "IN_ROUND" || screen === "ANSWER_PHASE")
    return <MainGameScreen />;
  if (screen === "CLOSING_GROUP" || screen === "CLOSING_PERSONAL")
    return <ClosingRitualScreen />;

  return <WelcomeScreen />;
};

// -----------------------------
// src/components/screens/WelcomeScreen.tsx
// -----------------------------

import React from "react";
import { useSessionStore } from "../../state/sessionStore";

export const WelcomeScreen: React.FC = () => {
  const setScreen = useSessionStore((s) => s.setScreen);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b1724,_#050509)] text-[#F7F2E9]">
      <div className="max-w-md w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] shadow-2xl">
        <h1 className="text-3xl font-serif mb-3">All Cards on the Table</h1>
        <p className="text-sm text-[#C6B9A5] mb-8">
          An evening for stories, confessions, and quiet truths.
        </p>
        <button
          onClick={() => setScreen("SETUP_SESSION")}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] font-medium mb-3"
        >
          Start a new session
        </button>
      </div>
    </div>
  );
};

// -----------------------------
// src/components/screens/SessionSetupScreen.tsx (skeleton)
// -----------------------------

import React, { useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import type { DeckTag, IntensityLevel } from "../../data/cards";

const allDecks: { id: DeckTag; label: string }[] = [
  { id: "master", label: "Master" },
  { id: "nostalgia", label: "Nostalgia" },
  { id: "love", label: "Love" },
  { id: "identity", label: "Identity" },
  { id: "deep_waters", label: "Deep Waters" },
  { id: "shadow", label: "Shadows" },
  { id: "philosophy", label: "Philosophy" },
  { id: "story", label: "Story" },
  { id: "couple", label: "Couple" },
];

export const SessionSetupScreen: React.FC = () => {
  const {
    players,
    settings,
    addPlayer,
    removePlayer,
    updateSettings,
    setScreen,
    startSession,
  } = useSessionStore();

  const [playerName, setPlayerName] = useState("");

  const toggleDeck = (id: DeckTag) => {
    const current = settings.selectedDeckTags;
    const exists = current.includes(id);
    let next = current;
    if (exists) next = current.filter((d) => d !== id);
    else next = [...current, id];

    // always ensure master is present
    if (!next.includes("master")) next = ["master", ...next];

    updateSettings({ selectedDeckTags: next });
  };

  const setIntensity = (level: IntensityLevel) => {
    updateSettings({ maxIntensity: level });
  };

  return (
    <div className="min-h-screen px-4 py-6 text-[#F7F2E9] bg-[radial-gradient(circle_at_top,_#201824,_#050509)]">
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-2xl font-serif">Set up tonight&apos;s table</h2>

        {/* Players */}
        <section className="bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-[#C6B9A5]">
            Players
          </h3>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.06)] px-3 py-2 text-sm"
              placeholder="Add player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded-xl bg-[#D0A96B] text-[#1a1208] text-sm"
              onClick={() => {
                if (!playerName.trim()) return;
                addPlayer(playerName.trim());
                setPlayerName("");
              }}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(30,25,45,0.9)] text-xs"
              >
                <span>{p.name}</span>
                <button
                  className="text-[#C6B9A5]"
                  onClick={() => removePlayer(p.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Deck selection */}
        <section className="bg-[rgba(15,15,30,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-[#C6B9A5]">
            Decks
          </h3>
          <div className="flex flex-wrap gap-2">
            {allDecks.map((deck) => {
              const active = settings.selectedDeckTags.includes(deck.id);
              return (
                <button
                  key={deck.id}
                  onClick={() => toggleDeck(deck.id)}
                  className={`px-3 py-1 rounded-full text-xs border transition
                    ${active
                      ? "bg-[#D0A96B] text-[#1a1208] border-transparent"
                      : "bg-[rgba(25,20,40,0.9)] text-[#C6B9A5] border-[rgba(255,255,255,0.08)]"}
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
            Intensity
          </h3>
          <p className="text-xs text-[#8B8172] mb-1">
            Choose how deep tonight goes. You can always adjust as you play.
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const active = settings.maxIntensity >= lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setIntensity(lvl as IntensityLevel)}
                  className="flex flex-col items-center text-xs"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center border
                      ${active
                        ? "bg-gradient-to-b from-[#F4C879] to-[#D0A96B] text-[#1a1208] border-transparent"
                        : "bg-[rgba(20,20,30,0.9)] text-[#C6B9A5] border-[rgba(255,255,255,0.08)]"}
                    `}
                  >
                    {lvl}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex gap-3 justify-end pt-4">
          <button
            className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5]"
            onClick={() => setScreen("WELCOME")}
          >
            Back
          </button>
          <button
            disabled={players.length < 2}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => {
              startSession();
            }}
          >
            Begin the evening
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// src/components/screens/MainGameScreen.tsx (very high-level skeleton)
// -----------------------------

import React from "react";
import { useSessionStore } from "../../state/sessionStore";
import { ALL_CARDS } from "../../data/cards";

export const MainGameScreen: React.FC = () => {
  const {
    currentCandidateCards,
    currentSelectedCard,
    currentScreen,
    players,
    answeredInCurrentCycle,
    pickNewCards,
    selectCard,
    selectAnsweringPlayer,
    markAnswered,
    skipCurrentSet,
  } = useSessionStore();

  const isAnswerPhase = currentScreen === "ANSWER_PHASE";

  if (!currentCandidateCards.length && !currentSelectedCard) {
    // initial or empty state
    pickNewCards(ALL_CARDS);
  }

  if (isAnswerPhase && currentSelectedCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9]">
        <div className="max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] shadow-2xl space-y-6">
          <h2 className="text-xl font-serif">This one goes to the table</h2>
          <p className="text-sm text-[#C6B9A5]">Read the card aloud, take your time. If you like, someone can ask one gentle clarifying question.</p>
          <p className="text-lg leading-relaxed">{currentSelectedCard.text}</p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.12)] text-sm text-[#C6B9A5]"
              onClick={() => markAnswered()}
            >
              Mark as answered
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9]">
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between text-xs text-[#C6B9A5]">
        <span>All Cards on the Table</span>
      </div>

      {/* Cards area */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="grid grid-cols-1 gap-4 max-w-3xl md:grid-cols-3">
          {currentCandidateCards.map((card) => (
            <button
              key={card.id}
              onClick={() => selectCard(card.id)}
              className="h-40 md:h-56 rounded-3xl bg-[rgba(15,15,30,0.85)] border border-[rgba(255,255,255,0.06)] shadow-xl px-4 py-3 text-left hover:scale-[1.02] transition-transform"
            >
              <p className="text-xs text-[#8B8172] mb-2">Card</p>
              <p className="text-sm line-clamp-4 leading-snug">{card.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom controls (very minimal skeleton) */}
      <div className="px-4 py-4 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,18,0.9)]">
        <button
          className="text-xs text-[#C6B9A5] underline"
          onClick={() => skipCurrentSet()}
        >
          Shuffle cards
        </button>
        {/* TODO: add player selection UI + intensity display */}
      </div>
    </div>
  );
};

// NOTE: ClosingRitualScreen.tsx can be a simplified version pulling closing cards only.
