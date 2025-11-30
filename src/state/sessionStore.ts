import { create } from "zustand";
import type { Card, DeckTag, IntensityLevel } from "../data/cards";
import { ALL_CARDS, getAllCards, generateSimilarQuestion, addGeneratedCard } from "../data/cards";
import { useLanguageStore } from "../i18n/languageStore";

export interface Player {
  id: string;
  name: string;
  coupleGroupId?: string;
}

export interface SessionSettings {
  selectedDeckTags: DeckTag[];
  minIntensity: IntensityLevel;
  maxIntensity: IntensityLevel;
  autoIncreaseIntensity: boolean;
  isTimedMode: boolean;
  roundDurationSeconds?: number;
}

export type ScreenState =
  | "WELCOME"
  | "CREATE_GAME"
  | "JOIN_GAME"
  | "WAITING_ROOM"
  | "SETUP_SESSION"
  | "LOBBY"
  | "IN_ROUND"
  | "ANSWER_PHASE"
  | "CLOSING_GROUP"
  | "CLOSING_PERSONAL"
  | "SESSION_SUMMARY"
  | "SINGLE_PLAYER";

export interface CardRating {
  cardId: string;
  rating: number; // 0-5 stars (0 = no rating)
  timestamp: string;
}

export interface CardVote {
  cardId: string;
  vote: "up" | "down";
  timestamp: string;
}

export interface GameState {
  gamePin: string | null;
  isHost: boolean;
  playerName: string | null;
  gameId: string | null;
}

export interface SessionState {
  gameState: GameState;
  players: Player[];
  settings: SessionSettings;
  usedCardIds: Set<string>;
  skippedCardIds: Set<string>;
  answeredInCurrentCycle: Set<string>;
  favorites: Set<string>;
  cardRatings: CardRating[]; // Array of ratings for analytics
  currentRoundNumber: number;
  currentScreen: ScreenState;
  currentCandidateCards: Card[];
  currentSelectedCard: Card | null;
  currentAnsweringPlayerId: string | null;
}

interface SessionStore extends SessionState {
  setScreen: (screen: ScreenState) => void;
  createGame: (playerName: string) => string; // Returns game PIN
  joinGame: (gamePin: string, playerName: string) => boolean; // Returns success
  updateGameState: (partial: Partial<GameState>) => void;
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
  rateCard: (cardId: string, rating: number) => void;
  getCardRating: (cardId: string) => number | null;
  getAverageRating: (cardId: string) => number | null;
  getEligiblePlayers: () => Player[];
  syncGameState: () => void; // Sync state with other players
  voteCard: (cardId: string, vote: "up" | "down") => void;
  getCardVotes: (cardId: string) => { up: number; down: number };
  isCardHidden: (cardId: string) => boolean;
}

const defaultSettings: SessionSettings = {
  selectedDeckTags: ["all"],
  minIntensity: 1,
  maxIntensity: 3,
  autoIncreaseIntensity: false,
  isTimedMode: false,
};

