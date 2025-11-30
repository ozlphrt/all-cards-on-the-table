# All Cards on the Table — Deck Architecture

> Version: v1.0  
> Mode: Master Deck + Optional Themed Decks  
> Style: Stanley Tucci–inspired, elegant, literary, emotionally deep

---

## 1. Concept Overview

This document defines the **question deck architecture** for the "All Cards on the Table" app.

Core principles:
- **One Master Deck** that can run the entire game by itself.
- **Optional Themed Decks** for users who want curated experiences.
- **5-Candle Intensity System** for emotional depth control.
- **Confession + Vulnerable Mystery tone** for deeper levels.
- **Table interaction built-in** (clarifying questions, closing rituals).

This document is meant for **Cursor AI** to:
- Generate question content.
- Implement data structures.
- Wire UX logic around levels / themes.

---

## 2. Deck Model Overview

### 2.1. Master Deck

The **Master Deck** is the default game deck.
- Contains questions from **all themes** and **all intensities**.
- Every card is tagged with:
  - `intensity_level` (1–5 candles)
  - `theme` (e.g., `nostalgia`, `identity`, `love`, `shadow`, etc.)
  - `format` (solo / couple / group / story / closing)
- The **intensity slider** (candles) filters which questions are eligible at any moment.

**Use case:** rapid start, no configuration. Just select players → select candle level → play.

---

### 2.2. Optional Themed Decks

In addition to the Master Deck, users can choose decks such as:

1. **Nostalgia & Past Selves**  
   - Childhood, teenage years, early adulthood, firsts.
2. **Love & Relationships**  
   - Romance, attachment, expectations, heartbreak.
3. **Identity & Self-Awareness**  
   - Values, personality, self-image, life choices.
4. **Deep Waters & Vulnerabilities**  
   - Wounds, fears, emotional patterns, family dynamics.
5. **Confessions & Shadows**  
   - Rarely shared truths, contradictions, inner conflicts.
6. **Philosophy & Meaning**  
   - Life purpose, death, time, regrets, meaning-making.
7. **Story Cards**  
   - Long-form storytelling prompts.
8. **Couple Cards**  
   - Designed for partners answering together or about each other.
9. **Group Reflection / Closing Rituals**  
   - Everyone answers; used at the end.

Each Themed Deck:
- Uses the **same 1–5 intensity levels**.
- Can be played standalone **or** in combination with the Master Deck.

---

## 3. Intensity: 5-Candle System

**Shared across Master and Themed Decks.**

- **Candle 1 — Warm / Light / Nostalgic**  
  Gentle, safe, suitable for strangers and warm-up.
- **Candle 2 — Personal / Everyday Inner World**  
  Preferences, mild vulnerabilities, personal quirks.
- **Candle 3 — Emotional / Values / Patterns**  
  Emotions, worldview, relationship to self/others.
- **Candle 4 — Deep Vulnerability**  
  Wounds, fears, mistakes, heavier experiences.
- **Candle 5 — Shadows / Confessions / Mysteries**  
  Rarely shared truths, inner conflicts, unspoken stories.

Implementation rule:
- When user sets candles `1–N`, **only cards with intensity ≤ N** are eligible.
- The app can also gradually **increase average intensity per round** if desired.

---

## 4. Question Formats

Each card has a `format` field that tells the app how to use it.

- `solo`  
  One player answers.

- `solo_with_followup`  
  One player answers, then table asks **one clarifying question**.  
  (Default behavior for most deep cards.)

- `couple`  
  One or both partners answer (phrased accordingly).

- `group`  
  Everyone answers in turn.

- `story`  
  Designed to elicit a story rather than a short answer.

- `closing_personal`  
  For end-of-session personal reflection.

- `closing_group`  
  For end-of-session group reflection.

The Master Deck contains **all formats**. Themed decks may emphasize certain formats (e.g., Couple Deck → mostly `couple`).

---

## 5. Tagging Schema (for data + filtering)

Every card should be stored with at least these fields:

```jsonc
{
  "id": "string",                 // unique ID, e.g. "MC-IDENTITY-0037"
  "text": "string",               // the question prompt
  "intensity_level": 1,            // 1–5 corresponding to candles
  "theme": "identity",            // e.g. nostalgia, love, identity, shadow, philosophy, etc.
  "formats": ["solo_with_followup"], // allowed formats for this card
  "deck_tags": [                   // where this card belongs
    "master",
    "identity",
    "deep_waters"
  ],
  "is_story_card": false,
  "is_couple_card": false,
  "is_closing_card": false,
  "notes": "optional author notes or usage hints"
}
```

The same card can live in:
- `master` deck, and
- one or more **themed decks**.

---

## 6. Distribution & Ratios

Target total: **300–400 cards**.

### 6.1. Intensity Distribution (Global)

Approximate target across all decks combined:
- Level 1 (Candle 1): **15–20%**
- Level 2 (Candle 2): **20–25%**
- Level 3 (Candle 3): **25–30%**
- Level 4 (Candle 4): **20–25%**
- Level 5 (Candle 5): **10–15%**

