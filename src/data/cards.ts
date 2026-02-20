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
export async function generateSimilarQuestion(upvotedCard: Card, variationIndex: number = 0, _currentLanguage: string = "en"): Promise<Card> {
  // Generate a new ID with variation index and additional randomness to ensure uniqueness
  const timestamp = Date.now();
  const random1 = Math.random().toString(36).substr(2, 9);
  const random2 = Math.random().toString(36).substr(2, 5);
  const newId = `gen-${timestamp}-${variationIndex}-${random1}-${random2}`;

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
        "How has your perspective on what matter most shifted over time?",
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

// Sophisticated, elegant, thoughtful questions - "All Cards on the Table" curated set
export const ALL_CARDS: Card[] = [
  // --- WARM (Levels 1-2) ---
  {
    id: "WARM-01",
    text: {
      en: "What scent or sound instantly transports you to a specific moment from your past?",
      tr: "Hangi koku veya ses seni anında geçmişindeki belirli bir ana götürüyor?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "WARM-02",
    text: {
      en: "Which childhood ritual or tradition do you find yourself returning to, however secretly?",
      tr: "Hangi çocukluk ritüeline veya geleneğine, ne kadar gizli de olsa, geri dönerken buluyorsun kendini?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "WARM-03",
    text: {
      en: "What detail from a happy memory do you hold onto most vividly?",
      tr: "Mutlu bir hatıradan hangi detayı en canlı şekilde saklıyorsun?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "WARM-04",
    text: {
      en: "Where did you go to 'disappear' as a child, and why there?",
      tr: "Çocukken 'kaybolmak' için nereye giderdin ve neden orası?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "WARM-05",
    text: {
      en: "Which person from your past do you think of most fondly and without any complication?",
      tr: "Geçmişinden kimi, en ufak bir karmaşa olmadan, en sevgiyle hatırlıyorsun?",
    },
    intensity_level: 1,
    themes: ["nostalgia", "love"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "love"],
  },
  {
    id: "WARM-06",
    text: {
      en: "What small habit or preference reveals something essential about who you are?",
      tr: "Hangi küçük alışkanlığın veya tercihin, kim olduğun hakkında temel bir şeyi açığa çıkarıyor?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "WARM-07",
    text: {
      en: "When do you feel most comfortable in your own skin, without performing for anyone?",
      tr: "Kimin için olursa olsun rol yapmadan, kendi içinde ne zaman en rahat hissediyorsun?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "WARM-08",
    text: {
      en: "What quality do others recognize in you that you sometimes overlook in yourself?",
      tr: "Başkalarının sende fark ettiği ama senin bazen kendinde gözden kaçırdığın özellik nedir?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "WARM-09",
    text: {
      en: "What part of your personality emerged later in life that surprised you?",
      tr: "Kişiliğinin hangi parçası hayatının ilerleyen dönemlerinde ortaya çıktı ve seni şaşırttı?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "WARM-10",
    text: {
      en: "Which trait do you share with someone you admire, and does that make you like yourself more?",
      tr: "Hayran olduğun biriyle hangi ortak özelliği paylaşıyorsun ve bu seni kendine daha çok yaklaştırıyor mu?",
    },
    intensity_level: 2,
    themes: ["identity", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "philosophy"],
  },
  {
    id: "WARM-11",
    text: {
      en: "What simple moment from your day brings you the most genuine pleasure?",
      tr: "Gününün hangi basit anı sana en gerçek keyfi veriyor?",
    },
    intensity_level: 1,
    themes: ["philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "WARM-12",
    text: {
      en: "What did a stranger once say or do that stayed with you forever?",
      tr: "Bir yabancının söylediği veya yaptığı hangi şey seninle sonsuza kadar kaldı?",
    },
    intensity_level: 1,
    themes: ["story"],
    formats: ["story"],
    deck_tags: ["all", "story"],
  },
  {
    id: "WARM-13",
    text: {
      en: "What's the kindest thing someone has done for you that you never got to thank them for?",
      tr: "Birinin senin için yaptığı ama teşekkür etme fırsatı bulamadığın en nazik şey neydi?",
    },
    intensity_level: 1,
    themes: ["love", "story"],
    formats: ["solo"],
    deck_tags: ["all", "love", "story"],
  },
  {
    id: "WARM-14",
    text: {
      en: "If you could revisit one specific afternoon from your childhood, which would it be?",
      tr: "Çocukluğundan bir öğleden sonrayı tekrar ziyaret edebilseydin, hangisi olurdu?",
    },
    intensity_level: 1,
    themes: ["nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia"],
  },
  {
    id: "WARM-15",
    text: {
      en: "What's a book, movie, or song that feels like it was written specifically for you?",
      tr: "Sanki sadece senin için yazılmış gibi hissettiren bir kitap, film veya şarkı hangisi?",
    },
    intensity_level: 2,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },

  // --- DEEP (Level 3) ---
  {
    id: "DEEP-01",
    text: {
      en: "What aspect of yourself did you resist acknowledging for the longest time?",
      tr: "Kendinle ilgili hangi özelliği kabullenmekte en uzun süre direndin?",
    },
    intensity_level: 3,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "DEEP-02",
    text: {
      en: "When did you realize you'd been wrong about something you were absolutely certain of?",
      tr: "Kesinlikle emin olduğun bir konuda yanıldığını ne zaman fark ettin?",
    },
    intensity_level: 3,
    themes: ["philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "DEEP-03",
    text: {
      en: "What pattern in your life have you struggled to break, even though you see it clearly?",
      tr: "Hayatında, net bir şekilde görmene rağmen kırmak için mücadele ettiğin hangi kalıbın var?",
    },
    intensity_level: 3,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "DEEP-04",
    text: {
      en: "What emotion have you learned to sit with rather than trying to escape?",
      tr: "Kaçmaya çalışmak yerine içine oturmayı öğrendiğin duygu hangisi?",
    },
    intensity_level: 3,
    themes: ["deep_waters", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "identity"],
  },
  {
    id: "DEEP-05",
    text: {
      en: "When did you discover you were capable of something you didn't think possible?",
      tr: "Mümkün olmadığını düşündüğün bir şeyi yapabileceğini ne zaman keşfettin?",
    },
    intensity_level: 3,
    themes: ["identity", "story"],
    formats: ["story"],
    deck_tags: ["all", "identity", "story"],
  },
  {
    id: "DEEP-06",
    text: {
      en: "What loss taught you something you couldn't have learned any other way?",
      tr: "Hangi kayıp sana başka türlü öğrenemeyeceğin bir şeyi öğretti?",
    },
    intensity_level: 3,
    themes: ["deep_waters", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "philosophy"],
  },
  {
    id: "DEEP-07",
    text: {
      en: "How has your understanding of what 'love' means changed over the last decade?",
      tr: "Son on yılda 'aşk'ın ne anlama geldiğine dair anlayışın nasıl değişti?",
    },
    intensity_level: 3,
    themes: ["love", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "love", "philosophy"],
  },
  {
    id: "DEEP-08",
    text: {
      en: "What assumption about how life works have you had to reconsider recently?",
      tr: "Hayatın nasıl işlediğine dair hangi ön kabulünü yakın zamanda gözden geçirmek zorunda kaldın?",
    },
    intensity_level: 3,
    themes: ["philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "DEEP-09",
    text: {
      en: "What philosophical question do you find yourself returning to without a resolution?",
      tr: "Çözüme ulaştıramadan sürekli döndüğün felsefi soru hangisi?",
    },
    intensity_level: 3,
    themes: ["philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy"],
  },
  {
    id: "DEEP-10",
    text: {
      en: "What influence from your past only revealed its impact years afterward?",
      tr: "Geçmişindeki hangi etki ancak yıllar sonra etkisini tam olarak gösterdi?",
    },
    intensity_level: 3,
    themes: ["nostalgia", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "identity"],
  },
  {
    id: "DEEP-11",
    text: {
      en: "When did you realize you'd become someone you hadn't expected to be?",
      tr: "Beklemediğin birine dönüştüğünü ne zaman fark ettin?",
    },
    intensity_level: 3,
    themes: ["identity", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "philosophy"],
  },
  {
    id: "DEEP-12",
    text: {
      en: "What truth about yourself do you struggle to tell people because it sounds like a cliché?",
      tr: "Çok klişe geldiği için insanlara söylemekte zorlandığın kendinle ilgili gerçek nedir?",
    },
    intensity_level: 3,
    themes: ["identity"],
    formats: ["solo"],
    deck_tags: ["all", "identity"],
  },
  {
    id: "DEEP-13",
    text: {
      en: "Which friend from your past do you wish you could see through your current eyes?",
      tr: "Geçmişindeki hangi arkadaşını şimdiki gözlerinle görebilmeyi isterdin?",
    },
    intensity_level: 3,
    themes: ["nostalgia", "love"],
    formats: ["solo"],
    deck_tags: ["all", "nostalgia", "love"],
  },
  {
    id: "DEEP-14",
    text: {
      en: "What does 'home' look like to you now, and how much of it is a person rather than a place?",
      tr: "Senin için 'ev' artık neye benziyor ve bunun ne kadarı bir mekandan ziyade bir insan?",
    },
    intensity_level: 3,
    themes: ["philosophy", "love"],
    formats: ["solo"],
    deck_tags: ["all", "philosophy", "love"],
  },
  {
    id: "DEEP-15",
    text: {
      en: "What's the hardest thing you've ever had to forgive yourself for?",
      tr: "Kendine dair affetmek zorunda kaldığın en zor şey neydi?",
    },
    intensity_level: 3,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },

  // --- SHADOWS (Levels 4-5) ---
  {
    id: "SHADOW-01",
    text: {
      en: "What contradiction within yourself have you learned to accept rather than reconcile?",
      tr: "Kendinle ilgili hangi çelişkiyi çözmek yerine kabullenmeyi öğrendin?",
    },
    intensity_level: 4,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "SHADOW-02",
    text: {
      en: "What part of yourself do you keep hidden even from those closest to you?",
      tr: "Kendinin hangi parçasını en yakınındaki insanlardan bile saklıyorsun?",
    },
    intensity_level: 4,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-03",
    text: {
      en: "When did you realize you'd been pretending to be someone you're not, for the benefit of others?",
      tr: "Başkalarının yararı için olmadığın biriymiş gibi davrandığını ne zaman fark ettin?",
    },
    intensity_level: 4,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "SHADOW-04",
    text: {
      en: "What truth have you been running from that you know you'll eventually need to face?",
      tr: "Kaçtığın hangi gerçekle eninde sonunda yüzleşmen gerekeceğini biliyorsun?",
    },
    intensity_level: 4,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-05",
    text: {
      en: "What have you kept to yourself for years, simply because you don't know the words for it?",
      tr: "Sırf ona isim veremediğin için yıllardır kendine sakladığın ne var?",
    },
    intensity_level: 4,
    themes: ["deep_waters", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "identity"],
  },
  {
    id: "SHADOW-06",
    text: {
      en: "What did you lose without realizing its value until it was no longer there?",
      tr: "Değerini kaybedene kadar fark etmediğin neyi kaybettin?",
    },
    intensity_level: 4,
    themes: ["deep_waters", "nostalgia"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "nostalgia"],
  },
  {
    id: "SHADOW-07",
    text: {
      en: "What relationship changed you in ways you didn't understand until it was over?",
      tr: "Seni bittikten sonra anladığın şekilde değiştiren hangi ilişkin var?",
    },
    intensity_level: 4,
    themes: ["love", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "love", "identity"],
  },
  {
    id: "SHADOW-08",
    text: {
      en: "What version of you only exists in your own head?",
      tr: "Sadece kendi zihninde var olan versiyonun hangisi?",
    },
    intensity_level: 5,
    themes: ["identity", "shadow"],
    formats: ["solo"],
    deck_tags: ["all", "identity", "shadow"],
  },
  {
    id: "SHADOW-09",
    text: {
      en: "What have you never told anyone because you're afraid it would make them see you as a monster?",
      tr: "Seni canavar gibi görmelerine neden olacağından korktuğun için kimseye söylemediğin ne var?",
    },
    intensity_level: 5,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-10",
    text: {
      en: "What do you know about yourself that you hope dies with you and is never spoken of?",
      tr: "Kendin hakkında seninle beraber yok olmasını ve hiç konuşulmamasını umduğun ne var?",
    },
    intensity_level: 5,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-11",
    text: {
      en: "What's the deepest regret of your life so far, and what would it cost to fix it?",
      tr: "Şimdiye kadarki en büyük pişmanlığın ne ve onu düzeltmek neye mal olurdu?",
    },
    intensity_level: 5,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-12",
    text: {
      en: "Who have you hurt that you know you can never truly make amends to?",
      tr: "Kimin canını yaktın ki asla gerçekten telafi edemeyeceğini biliyorsun?",
    },
    intensity_level: 5,
    themes: ["shadow", "love"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "love"],
  },
  {
    id: "SHADOW-13",
    text: {
      en: "What's the most selfish thing you've ever done that you don't actually regret?",
      tr: "Gerçekten pişman olmadığın, hayatında yaptığın en bencilce şey neydi?",
    },
    intensity_level: 5,
    themes: ["shadow", "identity"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "identity"],
  },
  {
    id: "SHADOW-14",
    text: {
      en: "What truth about yourself are you running from that you know is slowly catching up to you?",
      tr: "Kaçtığın hangi gerçek yavaş yavaş seni yakalıyor?",
    },
    intensity_level: 5,
    themes: ["shadow", "deep_waters"],
    formats: ["solo"],
    deck_tags: ["all", "shadow", "deep_waters"],
  },
  {
    id: "SHADOW-15",
    text: {
      en: "If today were your last day on earth, what's the one thing you'd finally say out loud?",
      tr: "Bugün dünyadaki son günün olsaydı, sonunda yüksek sesle söyleyeceğin tek şey ne olurdu?",
    },
    intensity_level: 5,
    themes: ["deep_waters", "philosophy"],
    formats: ["solo"],
    deck_tags: ["all", "deep_waters", "philosophy"],
  },
];

export const CARD_SET_VERSION = "2.1.0";
