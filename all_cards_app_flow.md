# All Cards — App Flow & Screen Logic

This document defines the **screens, navigation, and core logic** for the "All Cards on the Table" app.

Style: Stanley Tucci–inspired, dark glassmorphism, candlelit, elegant.

---

## 1. High-Level Experience

- Players sit around a table (physical world).  
- App handles: players, decks, intensity, card selection, fairness, and closing ritual.
- Core loop:  
  **Show 3 cards → Choose 1 → Choose who answers → Table asks 1 clarifying question → Next round.**

---

## 2. Screen List

1. **Welcome / Title Screen**
2. **Session Setup**
   - Player Setup
   - Deck Selection
   - Intensity (Candle Slider)
   - Mode: Timed vs Free Flow
3. **Lobby / Session Overview**
4. **Main Game Screen**
   - 3-Card Carousel
   - Player Selector
   - Intensity Control
   - Skip controls
5. **Answer Phase Overlay**
   - Selected Question
   - Highlighted Player
   - Gentle prompt for Clarifying Question
6. **Favorites & History Screen**
7. **Closing Ritual Flow**
   - Group Closing Card
   - Personal Closing Cards
8. **Settings & Theme**

---

## 3. Screen Details

### 3.1. Welcome / Title Screen

**Purpose:** Set tone, offer quick start.

**Elements:**
- App title: *All Cards on the Table*  
- Tagline: e.g. *An evening for stories, confessions, and quiet truths.*
- CTA buttons:
  - `Start a new session`
  - `Continue last session` (optional)
  - `How it works`

---

### 3.2. Session Setup

#### 3.2.1. Player Setup

- Add players (names, optional icons/emojis).
- Optionally mark couples / partners.

**Data structure:**
```ts
type Player = {
  id: string;
  name: string;
  isCoupleGroupId?: string; // for pairing
};
```

#### 3.2.2. Deck Selection

- Toggle chips/buttons:
  - `Master Deck` (default, always on)
  - `Nostalgia`
  - `Love & Relationships`
  - `Identity`
  - `Deep Waters`
  - `Confessions & Shadows`
  - `Philosophy`
  - `Story`
  - `Couple`

User can:
- Keep only Master.
- Or add 1–3 themed decks.

#### 3.2.3. Intensity Slider (Candles)

- Visual: row of **5 candles**, from 1 lit to 5 lit.
- User selects max intensity allowed.

**Behavior:**
- Intensity filter: `card.intensity_level <= selectedCandles`.
- Option: toggle **"Let the game slowly increase intensity"**.

#### 3.2.4. Mode: Timed vs Free Flow

- `Free Flow` (default): no timer.
- `Timed`: per-round timer (e.g., 3–5 minutes) shown subtly.

---

### 3.3. Lobby / Session Overview

Shows a summary card:
- Players joined
- Selected decks
- Max intensity (candles icon)
- Mode: timed / free flow

Buttons:
- `Start game`
- `Edit setup`

---

## 4. Main Game Loop

### 4.1. Main Game Screen Layout

Key regions:
- **Top:** current round number, candles indicator, decks icons.
- **Center:** 3-card carousel or grid.
- **Bottom:** Selected player indicator + controls (Choose Player, Skip, Favorites).

### 4.2. Card Selection Logic

1. Build candidate set:
   - Filter master deck by:
     - Selected themed decks
     - Intensity (`<= selectedCandles`)
     - Not yet used this session
   - Optional: avoid same theme repeating too often.

2. Randomly select 3 cards from candidate set.

3. Display them as tappable cards with short fade-in animation.

4. User chooses 1 card.

5. Move to **Player Selection**.

### 4.3. Player Selection & Fairness

**State:**
```ts
type SessionState = {
  players: Player[];
  answeredInCurrentCycle: Set<Player['id']>;
  usedCardIds: Set<string>;
};
```

