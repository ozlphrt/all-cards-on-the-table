export type Language = "en" | "tr";

export interface Translations {
  welcome: {
    title: string;
  };
  setup: {
    back: string;
    decks: string;
    intensity: string;
    intensityLevels: {
      warm: string;
      deep: string;
      shadows: string;
    };
  };
  decks: {
    all: string;
    nostalgia: string;
    love: string;
    identity: string;
    deepWaters: string;
    shadows: string;
    philosophy: string;
    story: string;
    couple: string;
  };
  singlePlayer: {
    title: string;
    searchPlaceholder: string;
    cardsFound: string;
    noCards: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    welcome: {
      title: "All Cards on the Table",
    },
    setup: {
      back: "Back",
      decks: "Decks",
      intensity: "Intensity",
      intensityLevels: {
        warm: "Warm",
        deep: "Deep",
        shadows: "Shadows",
      },
    },
    decks: {
      all: "ALL",
      nostalgia: "Nostalgia",
      love: "Love",
      identity: "Identity",
      deepWaters: "Deep Waters",
      shadows: "Shadows",
      philosophy: "Philosophy",
      story: "Story",
      couple: "Couple",
    },
    singlePlayer: {
      title: "Browse Cards",
      searchPlaceholder: "Search cards...",
      cardsFound: "cards",
      noCards: "No cards found",
    },
  },
  tr: {
    welcome: {
      title: "Tüm Kartlar Masada",
    },
    setup: {
      back: "Geri",
      decks: "Desteler",
      intensity: "Yoğunluk",
      intensityLevels: {
        warm: "Ilık",
        deep: "Derin",
        shadows: "Karanlık",
      },
    },
    decks: {
      all: "Tümü",
      nostalgia: "Nostalji",
      love: "Aşk",
      identity: "Kimlik",
      deepWaters: "Derin",
      shadows: "Karanlık",
      philosophy: "Felsefe",
      story: "Hikaye",
      couple: "Çift",
    },
    singlePlayer: {
      title: "Kartları Gözat",
      searchPlaceholder: "Kartları ara...",
      cardsFound: "kart",
      noCards: "Kart bulunamadı",
    },
  },
};
