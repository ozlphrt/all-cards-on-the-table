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
  | "all"
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
  text: {
    en: string;
    tr: string;
  };
  intensity_level: IntensityLevel;
  themes: ThemeTag[];
  formats: CardFormat[];
  deck_tags: DeckTag[];
  is_story_card?: boolean;
  is_couple_card?: boolean;
  is_closing_card?: boolean;
  notes?: string;
}

// Helper to get card text in current language
export function getCardText(card: Card, language: "en" | "tr"): string {
  return card.text[language] || card.text.en;
}

// Get all cards including generated ones from localStorage
export function getAllCards(): Card[] {
  try {
    const stored = localStorage.getItem("generated-cards");
    const generatedCards: Card[] = stored ? JSON.parse(stored) : [];
    const allCards = [...ALL_CARDS, ...generatedCards];
    console.log(`getAllCards: ${ALL_CARDS.length} original + ${generatedCards.length} generated = ${allCards.length} total`);
    return allCards;
  } catch (e) {
    console.error("Error in getAllCards:", e);
    return ALL_CARDS;
  }
}

// Translate text using a free translation API
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // Use LibreTranslate (free, open-source) or MyMemory API (free tier)
    // For now, using a simple approach with MyMemory API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (e) {
    console.warn(`Translation failed for ${targetLang}:`, e);
  }
  // Fallback to English if translation fails
  return text;
}

