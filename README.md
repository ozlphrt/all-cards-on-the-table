# All Cards on the Table

An elegant, dark-glass, Stanley Tucci–style question game for deep conversations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

- `src/data/cards.ts` - Card types and initial question set
- `src/state/sessionStore.ts` - Zustand store for session state
- `src/components/screens/` - Screen components (Welcome, Setup, Game, Closing)
- Design documents in root: `all_cards_*.md`

## Current Status

✅ Core architecture implemented
✅ 20 initial cards (Levels 1-2)
✅ Session flow (Welcome → Setup → Game → Closing)
✅ Player fairness logic
✅ Deck selection and intensity controls

## Next Steps

- Expand card set with Levels 3-5, story cards, couple cards, closing cards
- Add visual polish (candle icons, better glassmorphism)
- Add favorites/history screen
- Add session persistence

