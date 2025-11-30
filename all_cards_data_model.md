# All Cards — Data Model & JSON/TS Structures

This document defines the data model for the "All Cards on the Table" app, including TypeScript types and JSON structure examples.

---

## 1. Core Types

### 1.1. Intensity Level

```ts
export type IntensityLevel = 1 | 2 | 3 | 4 | 5; // number of candles
```

### 1.2. Theme Tags

```ts
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
```

### 1.3. Deck Tags

```ts
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
```

### 1.4. Format Types

```ts
export type CardFormat =
  | "solo"
  | "solo_with_followup" // table clarifying question
  | "story"
  | "story_with_followup"
  | "couple"
  | "couple_with_followup"
  | "group"
  | "closing_personal"
  | "closing_group";
```

---

## 2. Card Model

### 2.1. TypeScript Interface

```ts
export interface Card {
  id: string;                  // e.g. "L3-004" or "SC-002"
  text: string;                // the question itself
  intensity_level: IntensityLevel;
  themes: ThemeTag[];          // one or more themes
  formats: CardFormat[];       // allowed formats
  deck_tags: DeckTag[];        // decks this card belongs to (always includes 'master')
  is_story_card?: boolean;     // convenience flags
  is_couple_card?: boolean;
  is_closing_card?: boolean;
  notes?: string;              // optional author notes
}
```

### 2.2. Example Card (JSON)

```json
{
  "id": "L3-001",
  "text": "What is an emotion you’ve spent years learning how to handle?",
  "intensity_level": 3,
  "themes": ["identity", "philosophy"],
  "formats": ["solo_with_followup"],
  "deck_tags": ["master", "identity", "philosophy"],
  "is_story_card": false,
  "is_couple_card": false,
  "is_closing_card": false
}
```

---

## 3. Players & Sessions

### 3.1. Player Model

```ts
export interface Player {
  id: string;          // UUID or short ID
  name: string;
  coupleGroupId?: string; // optional: link partners
}
```

### 3.2. Session Settings

```ts
export interface SessionSettings {
  selectedDeckTags: DeckTag[];      // e.g. ["master", "nostalgia", "philosophy"]
  maxIntensity: IntensityLevel;     // candles
  autoIncreaseIntensity: boolean;
  isTimedMode: boolean;
  roundDurationSeconds?: number;    // if timed
}
```

### 3.3. Session State

```ts
export interface SessionState {
  players: Player[];
  settings: SessionSettings;
  usedCardIds: Set<string>;           // cards already used this session
  skippedCardIds: Set<string>;        // cards explicitly skipped
  answeredInCurrentCycle: Set<string>; // player IDs who have answered in this rotation
  favorites: Set<string>;             // card IDs marked as favorite
  currentRoundNumber: number;
}
```

> Note: In implementation, Sets will be serialized as arrays for persistence.

---

## 4. Deck Construction Helpers

### 4.1. Filter by Deck Tags & Intensity

```ts
export function getEligibleCards(
  allCards: Card[],
  settings: SessionSettings
): Card[] {
  return allCards.filter(card => {
    const inSelectedDeck = card.deck_tags.some(tag =>
      settings.selectedDeckTags.includes(tag)
    );

    const underMaxIntensity = card.intensity_level <= settings.maxIntensity;

    return inSelectedDeck && underMaxIntensity;
  });
}
```

### 4.2. Apply Usage & Skip Filters

```ts
export function excludeUsedAndSkipped(
  cards: Card[],
  state: SessionState
): Card[] {
  return cards.filter(card => {
    return (
      !state.usedCardIds.has(card.id) &&
      !state.skippedCardIds.has(card.id)
    );
  });
}
```

### 4.3. Get 3 Random Candidate Cards

```ts
export function pickRandomCards(
  cards: Card[],
  count: number
): Card[] {
  const pool = [...cards];
  const result: Card[] = [];

  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }

  return result;
}
```

---

## 5. Player Fairness Logic

### 5.1. Get Eligible Players for This Round

```ts
export function getEligiblePlayersForRound(
  players: Player[],
  answeredInCurrentCycle: Set<string>
): Player[] {
  const eligible = players.filter(p => !answeredInCurrentCycle.has(p.id));
  if (eligible.length > 0) return eligible;
  // reset cycle
  return players;
}
```

### 5.2. Mark Player as Having Answered

```ts
export function markPlayerAnswered(
  state: SessionState,
  playerId: string
): SessionState {
  const next = new Set(state.answeredInCurrentCycle);
  next.add(playerId);
  return {
    ...state,
    answeredInCurrentCycle: next,
  };
}
```

---

## 6. Favorites & History

### 6.1. Favorite Model

```ts
export interface FavoriteEntry {
  cardId: string;
  createdAt: string; // ISO timestamp
}
```

### 6.2. Persisted Session Summary

```ts
export interface SessionSummary {
  id: string;
  date: string;              // ISO
  players: Player[];
  settings: SessionSettings;
  usedCardIds: string[];
  favoriteCardIds: string[];
}
```

---

## 7. JSON Export Structure

If storing all cards in a JSON file, an example structure:

```json
{
  "version": "1.0.0",
  "cards": [
    {
      "id": "L1-001",
      "text": "What is a small childhood memory that still makes you smile when you think about it?",
      "intensity_level": 1,
      "themes": ["nostalgia"],
      "formats": ["solo"],
      "deck_tags": ["master", "nostalgia"],
      "is_story_card": false,
      "is_couple_card": false,
      "is_closing_card": false
    }
    // ... more cards
  ]
}
```

---

## 8. Notes for Cursor AI

- This data model is designed to be **framework-agnostic**.
- Best pairing is React + TypeScript + Zustand/Redux, but can be adapted to any stack.
- Ensure that the card model in code matches the fields and semantics here, so the question set markdown can be converted to JSON reliably.

