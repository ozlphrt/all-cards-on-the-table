# All Cards — Themed Decks Specification

This document defines the **themed decks** that sit on top of the Master Deck.

The Master Deck already contains all cards with rich tagging. Themed Decks are **filtered views + optional extra cards**.

---

## 1. Deck List

1. **Nostalgia & Past Selves** (`nostalgia`)
2. **Love & Relationships** (`love`)
3. **Identity & Self-Awareness** (`identity`)
4. **Deep Waters & Vulnerabilities** (`deep_waters`)
5. **Confessions & Shadows** (`shadow`)
6. **Philosophy & Meaning** (`philosophy`)
7. **Story Deck** (`story`)
8. **Couple Deck** (`couple`)
9. **Group & Closing Rituals** (`group`, `closing`)

Each deck:
- Uses the **5-candle intensity levels**.
- Is implemented as a **filter** on the card model using `theme` and `deck_tags`.
- May include **bonus cards** that only appear in that themed deck.

---

## 2. Deck Definitions

### 2.1. Nostalgia & Past Selves

**Key tag(s):** `nostalgia`  
**Optional secondary tags:** `identity`, `story`  

**Purpose:** Warm-up, shared memories, gentle reflection.

**Card selection rule:**
- Include all cards where `theme` includes `nostalgia` OR `deck_tags` includes `nostalgia` deck.
- Intensity 1–3 recommended for default.

**Bonus examples** (to be added as new cards later, not yet in Master Deck):
- *What did “fun” mean to you when you were ten years old?*
- *Which place from your past still feels like it belongs to you, even if you never go back?*
- *What is a risk you took when you were younger that you wouldn’t take now?*

---

### 2.2. Love & Relationships

**Key tag(s):** `love`  
**Optional:** `identity`, `deep_waters`, `shadow`, `couple`

**Purpose:** Explore how people love, attach, relate, and heal.

**Card selection rule:**
- Include all cards where `theme` includes `love` OR `deck_tags` includes `love` deck.
- Include `couple` cards as a subset for partner-focused play.

**Bonus examples:**
- *What did you once believe about love that you no longer do?*
- *When has someone loved you in a way you didn’t know you needed?*
- *What does commitment mean to you now, compared to ten years ago?*

---

### 2.3. Identity & Self-Awareness

**Key tag(s):** `identity`  
**Optional:** `philosophy`, `deep_waters`, `shadow`

**Purpose:** Explore self-concept, personal story, values, and growth.

**Card selection rule:**
- Include all cards where `theme` includes `identity`.

**Bonus examples:**
- *What part of you feels older than your actual age?*
- *When do you feel like a stranger to yourself?*
- *What story do you tell about yourself that might not be entirely true anymore?*

---

### 2.4. Deep Waters & Vulnerabilities

**Key tag(s):** `deep_waters`  
**Optional:** `identity`, `love`, `shadow`

**Purpose:** Emotional wounds, patterns, healing, fear, tenderness.

**Card selection rule:**
- Include all cards where `theme` includes `deep_waters`.
- Bias towards **intensity 3–4**, with some 2s as entry and 5s as optional.

**Bonus examples:**
- *What is a tender spot in you that people touch without realizing it?*
- *Where in your life do you feel the most fragile these days?*
- *What is one thing you’re still learning to forgive yourself for?*

---

### 2.5. Confessions & Shadows

**Key tag(s):** `shadow`  
**Optional:** `identity`, `love`, `deep_waters`, `philosophy`

**Purpose:** Confessional, revealing, psychologically deep but elegant.

**Card selection rule:**
- Include all cards where `theme` includes `shadow`.
- Intensity levels 4–5 by default, with some 3s as on-ramp.

**Safety note:**  
UI should display a **subtle warning** when a 5-candle card is selected in this deck.

**Bonus examples:**
- *What part of you do you most carefully manage in public?*
- *What is a truth you’ve edited out of your own story when telling it to others?*
- *What would you be relieved to admit if you knew there would be zero judgment?*

---

### 2.6. Philosophy & Meaning

**Key tag(s):** `philosophy`  
**Optional:** `identity`, `nostalgia`, `deep_waters`

**Purpose:** Purpose, meaning, time, mortality, big-picture reflections.

**Card selection rule:**
- Include all cards where `theme` includes `philosophy`.

**Bonus examples:**
- *What do you currently believe life is asking of you?*
- *When do you feel most aware that time is passing?*
- *What makes a life feel “well-lived” in your eyes?*

---

### 2.7. Story Deck

**Key tag(s):** `story`  

**Purpose:** Long-form storytelling cards to be used when the table wants narrative depth.

**Card selection rule:**
- Include all cards where `is_story_card = true` OR `formats` includes `story`.

**Bonus examples:**
- *Tell a story about a time you were braver than you expected of yourself.*
- *Tell a story about a conversation that changed the direction of your life.*

---

### 2.8. Couple Deck

**Key tag(s):** `couple`  
**Secondary:** `love`, `deep_waters`, `shadow`

**Purpose:** For partners playing together. Can be used in mixed groups if comfortable.

**Card selection rule:**
- Include all cards where `is_couple_card = true` OR `formats` includes `couple`.

**Bonus examples:**
- *What is one thing your partner doesn’t give themselves enough credit for?*
- *When did you realize your relationship had shifted from “fun” to “serious”?*
- *What do you want future-you to thank your current relationship for?*

---

### 2.9. Group & Closing Rituals

**Key tag(s):** `group`, `closing`  

**Purpose:** Cards where everyone answers, and cards used to land the evening.

**Card selection rule:**
- Include all `group` cards for shared rounds.
- Include all `closing_personal` and `closing_group` cards for end-of-session.

**Bonus examples (group):**
- *What quality do you see in people at this table that you wish you had more of?*
- *What is something you think most of us are underestimating about ourselves?*

**Bonus examples (closing):**
- *What did tonight remind you about the kind of connections you want more of?*

---

## 3. Implementation in Code

In code (TS/JS), a Themed Deck can be represented as a **filter function** over the Master Deck array, e.g.:

```ts
function filterByTheme(deck: Card[], theme: ThemeTag): Card[] {
  return deck.filter(card => card.themes.includes(theme));
}
```

Or more complex filters:

```ts
function buildThemedDeck(deck: Card[], options: {
  requiredThemes?: ThemeTag[];
  requiredDeckTags?: DeckTag[];
}): Card[] {
  return deck.filter(card => {
    const hasTheme = !options.requiredThemes || options.requiredThemes.some(t => card.themes.includes(t));
    const hasDeckTag = !options.requiredDeckTags || options.requiredDeckTags.some(tag => card.deck_tags.includes(tag));
    return hasTheme && hasDeckTag;
  });
}
```

---

## 4. UX Behavior

- The user can select **one or multiple decks** at a time.
- The app combines filters:  
  `selectedCards = applyThemeFilters(masterDeck, selectedDecks)`, then apply **intensity** and **format** filters.
- Default behavior on app start:  
  `selectedDecks = ["master"]`, intensity = 2 candles.

---

## 5. Notes for Cursor AI

- Themed decks are **views**, not separate databases.
- Extra themed-only cards can be added to the Master Deck with proper tags.
- When generating more questions, always:
  - Assign primary theme.
  - Optionally assign secondary themes.
  - Set `deck_tags` to at least `["master"]` and any relevant themed decks.

