import React, { useEffect } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { LanguageSelector } from "../ui/LanguageSelector";
import { DeckTags } from "../ui/DeckTags";
import { ALL_CARDS, getCardText } from "../../data/cards";

export const MainGameScreen: React.FC = () => {
  const {
    currentCandidateCards,
    currentSelectedCard,
    pickNewCards,
    selectCard,
    markAnswered,
    skipCurrentSet,
    rateCard,
    getCardRating,
    setScreen,
  } = useSessionStore();

  const { t, language } = useLanguageStore();

  useEffect(() => {
    if (!currentCandidateCards.length && !currentSelectedCard) {
      pickNewCards(ALL_CARDS);
    }
  }, [currentCandidateCards.length, currentSelectedCard, pickNewCards]);

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9]">
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between text-xs text-[#C6B9A5] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,18,0.4)] backdrop-blur-[12px]">
        <span>{t.game.title}</span>
        <div className="flex items-center gap-3">
          <span>{t.game.round} {useSessionStore.getState().currentRoundNumber}</span>
          <LanguageSelector />
        </div>
      </div>

      {/* Cards area */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        {currentCandidateCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-4xl w-full md:grid-cols-3">
            {currentCandidateCards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  if (currentSelectedCard?.id === card.id) {
                    // Deselect if clicking the same card
                    selectCard("");
                    useSessionStore.setState({ currentSelectedCard: null });
                  } else {
                    selectCard(card.id);
                  }
                }}
                className={`h-auto min-h-[200px] md:min-h-[240px] rounded-3xl backdrop-blur-[18px] border shadow-xl px-5 py-4 text-left transition-all flex flex-col relative ${
                  currentSelectedCard?.id === card.id
                    ? "bg-[rgba(25,25,45,0.85)] border-[rgba(208,169,107,0.6)] scale-[1.02] shadow-2xl"
                    : currentSelectedCard
                    ? "bg-[rgba(15,15,30,0.25)] border-[rgba(255,255,255,0.05)] opacity-30"
                    : "bg-[rgba(25,25,45,0.75)] border-[rgba(255,255,255,0.15)] hover:scale-[1.02] hover:border-[rgba(208,169,107,0.5)] hover:bg-[rgba(30,30,50,0.85)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#8B8172] leading-none">
                      {Array.from({ length: card.intensity_level }, (_, i) => (
                        <span key={i} className="inline-block -mr-2">🔥</span>
                      ))}
                    </span>
                    <span className="text-sm text-[#8B8172]">
                      Fire {card.intensity_level}
                    </span>
                  </div>
                  <DeckTags deckTags={card.deck_tags} />
                </div>
                <p className={`text-2xl md:text-3xl leading-tight flex-1 font-bold text-[#E8DDD0] ${
                  currentSelectedCard?.id === card.id ? "text-3xl md:text-4xl" : ""
                }`}>{getCardText(card, language)}</p>
                {currentSelectedCard?.id === card.id && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const currentRating = getCardRating(card.id);
                        const isActive = currentRating !== null && star <= currentRating;
                        return (
                          <button
                            key={star}
                            className="text-base text-[#8B8172] hover:text-[#D0A96B] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newRating = currentRating === star ? 0 : star;
                              rateCard(card.id, newRating);
                            }}
                            aria-label={`Rate ${star} stars`}
                          >
                            {isActive ? "★" : "☆"}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-xs hover:opacity-90 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAnswered();
                      }}
                    >
                      {t.game.markAnswered}
                    </button>
                  </div>
                )}
                {!currentSelectedCard && (
                  <div className="flex items-center gap-1 mt-2 self-end" onClick={(e) => e.stopPropagation()}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentRating = getCardRating(card.id);
                      const isActive = currentRating !== null && star <= currentRating;
                      return (
                        <button
                          key={star}
                          className="text-sm text-[#8B8172] hover:text-[#D0A96B] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newRating = currentRating === star ? 0 : star;
                            rateCard(card.id, newRating);
                          }}
                          aria-label={`Rate ${star} stars`}
                        >
                          {isActive ? "★" : "☆"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#C6B9A5]">
            <p>{t.game.noMoreCards}</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-4 py-4 flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,18,0.5)] backdrop-blur-[16px]">
        <button
          className="text-xs text-[#C6B9A5] underline hover:text-[#F7F2E9] transition-colors"
          onClick={() => skipCurrentSet()}
        >
          {t.game.shuffleCards}
        </button>
        <button
          className="text-xs text-[#C6B9A5] underline hover:text-[#F7F2E9] transition-colors"
          onClick={() => setScreen("CLOSING_GROUP")}
        >
          {t.game.endSession}
        </button>
      </div>
    </div>
  );
};

