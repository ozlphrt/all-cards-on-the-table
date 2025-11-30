import React from "react";

interface QuestionRatingProps {
  cardId: string;
  currentRating: number | null;
  averageRating: number | null;
  onRate: (rating: number) => void;
}

export const QuestionRating: React.FC<QuestionRatingProps> = ({
  cardId,
  currentRating,
  averageRating,
  onRate,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`text-lg transition-colors ${
              currentRating && star <= currentRating
                ? "text-[#F4C879]"
                : "text-[#8B8172] hover:text-[#C6B9A5]"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
      {averageRating !== null && (
        <p className="text-xs text-[#8B8172]">
          {averageRating.toFixed(1)} ⭐ {currentRating ? "" : ""}
        </p>
      )}
    </div>
  );
};