Rationale:
- Enough warm / mid cards to keep things flowing.  
- Deep + shadow cards are **present but curated**, not overwhelming.

### 6.2. Thematic Distribution

Each question belongs to at least **one primary theme**:

- `nostalgia` (Past Selves)  
- `love` (Love & Relationships)  
- `identity` (Identity & Self-Awareness)  
- `deep_waters` (Vulnerabilities)  
- `shadow` (Confessions & Inner Conflict)  
- `philosophy` (Meaning & Big Questions)  
- `story` (explicit storytelling prompts)  
- `couple` (specifically couple-focused)  
- `closing` (reflection, gratitude, synthesis)

Example approximate counts (for 350 total cards):
- Nostalgia: 60–70
- Love & Relationships: 60–70
- Identity & Self-Awareness: 70–80
- Deep Waters & Vulnerabilities: 60–70
- Confessions & Shadows: 40–50
- Philosophy & Meaning: 40–50
- Story Cards (overlapping others): 30–40 flagged as `is_story_card`
- Couple Cards (overlapping love/deep_waters): ~30 flagged as `is_couple_card`
- Closing Cards: 10–15 total

Note: Many cards will have **multiple theme tags**.

---

## 7. Master Deck vs Themed Decks (Logic)

### 7.1. Master Deck Behavior

- Default deck when app starts.
- Uses:
  - **Players** list
  - **Intensity slider (candles)**
  - **Question format** rules
- Each round:
  1. Filter cards by `intensity_level` and optional banned themes.
  2. Exclude cards that were already used this session.
  3. App selects **3 candidate cards** (varied themes if possible).
  4. User chooses one card.
  5. User selects which **player answers**.
  6. App enforces **fairness** (no one gets a second turn before all have answered).


### 7.2. Themed Deck Behavior

When user chooses a Themed Deck (e.g., "Nostalgia"):
- Filter eligible cards where `deck_tags` includes that deck.
- Intensity slider still applies.
- Master Deck rules still apply for fairness and 3-card choice.

Users can also:
- Select **multiple decks at once**, e.g. `nostalgia + philosophy`.
- The Master Deck is essentially **all decks combined**.

---

## 8. Fairness & Player Rotation Logic

The app must ensure that **no player is picked twice** before everyone has had a turn.

High-level algorithm:

- Maintain a `players` array and a `round_state` object:

```ts
players = ["A", "B", "C", "D", "E", "F"];
answeredInCurrentCycle = new Set();
```

- When it is time to pick a target player:
  - Compute `eligiblePlayers = players - answeredInCurrentCycle`.
  - If `eligiblePlayers` is empty:
    - Reset `answeredInCurrentCycle` to empty set.
    - Recompute `eligiblePlayers = players`.
  - User chooses **any** player from `eligiblePlayers`.
  - After answer is done: add that player to `answeredInCurrentCycle`.

This guarantees:
- Soft fairness (no strict ordering, but equal opportunity).
- Players can still be chosen by human decision, but **only from eligible ones**.

---

## 9. Skip Logic

The app always provides a **Skip** option at two levels:

1. **Skip Card Before Choosing Player**  
   - User can discard the shown 3-card set.  
   - App draws 3 new cards (with a limit to prevent repetition).

2. **Skip After Card is Shown to a Player**  
   - The player has a right to say "pass".  
   - App can:
     - Offer a **gentler alternative** (lower intensity, same theme), or
     - Allow table to pick another card from the previously shown options, or
     - Move to the next player.

Implementation notes:
- Skipped cards should be **marked as used for this session** to avoid feeling stuck.
- For intense cards (Candle 4–5), app can show a small **safety tooltip**:  
  "This one goes deep. Make sure everyone is comfortable."

---

## 10. Closing Rituals

There are two types of closing cards:

1. **Personal Closing Cards** (`format = closing_personal`)
   - One per player, e.g.:  
     "What is one thing you’re taking from tonight that you didn’t expect?"

2. **Group Closing Cards** (`format = closing_group`)
   - One card for everyone to answer, e.g.:  
     "What did this evening remind you about the people at this table?"

**End-of-Session Flow (recommended):**
1. After X rounds or when user presses **End Session**, app suggests:
   - 1 **group closing card**.
   - Then 1 **personal closing card** per player.
2. These cards are generally **Candle 2–3**, warm but reflective.

---

## 11. Implementation Notes for Cursor AI

When generating questions:
- Always assign:
  - `intensity_level` (1–5)
  - At least one `theme`
  - One or more `formats`
  - Appropriate `deck_tags` (always include `master`)
- Ensure tone is:
  - Elegant, literary, emotionally intelligent.
  - Avoids crude or explicit sexual content.
  - Focuses on **emotional intimacy and self-revelation**, not shock.

When generating code later:
- Use this architecture as the **single source of truth**.
- Store questions as structured JSON / TS objects following the schema in §5.
- Build filtering / rotation / fairness logic on top of these tags.

---

## 12. Next Step

**Next file:** `ALL_CARDS_QUESTION_SET_MASTER.md`  
- Will contain the actual **300–400 questions**, organized by:
  - Intensity level
  - Theme
  - Format
  - Tags for Master vs Themed decks.

