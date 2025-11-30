# All Cards — UI Design System

Visual language for the "All Cards on the Table" app.

Style keywords:
- Dark glassmorphism
- Candlelight / warm gold accents
- Old-fashioned whiskey room mood
- Elegant, literary, cinematic

---

## 1. Color Palette

Use semantic tokens so implementation can swap exact values if needed.

```ts
const colors = {
  bg: {
    base: "#050509",          // near-black
    elevated: "rgba(15, 15, 25, 0.85)",
    glass: "rgba(20, 20, 35, 0.65)",
  },
  accent: {
    goldSoft: "#D0A96B",
    goldBright: "#F4C879",
    ember: "#E09A4A",
  },
  text: {
    primary: "#F7F2E9",
    secondary: "#C6B9A5",
    muted: "#8B8172",
  },
  borders: {
    subtle: "rgba(255, 255, 255, 0.06)",
    strong: "rgba(255, 255, 255, 0.14)",
  },
  states: {
    success: "#76C7A5",
    warning: "#E2B667",
    danger: "#E57373",
  },
};
```

**Background feel:** deep charcoal with subtle gradients, like a dimly lit lounge.

---

## 2. Typography

Aim: literary, modern serif + clean sans pairing.

- **Display / Title:** high-contrast serif (e.g., "Playfair Display" / "Cormorant Garamond").
- **Body / UI Text:** modern sans (e.g., "Inter" / "SF Pro" / "Roboto").

Sizing scale (mobile-first):
- `display`: 28–32px
- `title`: 22–24px
- `subtitle`: 18–20px
- `body`: 15–16px
- `caption`: 12–13px

Use generous line-height (1.4–1.6) for a relaxed reading feel.

---

## 3. Card Design

### 3.1. Card Layout

Cards are central. They should feel like elegant, frosted, physical objects.

- Shape: rounded corners (`border-radius: 20–24px`).
- Background: `background: linear-gradient(145deg, rgba(18,18,30,0.95), rgba(30,25,45,0.85));`
- Border: `1px` subtle light border (`borders.subtle`).
- Shadow: soft drop shadow, e.g.
  - `box-shadow: 0 18px 40px rgba(0,0,0,0.55);`

Inside card:
- Intensity indicator (candles) at top.
- Theme chips (small, subtle pills).
- Main question text center-aligned with ample padding.

### 3.2. Candle Intensity Indicator

Visual representation:
- Horizontal row of 5 minimal candle icons.
- For intensity `N`, first `N` candles are lit (gold), rest are unlit (muted grey).

Accessibility:
- Also display text label, e.g.:  
  `"Candle 3 — Emotional"`.

---

## 4. Glassmorphism Treatments

Used for cards, modals, bottom sheets.

Suggested style:
```css
background: rgba(15, 15, 30, 0.7);
backdrop-filter: blur(18px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

Apply to:
- Player selector bar
- Settings panels
- Modals for closing rituals

Avoid overusing blur on low-end devices; add a fallback.

---

## 5. Iconography & Micro-Interactions

### Icons

- Simple line icons that match the elegant mood.
- Example icons:
  - Candles (intensity)
  - Heart outline (favorites)
  - Dice / shuffle (skip set)
  - Hourglass (timer)
  - People silhouettes (group cards)

### Micro-Interactions

- Card hover / tap:
  - Slight scale up (1.02–1.04) and shadow increase.
- Card selection:
  - Soft glow border in `accent.goldBright`.
- Screen transitions:
  - Gentle fade + slide, ~200–300ms.

No loud or bouncy animations.

---

## 6. Layout & Spacing

General rules:
- Use **generous padding** (16–24px) on primary content areas.
- Leave ample margin around the central card area.
- Align controls along bottom for thumb reach.

Mobile layout (portrait):
- Top: title + candles + deck icons.
- Middle: card(s).
- Bottom: player selector, skip and next buttons.

Tablet / Desktop:
- Center column: card.
- Left: players list.
- Right: session info, favorites, deck filters.

---

## 7. Components Overview

Suggested component list (React-ish naming):

- `<AppShell />`
- `<TopBar />`
- `<CandleIntensitySelector />`
- `<DeckChips />`
- `<PlayerStrip />`
- `<CardCarousel />`
- `<QuestionCard />`
- `<ThemeChip />`
- `<SkipControls />`
- `<FavoritesButton />`
- `<AnswerOverlay />`
- `<ClosingRitualModal />`
- `<SettingsPanel />`

---

## 8. Emotional Tone in UI Copy

Copy should feel:
- Warm, intelligent.
- Never clinical.
- Never over-excited or gamified.

Examples:
- When starting:  
  *"Settle in. Let’s see what the evening wants to ask."*

- Before a deep card (intensity 4–5):  
  *"This one goes a little deeper. Make sure everyone’s comfortable."*

- For clarifying question prompt:  
  *"If you’d like, someone at the table may ask one gentle clarifying question."*

- Ending screen:  
  *"All cards on the table. Thanks for sharing the evening."*

---

## 9. Dark Mode & Eye Comfort

- Default is dark.
- Use warm whites (#F7F2E9) rather than stark white.
- Avoid pure black text on pure white; keep everything slightly softened.
- Optional: setting for **"Extra warm mode"** that subtly tints the entire UI with amber at night.

---

## 10. Notes for Cursor AI

- Implement colors as design tokens (TS/JSON) so multiple themes can be supported later.
- Typography should be built as a small scale system (`TextVariant` enum or similar).
- Animation constants (durations, easing curves) should live in a central file.
- Start with **mobile-first layout**, then enhance for larger screens.

