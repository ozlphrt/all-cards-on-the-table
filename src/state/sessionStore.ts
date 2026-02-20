import { create } from "zustand";
import type { DeckTag, IntensityLevel } from "../data/cards";


export type ScreenState = "SINGLE_PLAYER";

export interface SessionSettings {
  selectedDeckTags: DeckTag[];
  allowedIntensities: IntensityLevel[];
}

export interface SessionState {
  settings: SessionSettings;
  usedCardIds: Set<string>;
  skippedCardIds: Set<string>;
  favorites: Set<string>;
  currentScreen: ScreenState;
}

interface SessionStore extends SessionState {
  setScreen: (screen: ScreenState) => void;
  updateSettings: (partial: Partial<SessionSettings>) => void;
  toggleFavorite: (cardId: string) => void;
  voteCard: (cardId: string, vote: "up" | "down") => void;
  getCardVotes: (cardId: string) => { up: number; down: number };
  isCardHidden: (cardId: string) => boolean;
}

const defaultSettings: SessionSettings = {
  selectedDeckTags: ["all"],
  allowedIntensities: [1, 2, 3],
};

const initialState: SessionState = {
  settings: defaultSettings,
  usedCardIds: new Set(),
  skippedCardIds: new Set(),
  favorites: new Set(),
  currentScreen: "SINGLE_PLAYER",
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  setScreen: (screen) => set({ currentScreen: screen }),

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  toggleFavorite: (cardId) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      return { favorites: newFavorites };
    }),

  voteCard: (cardId, vote) => {
    try {
      const stored = localStorage.getItem("all-cards-votes");
      // Votes were stored as an array of CardVote objects, let's keep it consistent or migrate
      // Actually, let's just push a new vote object to the array to match the existing logic
      const allVotes = stored ? JSON.parse(stored) : [];
      allVotes.push({
        cardId,
        vote,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("all-cards-votes", JSON.stringify(allVotes));

      // Trigger a refresh of the card list
      window.dispatchEvent(new CustomEvent('card-votes-updated', { detail: { cardId, vote } }));
    } catch (e) {
      console.error("Error voting for card:", e);
    }
  },

  getCardVotes: (cardId) => {
    try {
      const stored = localStorage.getItem("all-cards-votes");
      if (!stored) return { up: 0, down: 0 };
      const allVotes: any[] = JSON.parse(stored);
      const cardVotes = allVotes.filter((v) => v.cardId === cardId);
      return {
        up: cardVotes.filter((v) => v.vote === "up").length,
        down: cardVotes.filter((v) => v.vote === "down").length,
      };
    } catch (e) {
      return { up: 0, down: 0 };
    }
  },

  isCardHidden: (cardId) => {
    const votes = get().getCardVotes(cardId);
    // Hide cards with 1 or more downvotes (replaced with better versions)
    return votes.down >= 1;
  }
}));
