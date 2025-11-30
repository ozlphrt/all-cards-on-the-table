import React, { useState, useMemo } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";
import { DeckTags } from "../ui/DeckTags";
import { getAllCards, getCardText, type DeckTag, type IntensityLevel } from "../../data/cards";

export const SinglePlayerScreen: React.FC = () => {
  const { setScreen, voteCard, getCardVotes, isCardHidden } = useSessionStore();
  const { t, language } = useLanguageStore();

  const [selectedDeckTags, setSelectedDeckTags] = useState<Set<DeckTag>>(new Set(["all"]));
  const [selectedIntensities, setSelectedIntensities] = useState<Set<IntensityLevel>>(new Set([1, 2, 3, 4, 5]));
  const [searchQuery, setSearchQuery] = useState("");
  const [voteUpdateTrigger, setVoteUpdateTrigger] = useState(0);

  // Listen for card-generated events
  React.useEffect(() => {
    const handleCardGenerated = () => {
      console.log("Card generated event received, updating UI...");
      setVoteUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener('card-generated', handleCardGenerated);
    return () => window.removeEventListener('card-generated', handleCardGenerated);
  }, []);

  const allDeckTags: DeckTag[] = ["all", "nostalgia", "love", "identity", "deep_waters", "shadow", "philosophy", "story", "couple"];

  const filteredCards = useMemo(() => {
    // Force fresh read from localStorage on each recalculation
    const allCards = getAllCards();
    const originalCount = allCards.filter(c => !c.id.startsWith('gen-')).length;
    const generatedCount = allCards.filter(c => c.id.startsWith('gen-')).length;
    
    const filtered = allCards.filter((card) => {
      // Filter out cards with too many downvotes
      if (isCardHidden(card.id)) return false;

      // Filter by deck tags
      const matchesDeck = card.deck_tags.some((tag) => selectedDeckTags.has(tag));
      if (!matchesDeck) return false;

      // Filter by intensity
      if (!selectedIntensities.has(card.intensity_level)) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cardText = getCardText(card, language).toLowerCase();
        if (!cardText.includes(query)) return false;
      }

      return true;
    });
    
    const filteredOriginal = filtered.filter(c => !c.id.startsWith('gen-')).length;
    const filteredGenerated = filtered.filter(c => c.id.startsWith('gen-')).length;
    
    console.log(`filteredCards: ${allCards.length} total (${originalCount} original + ${generatedCount} generated) → ${filtered.length} visible (${filteredOriginal} original + ${filteredGenerated} generated), trigger=${voteUpdateTrigger}`);
    console.log(`  Filters: intensities=${Array.from(selectedIntensities).join(',')}, decks=${Array.from(selectedDeckTags).join(',')}, search="${searchQuery}"`);
    
    return filtered;
  }, [selectedDeckTags, selectedIntensities, searchQuery, language, isCardHidden, voteUpdateTrigger]);

  const toggleDeckTag = (tag: DeckTag) => {
    if (tag === "all") {
      // ALL button acts as select all / deselect all
      const isAllSelected = selectedDeckTags.has("all");
      if (isAllSelected) {
        // Turn OFF all tags
        setSelectedDeckTags(new Set());
      } else {
        // Turn ON all tags
        setSelectedDeckTags(new Set(allDeckTags));
      }
    } else {
      // Individual tag toggle
      const newSet = new Set(selectedDeckTags);
      if (newSet.has(tag)) {
        newSet.delete(tag);
        // If removing a tag, also remove "all" if it was selected
        newSet.delete("all");
      } else {
        newSet.add(tag);
      }
      setSelectedDeckTags(newSet);
    }
  };

  const toggleIntensity = (level: IntensityLevel) => {
    const newSet = new Set(selectedIntensities);
    if (newSet.has(level)) {
      // Don't allow removing all intensities
      if (newSet.size === 1) return;
      newSet.delete(level);
    } else {
      newSet.add(level);
    }
    setSelectedIntensities(newSet);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9]">
      {/* Top bar */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,18,0.4)] backdrop-blur-[12px] relative z-50">
        {/* Line 1: Back button and flag */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setScreen("WELCOME")}
            className="text-xs text-[#C6B9A5] hover:text-[#F7F2E9] transition-colors"
          >
            ← {t.setup.back}
          </button>
          <LanguageSelector />
        </div>
        {/* Line 2: Title and subtitle */}
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-[#F7F2E9]">{t.welcome.title}</span>
          <span className="text-sm text-[#C6B9A5]">— {t.singlePlayer.title}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 bg-[rgba(10,10,18,0.3)] backdrop-blur-[8px] border-b border-[rgba(255,255,255,0.08)]">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.singlePlayer.searchPlaceholder}
            className="w-full px-4 py-2 rounded-2xl bg-[rgba(15,15,30,0.65)] border border-[rgba(255,255,255,0.12)] text-[#F7F2E9] placeholder-[#8B8172] focus:outline-none focus:border-[rgba(208,169,107,0.5)] transition-colors"
          />
        </div>

        {/* Deck tags */}
        <div className="mb-4">
          <p className="text-sm text-[#C6B9A5] mb-2">{t.setup.decks}</p>
          <div className="flex flex-wrap gap-2">
            {allDeckTags.map((tag) => {
              const isAllSelected = selectedDeckTags.has("all");
              const isSelected = selectedDeckTags.has(tag) || (isAllSelected && tag !== "all");
              const label = tag === "all" ? t.decks.all : t.decks[tag as keyof typeof t.decks] || tag;
              return (
                <button
                  key={tag}
                  onClick={() => toggleDeckTag(tag)}
                  className={`px-3 py-1.5 rounded text-xs transition-all ${
                    isSelected
                      ? "bg-[rgba(208,169,107,0.3)] text-[#F4C879] border border-[rgba(208,169,107,0.5)]"
                      : "bg-[rgba(15,15,30,0.5)] text-[#8B8172] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity */}
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#C6B9A5]">{t.setup.intensity}</p>
            <div className="flex items-center -space-x-2">
              {[1, 2, 3, 4, 5].map((level) => {
                const isSelected = selectedIntensities.has(level as IntensityLevel);
                return (
                  <button
                    key={level}
                    onClick={() => toggleIntensity(level as IntensityLevel)}
                    className={`text-2xl transition-all relative z-10 hover:z-20 ${
                      isSelected 
                        ? "opacity-100 scale-100 drop-shadow-[0_0_12px_rgba(244,200,121,0.9),0_0_24px_rgba(244,200,121,0.5)]" 
                        : "opacity-30 scale-90"
                    } hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(244,200,121,0.6),0_0_24px_rgba(244,200,121,0.3)]`}
                    title={`Intensity ${level}`}
                  >
                    🔥
                  </button>
                );
              })}
            </div>
            <span className="text-sm text-[#8B8172]">
              {filteredCards.length} {t.singlePlayer.cardsFound}
            </span>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 text-[#8B8172]">
            <p className="text-lg">{t.singlePlayer.noCards}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => {
              const votes = getCardVotes(card.id);
              const isAnswered = votes.up > 0 || votes.down > 0;
              return (
                <div
                  key={card.id}
                  className={`rounded-3xl backdrop-blur-[18px] border shadow-xl px-5 py-4 transition-all flex flex-col ${
                    isAnswered
                      ? "opacity-40 border-[rgba(255,255,255,0.08)] bg-[rgba(25,25,45,0.5)]"
                      : "border-[rgba(255,255,255,0.15)] bg-[rgba(25,25,45,0.75)] hover:scale-[1.02] hover:border-[rgba(208,169,107,0.5)] hover:bg-[rgba(30,30,50,0.85)]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#8B8172] leading-none">
                        {Array.from({ length: card.intensity_level }, (_, i) => (
                          <span key={i} className="inline-block -mr-2">🔥</span>
                        ))}
                      </span>
                    </div>
                    <DeckTags deckTags={card.deck_tags} />
                  </div>

                  <p className="text-xl leading-tight font-medium text-[#E8DDD0] flex-1 mb-4">
                    {getCardText(card, language)}
                  </p>

                  {/* Thumbs up/down buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(255,255,255,0.1)]">
                    <button
                      onClick={() => {
                        console.log(`Thumbs up clicked for card: ${card.id}`);
                        voteCard(card.id, "up");
                        // Force refresh to show newly generated cards
                        // Use multiple timeouts to catch cards as they're generated
                        setTimeout(() => {
                          console.log("Triggering UI update (500ms)");
                          setVoteUpdateTrigger((prev) => prev + 1);
                        }, 500);
                        setTimeout(() => {
                          console.log("Triggering UI update (1500ms)");
                          setVoteUpdateTrigger((prev) => prev + 1);
                        }, 1500);
                        setTimeout(() => {
                          console.log("Triggering UI update (3000ms)");
                          setVoteUpdateTrigger((prev) => prev + 1);
                        }, 3000);
                        setTimeout(() => {
                          console.log("Triggering UI update (5000ms)");
                          setVoteUpdateTrigger((prev) => prev + 1);
                        }, 5000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[rgba(15,15,30,0.5)] hover:bg-[rgba(208,169,107,0.2)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(208,169,107,0.3)] transition-all text-[#8B8172] hover:text-[#F4C879]"
                      title="Thumbs up"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v12"/>
                        <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                      </svg>
                      {votes.up > 0 && (
                        <span className="text-xs">{votes.up}</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        voteCard(card.id, "down");
                        setVoteUpdateTrigger(prev => prev + 1);
                        setVoteUpdateTrigger((prev) => prev + 1);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[rgba(15,15,30,0.5)] hover:bg-[rgba(200,100,100,0.2)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(200,100,100,0.3)] transition-all text-[#8B8172] hover:text-[#E88]"
                      title="Thumbs down"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 14V2"/>
                        <path d="M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
                      </svg>
                      {votes.down > 0 && (
                        <span className="text-xs">{votes.down}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