Algorithm:
- Compute `eligiblePlayers = players - answeredInCurrentCycle`.
- If `eligiblePlayers` is empty:
  - Reset `answeredInCurrentCycle = new Set()`.
  - Recompute `eligiblePlayers = players`.
- UI: show only `eligiblePlayers` as selectable.
- On selection, move to **Answer Phase** and add that player to `answeredInCurrentCycle` after answer.

---

## 5. Answer Phase

### 5.1. Answer Phase Overlay

When card + player are chosen:
- Dim background, show single card large.
- Highlight chosen player’s name + maybe a subtle halo.
- Show:  
  *“This card is for [Player Name]. Take your time.”*

Buttons:
- `Mark as answered`
- `Skip card` (if they decide not to answer)
- `Favorite` (star icon)

### 5.2. Clarifying Question Prompt

Because your chosen format is: **Table asks ONE clarifying question by default**:

After the player has answered (user taps `Mark as answered`):
- Show a soft prompt:
  - *"If you’d like, someone at the table may ask one gentle clarifying question."*
- Optional timer bubble (e.g., 60 seconds) if in timed mode.

User can then:
- Tap `Next round` when conversation has naturally closed.

---

## 6. Skip Logic in UI

### 6.1. Skip Before Card Choice

On the main game screen:
- Button: `Shuffle cards` (Skip set).
- Behavior:
  - Discard the 3 current cards for this session.
  - Draw 3 new cards; avoid immediately reusing skipped ones.

### 6.2. Skip After Card & Player Selected

On answer overlay:
- Button: `Pass`.
- Options after tapping:
  - `Pick another card for the same player` (from a new set of 3).
  - Or `Choose a different player` (only if group wants this).

Implementation options are flexible; the rule is: **always preserve psychological safety.**

---

## 7. Favorites & History Screen

**Purpose:** Let users bookmark powerful questions for future evenings.

- List of starred cards (from current and previous sessions, if stored).
- Filters: by theme, intensity, date.
- Option: `Start a session using Favorites only`.

Data:
```ts
type Favorite = {
  cardId: string;
  favoritedAt: string; // ISO timestamp
};
```

---

## 8. Closing Ritual Flow

Triggered when:
- A certain number of rounds is reached, or
- User taps `End Session`.

### 8.1. Step 1 — Group Closing Card

- Draw 1 `closing_group` card (intensity 2–3).
- Show as full-screen card; everyone answers.

Button: `Continue to personal reflections`.

### 8.2. Step 2 — Personal Closing Cards

For each player:
- Draw or assign 1 `closing_personal` card.
- Show one at a time:  
  *"Closing card for [Player Name]"*.

After all players:
- Show a **soft end screen**:
  - *"All cards on the table. Thank you for tonight."*
  - Option: `Save session summary` / `View favorites` / `Start another round`.

---

## 9. Settings & Theme

Settings options:
- Change **color theme** (but default is dark glassmorphism + warm gold).
- Toggle sound effects (subtle chimes).
- Toggle micro-animations (to avoid motion sickness).
- Enable/disable `Auto-intensity increase`.

---

## 10. State Machine Summary

Main states:
- `WELCOME`
- `SETUP_SESSION`
- `LOBBY`
- `IN_ROUND`
- `ANSWER_PHASE`
- `CLOSING_GROUP`
- `CLOSING_PERSONAL`
- `SESSION_SUMMARY`

Transitions:
- `WELCOME -> SETUP_SESSION -> LOBBY -> IN_ROUND`
- `IN_ROUND -> ANSWER_PHASE -> IN_ROUND`
- `IN_ROUND -> CLOSING_GROUP -> CLOSING_PERSONAL -> SESSION_SUMMARY`

---

## 11. Notes for Cursor AI

- Each screen should map cleanly to a React component / View.
- Shared state (players, cards, used cards, answeredInCurrentCycle, favorites) can live in a global store (Zustand, Redux, etc.).
- The 3-card selection + fairness logic is core and should be tested carefully.
- Animations should be subtle and elegant; no loud, gamified effects.

