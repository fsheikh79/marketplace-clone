import { Star, StarHalf } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="text-accent-500 flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          if (index < fullStars) {
            return (
              <Star key={index} className={iconSize} fill="currentColor" />
            );
          }
          if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf key={index} className={iconSize} fill="currentColor" />
            );
          }
          return <Star key={index} className={`${iconSize} text-zinc-300`} />;
        })}
      </div>
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-zinc-500">
          {reviewCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}
