import React, { useEffect, useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { useLanguageStore } from "../../i18n/languageStore";
import { ALL_CARDS, getCardText } from "../../data/cards";
import type { Card } from "../../data/cards";

export const ClosingRitualScreen: React.FC = () => {
  const { currentScreen, players, setScreen } = useSessionStore();
  const { t, language } = useLanguageStore();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [hasShownGroupCard, setHasShownGroupCard] = useState(false);

  useEffect(() => {
    if (currentScreen === "CLOSING_GROUP" && !hasShownGroupCard) {
      // Show group closing card
      const groupCards = ALL_CARDS.filter(
        (c) => c.formats.includes("closing_group") && c.intensity_level <= 3
      );
      if (groupCards.length > 0) {
        const randomCard = groupCards[Math.floor(Math.random() * groupCards.length)];
        setCurrentCard(randomCard);
      } else {
        // Fallback if no closing_group cards exist yet
        setHasShownGroupCard(true);
        setCurrentCard(null);
      }
    } else if (currentScreen === "CLOSING_PERSONAL" && hasShownGroupCard) {
      // Show personal closing cards
      if (currentPlayerIndex < players.length) {
        const personalCards = ALL_CARDS.filter(
          (c) => c.formats.includes("closing_personal") && c.intensity_level <= 3
        );
        if (personalCards.length > 0) {
          const randomCard = personalCards[Math.floor(Math.random() * personalCards.length)];
          setCurrentCard(randomCard);
        } else {
          setCurrentCard(null);
        }
      }
    }
  }, [currentScreen, hasShownGroupCard, currentPlayerIndex, players.length]);

  const handleNext = () => {
    if (currentScreen === "CLOSING_GROUP") {
      setHasShownGroupCard(true);
      setScreen("CLOSING_PERSONAL");
      setCurrentPlayerIndex(0);
    } else if (currentScreen === "CLOSING_PERSONAL") {
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        setScreen("SESSION_SUMMARY");
      }
    }
  };

  const handleFinish = () => {
    setScreen("WELCOME");
  };

  if (currentScreen === "SESSION_SUMMARY") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9] px-4">
        <div className="max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] shadow-2xl space-y-6 text-center">
          <h2 className="text-2xl font-serif">{t.closing.summaryTitle}</h2>
          <p className="text-[#C6B9A5]">
            {t.closing.summaryMessage}
          </p>
          <button
            onClick={handleFinish}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm hover:opacity-90 transition-opacity"
          >
            {t.closing.returnHome}
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = currentScreen === "CLOSING_PERSONAL" ? players[currentPlayerIndex] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#241824,_#050509)] text-[#F7F2E9] px-4">
      <div className="max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(15,15,30,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] shadow-2xl space-y-6">
        {currentScreen === "CLOSING_GROUP" && (
          <div>
            <h2 className="text-xl font-serif mb-2">{t.closing.groupTitle}</h2>
            <p className="text-sm text-[#C6B9A5]">
              {t.closing.groupDescription}
            </p>
          </div>
        )}
        {currentScreen === "CLOSING_PERSONAL" && currentPlayer && (
          <div>
            <h2 className="text-xl font-serif mb-2">
              {t.closing.personalTitle} {currentPlayer.name}
            </h2>
            <p className="text-sm text-[#C6B9A5]">
              {t.closing.personalDescription}
            </p>
          </div>
        )}
        {currentCard ? (
          <>
            <div className="bg-[rgba(20,20,35,0.6)] rounded-2xl p-6 border border-[rgba(255,255,255,0.05)]">
              <p className="text-lg leading-relaxed">{getCardText(currentCard, language)}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm hover:opacity-90 transition-opacity"
              >
                {currentScreen === "CLOSING_GROUP"
                  ? t.closing.continueToPersonal
                  : currentPlayerIndex < players.length - 1
                  ? t.closing.next
                  : t.closing.finish}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-[#C6B9A5]">
            <p>{t.closing.noClosingCards}</p>
            <button
              onClick={handleFinish}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D0A96B] to-[#F4C879] text-[#1a1208] text-sm hover:opacity-90 transition-opacity"
            >
              {t.closing.returnHome}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

