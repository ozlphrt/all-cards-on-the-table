# Voting System & Question Evolution

## Overview

The voting system allows the app to learn from user preferences and evolve the question set over time.

## How It Works

### Thumbs Up (👍)
When users thumbs up a question:
- The vote is stored in localStorage
- The system analyzes patterns in upvoted questions:
  - **Intensity levels** that resonate
  - **Themes** that work well
  - **Formats** that engage users
- This data is used to **generate/create similar questions** that follow successful patterns

### Thumbs Down (👎)
When users thumbs down a question:
- The vote is stored in localStorage
- Questions with **2 or more downvotes** are automatically hidden from the browse view
- These questions are marked for replacement with better versions
- The system uses upvoted patterns to create replacements

### Protection Rule
- Questions are **never removed** until they have at least **2 downvotes over time**
- This prevents single negative reactions from removing good questions
- Allows for gradual improvement rather than immediate deletion

## Technical Implementation

### Storage
- Votes stored in `localStorage` under `"all-cards-votes"`
- Each vote includes: `cardId`, `vote` ("up" | "down"), `timestamp`

### Functions

#### `voteCard(cardId, vote)`
- Records a vote for a card
- Persists to localStorage

#### `getCardVotes(cardId)`
- Returns `{ up: number, down: number }` for a card

#### `isCardHidden(cardId)`
- Returns `true` if card has 2+ downvotes
- Used to filter cards from display

#### `getUpvotedCardPatterns()`
- Analyzes all upvoted cards
- Returns patterns:
  - `intensityDistribution`: Which intensity levels are most upvoted
  - `themeDistribution`: Which themes resonate
  - `formatDistribution`: Which formats work best
  - `totalUpvoted`: Total count
  - `sampleCardIds`: Examples for reference

## Usage for Question Generation

When creating new questions, use `getUpvotedCardPatterns()` to:
1. Identify successful intensity levels → create more at those levels
2. Identify popular themes → expand those themes
3. Identify working formats → use those formats
4. Reference sample upvoted cards → study what makes them work

## Future Enhancements

- **AI Question Generation**: Use patterns to generate new questions automatically
- **A/B Testing**: Test variations of questions
- **Analytics Dashboard**: View voting patterns and trends
- **Question Suggestions**: Suggest new questions based on upvoted patterns

