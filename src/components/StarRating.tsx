import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  reviewCount?: number;
}

export const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = "md",
  showNumber = false,
  reviewCount
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const iconSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
        
        return (
          <div key={i} className="relative">
            <Star className={`${iconSize} text-muted-foreground/30`} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star className={`${iconSize} text-yellow-500 fill-yellow-500`} />
            </div>
          </div>
        );
      })}
      {showNumber && (
        <span className="text-sm font-medium ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-muted-foreground"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