// Generate similar questions based on an upvoted card
export async function generateSimilarQuestion(upvotedCard: Card, variationIndex: number = 0, currentLanguage: string = "en"): Promise<Card> {
  // Generate a new ID with variation index and additional randomness to ensure uniqueness
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substr(2, 9);
  const random2 = Math.random().toString(36).substr(2, 5);
  const newId = `gen-${timestamp}-${variationIndex}-${random1}-${random2}`;
  
  const baseText = upvotedCard.text.en.toLowerCase();
  
  // Create variations based on the original question's structure and theme
  const variations: string[] = [];
  
  // Generate standalone questions based on themes and intensity
  // Analyze the original question's themes to create similar but independent questions
  const hasNostalgia = upvotedCard.themes.includes("nostalgia");
  const hasLove = upvotedCard.themes.includes("love");
  const hasIdentity = upvotedCard.themes.includes("identity");
  const hasDeepWaters = upvotedCard.themes.includes("deep_waters");
  const hasShadow = upvotedCard.themes.includes("shadow");
  const hasPhilosophy = upvotedCard.themes.includes("philosophy");
  const hasStory = upvotedCard.themes.includes("story");
  
  // Generate standalone questions based on themes and intensity level
  if (upvotedCard.intensity_level === 1) {
    // Level 1: Warm, safe questions
    if (hasNostalgia) {
      variations.push(
        "What scent or sound instantly transports you to a specific moment from your past?",
        "Which childhood ritual or tradition do you find yourself returning to?",
        "What detail from a happy memory do you hold onto most vividly?",
        "What place from your childhood do you still visit in your dreams?",
        "Which season reminds you most of a particular time in your life?",
        "What song or melody brings back a flood of memories?"
      );
    } else if (hasIdentity) {
      variations.push(
        "What small habit or preference reveals something essential about who you are?",
        "When do you feel most comfortable in your own skin?",
        "What quality do others recognize in you that you sometimes overlook?",
        "What part of your personality emerged later in life that surprised you?",
        "How do you recognize when you're not being true to yourself?",
        "What trait do you share with someone you admire?"
      );
    } else {
      variations.push(
        "What simple moment from your day brings you the most genuine pleasure?",
        "Which person from your past do you think of most fondly, and why?",
        "What ordinary experience have you come to appreciate more as you've grown older?",
        "What small ritual do you perform that centers you?",
        "Which everyday beauty do you pause to notice?",
        "What moment of quiet contentment do you treasure?"
      );
    }
  } else if (upvotedCard.intensity_level === 2) {
    // Level 2: Personal, reflective
    if (hasIdentity) {
      variations.push(
        "What aspect of yourself took longest to fully accept?",
        "How do you recognize when you're not being authentic to yourself?",
        "What contradiction within yourself have you learned to embrace?",
        "What part of your identity feels most authentic to you?",
        "When did you realize you'd become someone you hadn't expected?",
        "What quality in yourself do you value most?"
      );
    } else if (hasLove) {
      variations.push(
        "How do you know when someone truly understands you?",
        "What gesture of affection means the most to you?",
        "When have you felt most deeply connected to another person?",
        "What makes you feel most loved and appreciated?",
        "How do you express care in ways that go beyond words?",
        "When did you realize someone saw you more clearly than you saw yourself?"
      );
    } else if (hasPhilosophy) {
      variations.push(
        "What belief have you held onto despite others questioning it?",
        "How has your perspective on what matters most shifted over time?",
        "What question about life do you find yourself returning to?",
        "What assumption about how the world works have you had to reconsider?",
        "How has your understanding of what it means to live well evolved?",
        "What wisdom have you gained that you wish you'd had earlier?"
      );
    } else {
      variations.push(
        "What experience changed how you see yourself?",
        "When did you realize you'd outgrown a previous version of yourself?",
        "What do you understand now that you wish you'd known earlier?",
        "What moment revealed something important about yourself?",
        "How has your relationship with yourself changed over time?",
        "What lesson did you learn the hard way that you're grateful for now?"
      );
    }
  } else if (upvotedCard.intensity_level === 3) {
    // Level 3: Emotional depth
    if (hasShadow) {
      variations.push(
        "What truth about yourself did you resist acknowledging for the longest time?",
        "When did you realize you'd been wrong about something you were certain of?",
        "What pattern in your life have you struggled to break?"
      );
    } else if (hasDeepWaters) {
      variations.push(
        "What emotion have you learned to sit with rather than escape from?",
        "When did you discover you were capable of something you didn't think possible?",
        "What loss taught you something you couldn't have learned any other way?"
      );
    } else if (hasPhilosophy) {
      variations.push(
        "How has your understanding of what it means to live well evolved?",
        "What assumption about how life works have you had to reconsider?",
        "What philosophical question do you find yourself returning to without resolution?",
        "What belief about existence have you questioned but never fully resolved?",
        "What mystery about life continues to intrigue you?"
      );
    } else {
      variations.push(
        "What moment revealed something important about yourself that you hadn't recognized?",
        "When did you realize you were becoming someone you hadn't expected to be?",
        "What connection with someone affected you in ways that only became clear much later?",
        "What influence from your past only revealed its impact years afterward?",
        "What relationship changed you in ways you didn't understand until much later?"
      );
    }
  } else if (upvotedCard.intensity_level === 4) {
    // Level 4: Deep vulnerability
    if (hasShadow) {
      variations.push(
        "What contradiction within yourself have you learned to accept rather than reconcile?",
        "What part of yourself do you keep hidden from those closest to you?",
        "When did you realize you'd been pretending to be someone you're not?",
        "What aspect of yourself do you struggle to acknowledge even though you know it's true?",
        "What truth have you been running from that you know you'll eventually need to face?"
      );
    } else if (hasDeepWaters) {
      variations.push(
        "What have you kept to yourself, uncertain of how it would be received?",
        "What did you lose without realizing its value until it was no longer there?",
        "What connection with someone changed you in ways you didn't recognize at the time?",
        "What influence from your past only became clear to you much later?",
        "What relationship taught you something about yourself that took years to understand?"
      );
    } else {
      variations.push(
        "What achievement are you most proud of that would never appear on a CV?",
        "When did you first notice you were becoming someone unfamiliar to yourself?",
        "What seemingly insignificant decision altered the trajectory of your life?"
      );
    }
  } else {
    // Level 5: Shadows, deepest questions
    variations.push(
      "What have you never told anyone because you're uncertain how it would be received?",
      "What truth about yourself have you been avoiding, and what might change if you embraced it fully?",
      "What connection with someone transformed you in ways you only recognized years afterward?",
      "What influence from your past only revealed its full impact much later?",
      "What relationship shaped you in ways that took years to fully comprehend?"
    );
  }
  
  // If no variations were generated, create generic standalone questions based on intensity
  if (variations.length === 0) {
    if (upvotedCard.intensity_level <= 2) {
      variations.push(
        "What moment from your past do you find yourself returning to in your thoughts?",
        "How has your understanding of yourself changed in ways that surprised you?",
        "What quality do you possess that you value most?"
      );
    } else {
      variations.push(
        "When did you discover you were mistaken about something you had been absolutely certain of?",
        "What assumption about yourself did you hold for years before realizing it was wrong?",
        "What certainty about your life did you have to let go of?",
        "What did you believe about yourself that turned out to be incorrect?",
        "What conviction did you hold that you later had to abandon?"
      );
    }
  }
  
  // Ensure we have variations
  if (variations.length === 0) {
    variations.push("What moment from your past do you find yourself returning to in your thoughts?");
  }
  
  // Shuffle variations array to ensure different questions each time
  const shuffled = [...variations].sort(() => Math.random() - 0.5);
  
  // Get all existing questions to check for duplicates
  const allExistingCards = getAllCards();
  const existingTexts = allExistingCards.map(c => c.text.en.toLowerCase().trim());
  
  // Filter out variations that are too similar to existing questions BEFORE selection
  const uniqueVariations = shuffled.filter(variation => {
    const variationLower = variation.toLowerCase().trim();
    return !existingTexts.some(existingText => {
      // Quick check: exact match
      if (variationLower === existingText) return true;
      
      // Check for same opening (first 6 words)
      const variationStart = variationLower.split(/\s+/).slice(0, 6).join(' ');
      const existingStart = existingText.split(/\s+/).slice(0, 6).join(' ');
      if (variationStart === existingStart) return true;
      
      // Check word overlap
      const variationWords = variationLower.split(/\s+/).filter(w => w.length > 3);
      const existingWords = existingText.split(/\s+/).filter(w => w.length > 3);
      if (variationWords.length > 4 && existingWords.length > 4) {
        const commonWords = variationWords.filter(w => existingWords.includes(w));
        const similarity = commonWords.length / Math.max(variationWords.length, existingWords.length);
        if (similarity > 0.5) return true;
      }
      
      return false;
    });
  });
  
  // If all variations are duplicates, use generic fallbacks
  const finalVariations = uniqueVariations.length > 0 ? uniqueVariations : [
    "What moment from your life do you find yourself reflecting on most often?",
    "How has your perspective on what matters most evolved over time?",
    "What experience shaped you in ways you only understood later?",
    "When did you realize something important about yourself?",
    "What question about yourself have you been carrying for a while?",
    "What part of yourself do you understand better now than you did before?",
    "How has your relationship with yourself changed over the years?",
    "What insight about yourself came to you when you least expected it?"
  ];
  
  // Re-shuffle the unique variations
  const finalShuffled = [...finalVariations].sort(() => Math.random() - 0.5);
  
  // Use variation index to select from final shuffled array
  // This ensures different questions even if called multiple times quickly
  const index = variationIndex % finalShuffled.length;
  let selectedVariation = finalShuffled[index];
  
  // Ensure the generated question is different from all existing questions
  let attempts = 0;
  const maxAttempts = finalShuffled.length * 3; // More attempts since we pre-filtered
  
  while (attempts < maxAttempts) {
    // Check if this variation is too similar to any existing question
    const isDuplicate = existingTexts.some(existingText => {
      // Check for exact match
      if (selectedVariation.toLowerCase().trim() === existingText) {
        return true;
      }
      
      // Check for semantic similarity - same key concepts
      const selectedLower = selectedVariation.toLowerCase();
      const existingLower = existingText;
      
      // Check for very similar phrasing (same structure, same key words)
      const keyPhrases = [
        /version of (you|yourself).*memories/i,
        /others.*memories.*differ/i,
        /truth about yourself.*avoiding/i,
        /contradiction.*yourself.*accept/i,
        /relationship.*influenced.*years later/i,
        /kept to yourself.*uncertain/i
      ];
      
      // If both contain the same key phrase pattern, they're too similar
      for (const pattern of keyPhrases) {
        const selectedMatch = selectedLower.match(pattern);
        const existingMatch = existingLower.match(pattern);
        if (selectedMatch && existingMatch) {
          return true; // If both match the pattern, they're too similar
        }
      }
      
      // Special check for "memories" + "differ" + "know yourself" pattern (very specific duplicate)
      const hasMemoriesDifferPattern = (text: string) => {
        return /memories/i.test(text) && /differ/i.test(text) && /know.*yourself/i.test(text);
      };
      if (hasMemoriesDifferPattern(selectedLower) && hasMemoriesDifferPattern(existingLower)) {
        return true;
      }
      
      // Check for high word overlap (more than 50% word overlap - much stricter)
      const selectedWords = selectedLower.split(/\s+/).filter(w => w.length > 3); // Only meaningful words
      const existingWords = existingLower.split(/\s+/).filter(w => w.length > 3);
      if (selectedWords.length > 4 && existingWords.length > 4) {
        const commonWords = selectedWords.filter(w => existingWords.includes(w));
        const similarity = commonWords.length / Math.max(selectedWords.length, existingWords.length);
        if (similarity > 0.5) { // Much stricter - 50% overlap is too similar
          return true;
        }
      }
      
      // Check for same question structure with same key words
      const selectedKeyWords = selectedWords.filter(w => 
        !['what', 'when', 'where', 'how', 'which', 'who', 'why', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had', 'you', 'your', 'yourself', 'your', 'to', 'from', 'in', 'on', 'at', 'for', 'with', 'about', 'that', 'this', 'and', 'or', 'but', 'if', 'most', 'more', 'than', 'been', 'being', 'would', 'could', 'should'].includes(w)
      );
      const existingKeyWords = existingWords.filter(w => 
        !['what', 'when', 'where', 'how', 'which', 'who', 'why', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had', 'you', 'your', 'yourself', 'your', 'to', 'from', 'in', 'on', 'at', 'for', 'with', 'about', 'that', 'this', 'and', 'or', 'but', 'if', 'most', 'more', 'than', 'been', 'being', 'would', 'could', 'should'].includes(w)
      );
      
      if (selectedKeyWords.length > 0 && existingKeyWords.length > 0) {
        const keyWordOverlap = selectedKeyWords.filter(w => existingKeyWords.includes(w)).length;
        const keyWordSimilarity = keyWordOverlap / Math.max(selectedKeyWords.length, existingKeyWords.length);
        if (keyWordSimilarity > 0.45) { // Much stricter - 45% key word overlap is too similar
          return true;
        }
      }
      
      // Check for same question start (first 5-6 words)
      const selectedStart = selectedLower.split(/\s+/).slice(0, 6).join(' ');
      const existingStart = existingLower.split(/\s+/).slice(0, 6).join(' ');
      if (selectedStart === existingStart) {
        return true; // Same opening is definitely a duplicate
      }
      
      return false;
    });
    
    if (!isDuplicate) {
      break; // Found a unique question
    }
    
    // Try next variation
    const nextIndex = (index + attempts + 1) % finalShuffled.length;
    selectedVariation = finalShuffled[nextIndex];
    attempts++;
  }
  
  // If we still have a duplicate after all attempts, generate a completely new one
  if (attempts >= maxAttempts) {
    // Create a more distinct variation by modifying the question structure
    const baseWords = selectedVariation.split(' ');
    // Try to create a variation by changing key words
    selectedVariation = selectedVariation
      .replace(/What/g, 'Which')
      .replace(/When/g, 'At what moment')
      .replace(/How/g, 'In what way');
    
    // Final check - if still too similar, use a generic fallback
    const stillDuplicate = existingTexts.some(existingText => {
      const selectedWords = selectedVariation.toLowerCase().split(/\s+/);
      const existingWords = existingText.split(/\s+/);
      const commonWords = selectedWords.filter(w => existingWords.includes(w));
      const similarity = commonWords.length / Math.max(selectedWords.length, existingWords.length);
      return similarity > 0.7;
    });
    
    if (stillDuplicate) {
      // Use a completely generic question as last resort
      const genericQuestions = [
        "What moment from your life do you find yourself reflecting on most often?",
        "How has your perspective on what matters most evolved over time?",
        "What experience shaped you in ways you only understood later?",
        "When did you realize something important about yourself?",
        "What question about yourself have you been carrying for a while?"
      ];
      selectedVariation = genericQuestions[variationIndex % genericQuestions.length];
    }
  }
  
  // Use the selected variation as-is (it's already a standalone question)
  const newQuestionText = selectedVariation;
  
  // Translate to English and Turkish only
  // Start with English immediately, translate Turkish in background to avoid blocking
  const finalText: Card["text"] = {
    en: newQuestionText,
    tr: newQuestionText, // Placeholder, will be translated in background
  };
  
  // Translate Turkish in background (don't wait for it)
  (async () => {
    try {
      const translated = await translateText(newQuestionText, "tr");
      // Update the card in localStorage with translation
      try {
        const stored = localStorage.getItem("generated-cards");
        if (stored) {
          const generatedCards: Card[] = JSON.parse(stored);
          const cardIndex = generatedCards.findIndex(c => c.id === newId);
          if (cardIndex >= 0) {
            generatedCards[cardIndex].text.tr = translated;
            localStorage.setItem("generated-cards", JSON.stringify(generatedCards));
            console.log(`✓ Updated Turkish translation for card ${newId}`);
          }
        }
      } catch (e) {
        console.error("Error updating translation in localStorage:", e);
      }
    } catch (error) {
      console.warn(`Translation failed for card ${newId}, keeping English:`, error);
    }
  })();
  
  return {
    id: newId,
    text: finalText,
    intensity_level: upvotedCard.intensity_level,
    themes: [...upvotedCard.themes],
    formats: [...upvotedCard.formats],
    deck_tags: [...upvotedCard.deck_tags],
    is_story_card: upvotedCard.is_story_card,
    is_couple_card: upvotedCard.is_couple_card,
    is_closing_card: upvotedCard.is_closing_card,
    notes: `Generated from ${upvotedCard.id}`,
  };
}

// Store generated card in localStorage
export function addGeneratedCard(card: Card): void {
  try {
    const stored = localStorage.getItem("generated-cards");
    const generatedCards: Card[] = stored ? JSON.parse(stored) : [];
    // Check if card already exists to avoid duplicates
    if (!generatedCards.find(c => c.id === card.id)) {
      generatedCards.push(card);
      localStorage.setItem("generated-cards", JSON.stringify(generatedCards));
      console.log(`✓ addGeneratedCard: Added card "${card.text.en.substring(0, 50)}..." (ID: ${card.id})`);
      console.log(`  Total generated cards in localStorage: ${generatedCards.length}`);
    } else {
      console.warn(`⚠ addGeneratedCard: Card with ID ${card.id} already exists, skipping`);
    }
  } catch (e) {
    console.error("Error in addGeneratedCard:", e);
  }
}

// Reset all votes (clear voting data)
export function resetVotes(): void {
  try {
    localStorage.removeItem("all-cards-votes");
  } catch (e) {
    // ignore
  }
}

// Reset generated cards (clear generated questions)
export function resetGeneratedCards(): void {
  try {
    localStorage.removeItem("generated-cards");
  } catch (e) {
    // ignore
  }
}

// Fresh set of questions - rewritten from scratch in Tucci style
// Sophisticated, elegant, thoughtful - as if asked over dinner with wine
export const ALL_CARDS: Card[] = [
  // Level 1 - Warm, Safe, Gentle
  {
    id: "L1-001",
    text: {
      en: "What childhood memory still makes you smile?",
      tr: "Hangi çocukluk anısı hâlâ seni gülümsetiyor?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "L1-002",
    text: {
      en: "What's your earliest clear memory?",
      tr: "En erken net hatıran nedir?",
    },
    intensity_level: 1,
    themes: ["nostalgia", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "L1-003",
    text: {
      en: "Where did you go to disappear as a child?",
      tr: "Çocukken kaybolmak için nereye giderdin?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "L1-004",
    text: {
      en: "What did you lose when you grew up?",
      tr: "Büyürken neyi kaybettin?",
    },
    intensity_level: 1,
    themes: ["nostalgia", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "philosophy"],
  },
  {
    id: "L1-005",
    text: {
      en: "What's the smallest thing that's always made you happy?",
      tr: "Seni her zaman mutlu eden en küçük şey nedir?",
    },
    intensity_level: 1,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "L1-006",
    text: {
      en: "What did a childhood friend teach you that you still carry?",
      tr: "Bir çocukluk arkadaşın sana ne öğretti ki hâlâ taşıyorsun?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "L1-007",
    text: {
      en: "What quirk from your earliest years still defines you?",
      tr: "En erken yıllarından kalma hangi tuhaflık seni hâlâ tanımlıyor?",
    },
    intensity_level: 1,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "L1-008",
    text: {
      en: "What moment would you want to relive?",
      tr: "Hangi anı yeniden yaşamak istersin?",
    },
    intensity_level: 1,
    themes: ["nostalgia", "story"],
    formats: ["story"],
    deck_tags: ["all", "nostalgia", "story"],
    is_story_card: true,
  },
  {
    id: "L1-009",
    text: {
      en: "What period of your life do you return to most in your thoughts?",
      tr: "Düşüncelerinde en sık hangi döneme dönüyorsun?",
    },
    intensity_level: 1,
    themes: ["philosophy", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "L1-010",
    text: {
      en: "What did you believe at 15 that you don't now?",
      tr: "15 yaşındayken inandığın ama artık inanmadığın şey nedir?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  
  // Level 2 - Personal, Reflective
  {
    id: "L2-001",
    text: {
      en: "What do people notice about you first?",
      tr: "İnsanlar seni ilk ne zaman fark ediyor?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "L2-002",
    text: {
      en: "What small gesture makes you feel truly seen?",
      tr: "Hangi küçük jest kendini gerçekten görülmüş hissettiriyor?",
    },
    intensity_level: 2,
    themes: ["love", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "love", "identity"],
  },
  {
    id: "L2-003",
    text: {
      en: "When do you feel most like yourself?",
      tr: "Ne zaman kendini en çok kendin gibi hissediyorsun?",
    },
    intensity_level: 2,
    themes: ["identity", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "philosophy"],
  },
  {
    id: "L2-004",
    text: {
      en: "What do you think about but never say?",
      tr: "Ne düşünüyorsun ama asla söylemiyorsun?",
    },
    intensity_level: 2,
    themes: ["deep_waters", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters"],
  },
  {
    id: "L2-005",
    text: {
      en: "What traces of your younger self remain visible?",
      tr: "Genç halinin hangi izleri hâlâ görünür?",
    },
    intensity_level: 2,
    themes: ["nostalgia", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "identity"],
  },
  {
    id: "L2-006",
    text: {
      en: "What do you believe that others don't?",
      tr: "Başkalarının inanmadığı ama senin inandığın şey nedir?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "L2-007",
    text: {
      en: "How has your idea of home changed?",
      tr: "\"Ev\" kavramın nasıl değişti?",
    },
    intensity_level: 2,
    themes: ["philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "L2-008",
    text: {
      en: "How do you show love without words?",
      tr: "Sevgini kelimeler olmadan nasıl gösteriyorsun?",
    },
    intensity_level: 2,
    themes: ["love", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "love"],
  },
  {
    id: "L2-009",
    text: {
      en: "When did you realize you'd become someone unexpected?",
      tr: "Beklemediğin biri olduğunu ne zaman fark ettin?",
    },
    intensity_level: 2,
    themes: ["story", "identity"],
    formats: ["story"],
    deck_tags: ["all", "story"],
    is_story_card: true,
  },
  {
    id: "L2-010",
    text: {
      en: "Which emotion do you understand better now than before?",
      tr: "Hangi duyguyu önceden olduğundan daha iyi anlıyorsun?",
    },
    intensity_level: 2,
    themes: ["philosophy", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  
  // Level 3 - Emotional Depth
  {
    id: "L3-001",
    text: {
      en: "What lie did you tell yourself for too long?",
      tr: "Kendine çok uzun süre hangi yalanı söyledin?",
    },
    intensity_level: 3,
    themes: ["shadow", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "identity"],
  },
  {
    id: "L3-002",
    text: {
      en: "What would most surprise your 15-year-old self?",
      tr: "15 yaşındaki halini en çok ne şaşırtırdı?",
    },
    intensity_level: 3,
    themes: ["nostalgia", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "philosophy"],
  },
  {
    id: "L3-003",
    text: {
      en: "What are you proud of that would never go on a resume?",
      tr: "Gurur duyduğun ama asla özgeçmişine koymayacağın şey nedir?",
    },
    intensity_level: 3,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "L3-004",
    text: {
      en: "What question have you carried for years without an answer?",
      tr: "Yıllardır taşıdığın ama cevabını bulamadığın soru nedir?",
    },
    intensity_level: 3,
    themes: ["philosophy", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy", "identity"],
  },
  {
    id: "L3-005",
    text: {
      en: "What did you lose without realizing its value?",
      tr: "Değerini fark etmeden neyi kaybettin?",
    },
    intensity_level: 3,
    themes: ["nostalgia", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "philosophy"],
  },
  {
    id: "L3-006",
    text: {
      en: "What small decision changed everything?",
      tr: "Hangi küçük karar her şeyi değiştirdi?",
    },
    intensity_level: 3,
    themes: ["philosophy", "nostalgia"],
    formats: ["story"],
    deck_tags: ["all", "philosophy", "nostalgia"],
    is_story_card: true,
  },
  {
    id: "L3-007",
    text: {
      en: "When did you realize you'd been wrong about something you were certain of?",
      tr: "Kesin olduğun bir şeyde yanıldığını ne zaman fark ettin?",
    },
    intensity_level: 3,
    themes: ["philosophy", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy", "identity"],
  },
  {
    id: "L3-008",
    text: {
      en: "What have you pretended to accept that you actually can't?",
      tr: "Kabul ettiğini iddia ettiğin ama aslında kabul edemediğin şey nedir?",
    },
    intensity_level: 3,
    themes: ["deep_waters", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "identity"],
  },
  
  // Level 4 - Deep Vulnerability
  {
    id: "L4-001",
    text: {
      en: "What truth about yourself are you avoiding?",
      tr: "Kendin hakkında hangi gerçekten kaçınıyorsun?",
    },
    intensity_level: 4,
    themes: ["deep_waters", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "shadow"],
  },
  {
    id: "L4-002",
    text: {
      en: "When did you first notice you were becoming someone unfamiliar?",
      tr: "Kendine yabancı biri olmaya başladığını ilk ne zaman fark ettin?",
    },
    intensity_level: 4,
    themes: ["identity", "deep_waters"],
    formats: ["story"],
    deck_tags: ["all", "identity", "deep_waters"],
    is_story_card: true,
  },
  {
    id: "L4-003",
    text: {
      en: "How does the you in others' memories differ from who you know yourself to be?",
      tr: "Başkalarının hatıralarındaki sen, kendini bildiğin senden nasıl farklı?",
    },
    intensity_level: 4,
    themes: ["identity", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "philosophy"],
  },
  {
    id: "L4-004",
    text: {
      en: "What contradiction within yourself have you learned to live with?",
      tr: "Kendi içindeki hangi çelişkiyle yaşamayı öğrendin?",
    },
    intensity_level: 4,
    themes: ["shadow", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "identity"],
  },
  {
    id: "L4-005",
    text: {
      en: "What relationship shaped you in ways you only understood later?",
      tr: "Seni şekillendirdiğini ancak sonradan anladığın ilişki hangisi?",
    },
    intensity_level: 4,
    themes: ["love", "deep_waters"],
    formats: ["story"],
    deck_tags: ["all", "love", "deep_waters"],
    is_story_card: true,
  },
  
  // Level 5 - Shadows, Deepest Questions
  {
    id: "L5-001",
    text: {
      en: "What have you never told anyone because you're unsure how it would be received?",
      tr: "Nasıl karşılanacağından emin olmadığın için kimseye söylemediğin şey nedir?",
    },
    intensity_level: 5,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
];

export const CARD_SET_VERSION = "1.0.0";

