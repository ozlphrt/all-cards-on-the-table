import React from "react";
import type { DeckTag } from "../../data/cards";
import { useLanguageStore } from "../../i18n/languageStore";

interface DeckTagsProps {
  deckTags: DeckTag[];
}

const deckTagMap: Record<DeckTag, string> = {
  all: "all",
  nostalgia: "nostalgia",
  love: "love",
  identity: "identity",
  deep_waters: "deepWaters",
  shadow: "shadows",
  philosophy: "philosophy",
  story: "story",
  couple: "couple",
  group: "group",
  closing: "closing",
};

export const DeckTags: React.FC<DeckTagsProps> = ({ deckTags }) => {
  const { t } = useLanguageStore();
  
  // Filter out "all" since all cards belong to all
  const displayTags = deckTags.filter((tag) => tag !== "all");

  if (displayTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => {
        const key = deckTagMap[tag] || tag;
        const label = t.decks[key as keyof typeof t.decks] || tag;
        return (
          <span
            key={tag}
            className="px-2 py-1 rounded text-xs bg-[rgba(208,169,107,0.15)] text-[#D0A96B] border border-[rgba(208,169,107,0.3)]"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
};

