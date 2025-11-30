export type Language = "en" | "tr";

export interface Translations {
  welcome: {
    title: string;
    tagline: string;
    startNewSession: string;
    createGame: string;
    joinGame: string;
    singlePlayer: string;
    underConstruction: string;
  };
  gameFlow: {
    createGame: string;
    createGameDescription: string;
    yourName: string;
    namePlaceholder: string;
    gamePin: string;
    pinCopied: string;
    copyPin: string;
    waitingForPlayers: string;
    joinGame: string;
    joinGameDescription: string;
    enterPin: string;
    pinPlaceholder: string;
    invalidPin: string;
    startGame: string;
  };
  setup: {
    title: string;
    players: string;
    addPlayer: string;
    playerPlaceholder: string;
    decks: string;
    intensity: string;
    intensityDescription: string;
    back: string;
    beginEvening: string;
  };
  game: {
    title: string;
    round: string;
    shuffleCards: string;
    choosePlayer: string;
    endSession: string;
    thisGoesTo: string;
    readAloud: string;
    markAnswered: string;
    favorite: string;
    favorited: string;
    back: string;
    noMoreCards: string;
    rateQuestion: string;
    averageRating: string;
    youRated: string;
  };
  closing: {
    groupTitle: string;
    groupDescription: string;
    personalTitle: string;
    personalDescription: string;
    continueToPersonal: string;
    next: string;
    finish: string;
    summaryTitle: string;
    summaryMessage: string;
    returnHome: string;
    noClosingCards: string;
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
      tagline: "An evening for stories, confessions, and quiet truths.",
      startNewSession: "Start a new session",
      createGame: "Create Game",
      joinGame: "Join Game",
      singlePlayer: "Single Player",
      underConstruction: "Under Construction",
    },
    gameFlow: {
      createGame: "Create Game",
      createGameDescription: "Set up a game and share the PIN with others to join.",
      yourName: "Your Name",
      namePlaceholder: "Enter your name",
      gamePin: "Game PIN",
      pinCopied: "PIN copied!",
      copyPin: "Copy PIN",
      waitingForPlayers: "Waiting for players to join...",
      joinGame: "Join Game",
      joinGameDescription: "Enter the game PIN to join an existing game.",
      enterPin: "Enter PIN",
      pinPlaceholder: "Enter 4-digit PIN",
      invalidPin: "Invalid PIN. Please try again.",
      startGame: "Start Game",
    },
    setup: {
      title: "Set up tonight's table",
      players: "Players",
      addPlayer: "Add",
      playerPlaceholder: "Add player name",
      decks: "Decks",
      intensity: "Intensity",
      intensityDescription: "Choose how deep tonight goes. You can always adjust as you play.",
      back: "Back",
      beginEvening: "Begin the evening",
    },
    game: {
      title: "All Cards on the Table",
      round: "Round",
      shuffleCards: "Shuffle cards",
      choosePlayer: "Choose player:",
      endSession: "End session",
      thisGoesTo: "This one goes to",
      readAloud: "Read the card aloud, take your time. If you like, someone can ask one gentle clarifying question.",
      markAnswered: "Mark as answered",
      favorite: "☆ Favorite",
      favorited: "★ Favorited",
      back: "Back",
      noMoreCards: "No more cards available. End session or adjust settings.",
      rateQuestion: "Rate this question",
      averageRating: "Average",
      youRated: "You rated",
    },
    closing: {
      groupTitle: "Closing reflection",
      groupDescription: "Everyone answers this one together.",
      personalTitle: "Closing card for",
      personalDescription: "A final reflection for tonight.",
      continueToPersonal: "Continue to personal reflections",
      next: "Next",
      finish: "Finish",
      summaryTitle: "All cards on the table",
      summaryMessage: "Thank you for sharing the evening.",
      returnHome: "Return home",
      noClosingCards: "No closing cards available. This is a placeholder.",
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
      tagline: "Hikayeler, itiraflar ve sessiz gerçekler için bir akşam.",
      startNewSession: "Yeni bir oturum başlat",
      createGame: "Oyun Oluştur",
      joinGame: "Oyuna Katıl",
      singlePlayer: "Tek Oyuncu",
      underConstruction: "Yapım Aşamasında",
    },
    gameFlow: {
      createGame: "Oyun Oluştur",
      createGameDescription: "Bir oyun oluştur ve PIN'i diğerleriyle paylaş.",
      yourName: "Adın",
      namePlaceholder: "Adını gir",
      gamePin: "Oyun PIN'i",
      pinCopied: "PIN kopyalandı!",
      copyPin: "PIN'i Kopyala",
      waitingForPlayers: "Oyuncuların katılması bekleniyor...",
      joinGame: "Oyuna Katıl",
      joinGameDescription: "Mevcut bir oyuna katılmak için oyun PIN'ini gir.",
      enterPin: "PIN Gir",
      pinPlaceholder: "4 haneli PIN gir",
      invalidPin: "Geçersiz PIN. Lütfen tekrar dene.",
      startGame: "Oyunu Başlat",
    },
    setup: {
      title: "Bu akşamın masasını hazırla",
      players: "Oyuncular",
      addPlayer: "Ekle",
      playerPlaceholder: "Oyuncu adı ekle",
      decks: "Desteler",
      intensity: "Yoğunluk",
      intensityDescription: "Bu akşamın ne kadar derine gideceğini seç. Oynarken her zaman ayarlayabilirsin.",
      back: "Geri",
      beginEvening: "Akşamı başlat",
    },
    game: {
      title: "Tüm Kartlar Masada",
      round: "Tur",
      shuffleCards: "Kartları karıştır",
      choosePlayer: "Oyuncu seç:",
      endSession: "Oturumu bitir",
      thisGoesTo: "Bu kart",
      readAloud: "Kartı yüksek sesle oku, acele etme. İstersen, masadaki biri nazik bir açıklayıcı soru sorabilir.",
      markAnswered: "Cevaplandı olarak işaretle",
      favorite: "☆ Favori",
      favorited: "★ Favorilendi",
      back: "Geri",
      noMoreCards: "Daha fazla kart yok. Oturumu bitir veya ayarları değiştir.",
      rateQuestion: "Bu soruyu değerlendir",
      averageRating: "Ortalama",
      youRated: "Sen değerlendirdin",
    },
    closing: {
      groupTitle: "Kapanış yansıması",
      groupDescription: "Herkes buna birlikte cevap verir.",
      personalTitle: "Kapanış kartı",
      personalDescription: "Bu akşam için son bir yansıma.",
      continueToPersonal: "Kişisel yansımalara geç",
      next: "Sonraki",
      finish: "Bitir",
      summaryTitle: "Tüm kartlar masada",
      summaryMessage: "Bu akşamı paylaştığınız için teşekkürler.",
      returnHome: "Ana sayfaya dön",
      noClosingCards: "Kapanış kartı mevcut değil. Bu bir yer tutucu.",
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