const initialState: SessionState = {
  gameState: {
    gamePin: null,
    isHost: false,
    playerName: null,
    gameId: null,
  },
  players: [],
  settings: defaultSettings,
  usedCardIds: new Set(),
  skippedCardIds: new Set(),
  answeredInCurrentCycle: new Set(),
  favorites: new Set(),
  cardRatings: [],
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
    const withinIntensityRange =
      card.intensity_level >= settings.minIntensity &&
      card.intensity_level <= settings.maxIntensity;
    return inSelectedDeck && withinIntensityRange;
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

function getEligiblePlayersForRound(
  players: Player[],
  answeredInCurrentCycle: Set<string>
): Player[] {
  const eligible = players.filter((p) => !answeredInCurrentCycle.has(p.id));
  if (eligible.length > 0) return eligible;
  // reset cycle
  return players;
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
    if (!cardId) {
      set({ currentSelectedCard: null });
      return;
    }
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
    const { currentSelectedCard } = state;
    if (!currentSelectedCard) return;

    const usedCardIds = new Set(state.usedCardIds);
    usedCardIds.add(currentSelectedCard.id);

    set({
      usedCardIds,
      currentSelectedCard: null,
      currentAnsweringPlayerId: null,
      currentScreen: "IN_ROUND",
      currentRoundNumber: state.currentRoundNumber + 1,
    });

    // Pick new cards for next round
    const nextEligible = excludeUsedAndSkipped(
      getEligibleCards(ALL_CARDS, state.settings),
      { ...state, usedCardIds }
    );
    const nextCandidateCards = pickRandomCards(nextEligible, 3);
    set({ currentCandidateCards: nextCandidateCards });
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

  rateCard: (cardId, rating) => {
    const state = get();
    // If rating is 0, remove the rating
    if (rating === 0) {
      const updatedRatings = state.cardRatings.filter((r) => r.cardId !== cardId);
      set({ cardRatings: updatedRatings });
      
      try {
        const stored = localStorage.getItem("all-cards-ratings");
        if (stored) {
          const allRatings: CardRating[] = JSON.parse(stored);
          const filtered = allRatings.filter((r) => r.cardId !== cardId);
          localStorage.setItem("all-cards-ratings", JSON.stringify(filtered));
        }
      } catch (e) {
        // ignore
      }
      return;
    }
    
    const newRating: CardRating = {
      cardId,
      rating,
      timestamp: new Date().toISOString(),
    };
    // Remove existing rating for this card from this session, add new one
    const updatedRatings = state.cardRatings.filter((r) => r.cardId !== cardId);
    updatedRatings.push(newRating);
    set({ cardRatings: updatedRatings });
    
    // Also persist to localStorage for cross-session analytics
    try {
      const stored = localStorage.getItem("all-cards-ratings");
      const allRatings: CardRating[] = stored ? JSON.parse(stored) : [];
      const filtered = allRatings.filter((r) => r.cardId !== cardId);
      filtered.push(newRating);
      localStorage.setItem("all-cards-ratings", JSON.stringify(filtered));
    } catch (e) {
      // ignore
    }
  },

  getCardRating: (cardId) => {
    const state = get();
    const rating = state.cardRatings.find((r) => r.cardId === cardId);
    return rating ? rating.rating : null;
  },

  getAverageRating: (cardId) => {
    try {
      const stored = localStorage.getItem("all-cards-ratings");
      if (!stored) return null;
      const allRatings: CardRating[] = JSON.parse(stored);
      const cardRatings = allRatings.filter((r) => r.cardId === cardId);
      if (cardRatings.length === 0) return null;
      const sum = cardRatings.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / cardRatings.length) * 10) / 10; // Round to 1 decimal
    } catch (e) {
      return null;
    }
  },

  voteCard: (cardId: string, vote: "up" | "down") => {
    const newVote: CardVote = {
      cardId,
      vote,
      timestamp: new Date().toISOString(),
    };
    
    // Persist to localStorage
    try {
      const stored = localStorage.getItem("all-cards-votes");
      const allVotes: CardVote[] = stored ? JSON.parse(stored) : [];
      allVotes.push(newVote);
      localStorage.setItem("all-cards-votes", JSON.stringify(allVotes));
      
      // If thumbs up, generate 2-3 similar questions immediately
      if (vote === "up") {
        const allCards = getAllCards();
        const card = allCards.find(c => c.id === cardId);
        if (card) {
          console.log(`Thumbs up clicked for card: ${card.text.en.substring(0, 50)}...`);
          // Get current language
          const currentLanguage = useLanguageStore.getState().language;
          // Generate 2-3 similar questions on the spot
          const numToGenerate = 2 + Math.floor(Math.random() * 2); // 2 or 3
          console.log(`Generating ${numToGenerate} similar questions...`);
          
          // Generate cards asynchronously with slight delays to ensure unique timestamps
          (async () => {
            let generatedCount = 0;
            for (let i = 0; i < numToGenerate; i++) {
              // Add small delay to ensure unique timestamps
              await new Promise(resolve => setTimeout(resolve, i * 50));
              try {
                console.log(`[${i + 1}/${numToGenerate}] Starting generation...`);
                const startTime = Date.now();
                const similarCard = await generateSimilarQuestion(card, i, currentLanguage);
                const duration = Date.now() - startTime;
                console.log(`[${i + 1}/${numToGenerate}] Generated in ${duration}ms: "${similarCard.text.en.substring(0, 60)}..."`);
                console.log(`  Card ID: ${similarCard.id}`);
                console.log(`  Intensity: ${similarCard.intensity_level}, Themes: ${similarCard.themes.join(", ")}, Decks: ${similarCard.deck_tags.join(", ")}`);
                
                // Ensure the generated question text is different from the original
                if (similarCard.text.en.toLowerCase().trim() !== card.text.en.toLowerCase().trim()) {
                  addGeneratedCard(similarCard);
                  generatedCount++;
                  console.log(`✓ [${i + 1}/${numToGenerate}] Successfully added to localStorage. Total: ${generatedCount}`);
                  
                  // Immediately trigger UI update after each card is added
                  // Use a custom event to notify the component
                  window.dispatchEvent(new CustomEvent('card-generated', { detail: { cardId: similarCard.id } }));
                } else {
                  console.warn(`⚠ [${i + 1}/${numToGenerate}] Card is identical to original, retrying...`);
                  // If somehow the same, try generating again with different index
                  const retryCard = await generateSimilarQuestion(card, i + numToGenerate + 10, currentLanguage);
                  if (retryCard.text.en.toLowerCase().trim() !== card.text.en.toLowerCase().trim()) {
                    addGeneratedCard(retryCard);
                    generatedCount++;
                    console.log(`✓ [${i + 1}/${numToGenerate}] Retry successful. Total: ${generatedCount}`);
                    window.dispatchEvent(new CustomEvent('card-generated', { detail: { cardId: retryCard.id } }));
                  } else {
                    console.warn(`⚠ [${i + 1}/${numToGenerate}] Retry also identical, skipping.`);
                  }
                }
              } catch (error) {
                console.error(`❌ [${i + 1}/${numToGenerate}] Error generating question:`, error);
                console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
              }
            }
            console.log(`✅ Finished generating. Total cards added: ${generatedCount}/${numToGenerate}`);
          })();
        } else {
          console.warn(`Card with id ${cardId} not found`);
        }
      }
      // If thumbs down, card is already hidden via isCardHidden
    } catch (e) {
      // ignore
    }
  },

  getCardVotes: (cardId: string) => {
    try {
      const stored = localStorage.getItem("all-cards-votes");
      if (!stored) return { up: 0, down: 0 };
      const allVotes: CardVote[] = JSON.parse(stored);
      const cardVotes = allVotes.filter((v) => v.cardId === cardId);
      return {
        up: cardVotes.filter((v) => v.vote === "up").length,
        down: cardVotes.filter((v) => v.vote === "down").length,
      };
    } catch (e) {
      return { up: 0, down: 0 };
    }
  },

  isCardHidden: (cardId: string) => {
    // Hide cards with 1 or more downvotes (replaced with better versions)
    const DOWNVOTE_THRESHOLD = 1;
    try {
      const stored = localStorage.getItem("all-cards-votes");
      if (!stored) return false;
      const allVotes: CardVote[] = JSON.parse(stored);
      const cardVotes = allVotes.filter((v) => v.cardId === cardId);
      const downvotes = cardVotes.filter((v) => v.vote === "down").length;
      return downvotes >= DOWNVOTE_THRESHOLD;
    } catch (e) {
      return false;
    }
  },

  getUpvotedCardPatterns: () => {
    // Analyze upvoted cards to identify patterns for generating similar questions
    try {
      const stored = localStorage.getItem("all-cards-votes");
      if (!stored) return null;
      const allVotes: CardVote[] = JSON.parse(stored);
      const upvoted = allVotes.filter((v) => v.vote === "up");
      
      // Get card data for upvoted cards
      const upvotedCardIds = [...new Set(upvoted.map((v) => v.cardId))];
      const upvotedCards = ALL_CARDS.filter((c) => upvotedCardIds.includes(c.id));
      
      if (upvotedCards.length === 0) return null;
      
      // Analyze patterns
      const intensityDistribution: Record<number, number> = {};
      const themeDistribution: Record<string, number> = {};
      const formatDistribution: Record<string, number> = {};
      
      upvotedCards.forEach((card) => {
        intensityDistribution[card.intensity_level] = 
          (intensityDistribution[card.intensity_level] || 0) + 1;
        card.themes.forEach((theme) => {
          themeDistribution[theme] = (themeDistribution[theme] || 0) + 1;
        });
        card.formats.forEach((format) => {
          formatDistribution[format] = (formatDistribution[format] || 0) + 1;
        });
      });
      
      return {
        intensityDistribution,
        themeDistribution,
        formatDistribution,
        totalUpvoted: upvotedCards.length,
        sampleCardIds: upvotedCardIds.slice(0, 10), // For reference
      };
    } catch (e) {
      return null;
    }
  },

  getEligiblePlayers: () => {
    const state = get();
    return getEligiblePlayersForRound(
      state.players,
      state.answeredInCurrentCycle
    );
  },

  createGame: (playerName: string) => {
    const gamePin = Math.floor(1000 + Math.random() * 9000).toString();
    const gameId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const state = get();
    const newState: SessionState = {
      ...state,
      gameState: {
        gamePin,
        isHost: true,
        playerName,
        gameId,
      },
      players: [{ id: `player-${Date.now()}`, name: playerName }],
    };

    // Store game state in localStorage (simple sync mechanism)
    try {
      localStorage.setItem(`game-${gamePin}`, JSON.stringify({
        gameId,
        host: playerName,
        players: newState.players,
        settings: newState.settings,
        usedCardIds: Array.from(newState.usedCardIds),
        skippedCardIds: Array.from(newState.skippedCardIds),
        currentRoundNumber: newState.currentRoundNumber,
        currentScreen: newState.currentScreen,
        currentCandidateCards: newState.currentCandidateCards,
        currentSelectedCard: newState.currentSelectedCard,
        lastUpdated: Date.now(),
      }));
    } catch (e) {
      // ignore
    }

    set(newState);
    set({ currentScreen: "WAITING_ROOM" });
    return gamePin;
  },

  joinGame: (gamePin: string, playerName: string) => {
    try {
      const stored = localStorage.getItem(`game-${gamePin}`);
      if (!stored) return false;

      const gameData = JSON.parse(stored);
      
      // Add player to the game
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: playerName,
      };
      
      const updatedPlayers = [...gameData.players, newPlayer];
      
      // Update game state
      const updatedGameData = {
        ...gameData,
        players: updatedPlayers,
        lastUpdated: Date.now(),
      };
      
      localStorage.setItem(`game-${gamePin}`, JSON.stringify(updatedGameData));

      // Update local state
      set({
        gameState: {
          gamePin,
          isHost: false,
          playerName,
          gameId: gameData.gameId,
        },
        players: updatedPlayers,
        settings: gameData.settings,
        usedCardIds: new Set(gameData.usedCardIds || []),
        skippedCardIds: new Set(gameData.skippedCardIds || []),
        currentRoundNumber: gameData.currentRoundNumber || 0,
        currentScreen: gameData.currentScreen || "WAITING_ROOM",
        currentCandidateCards: gameData.currentCandidateCards || [],
        currentSelectedCard: gameData.currentSelectedCard || null,
      });

      return true;
    } catch (e) {
      return false;
    }
  },

  updateGameState: (partial: Partial<GameState>) => {
    const state = get();
    set({
      gameState: { ...state.gameState, ...partial },
    });
  },

  syncGameState: () => {
    const state = get();
    if (!state.gameState.gamePin) return;

    try {
      const stored = localStorage.getItem(`game-${state.gameState.gamePin}`);
      if (!stored) return;

      const gameData = JSON.parse(stored);
      
      // Only sync if we're not the host (host controls the state)
      if (!state.gameState.isHost) {
        set({
          players: gameData.players || [],
          settings: gameData.settings || state.settings,
          usedCardIds: new Set(gameData.usedCardIds || []),
          skippedCardIds: new Set(gameData.skippedCardIds || []),
          currentRoundNumber: gameData.currentRoundNumber || 0,
          currentScreen: gameData.currentScreen || state.currentScreen,
          currentCandidateCards: gameData.currentCandidateCards || [],
          currentSelectedCard: gameData.currentSelectedCard || null,
        });
      } else {
        // Host updates the shared state
        localStorage.setItem(`game-${state.gameState.gamePin}`, JSON.stringify({
          gameId: state.gameState.gameId,
          host: state.gameState.playerName,
          players: Array.from(state.players),
          settings: state.settings,
          usedCardIds: Array.from(state.usedCardIds),
          skippedCardIds: Array.from(state.skippedCardIds),
          currentRoundNumber: state.currentRoundNumber,
          currentScreen: state.currentScreen,
          currentCandidateCards: state.currentCandidateCards,
          currentSelectedCard: state.currentSelectedCard,
          lastUpdated: Date.now(),
        }));
      }
    } catch (e) {
      // ignore
    }
  },
}));

