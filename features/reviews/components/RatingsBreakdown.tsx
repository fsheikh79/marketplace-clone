import type { Review } from "@/types";

export function RatingsBreakdown({
  reviews,
  activeStars,
  onSelectStars,
}: {
  reviews: Review[];
  activeStars: number | null;
  onSelectStars: (stars: number | null) => void;
}) {
  if (reviews.length === 0) return null;

  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => Math.round(review.rating) === stars)
      .length,
  }));

  return (
    <div className="mb-6 flex flex-col gap-1.5">
      {counts.map(({ stars, count }) => {
        const percent = Math.round((count / reviews.length) * 100);
        const isActive = activeStars === stars;
        return (
          <button
            key={stars}
            type="button"
            onClick={() => onSelectStars(isActive ? null : stars)}
            aria-pressed={isActive}
            className={`flex items-center gap-2 rounded-sm px-1 py-0.5 text-left text-sm transition-colors ${
              isActive ? "bg-surface-muted" : "hover:bg-surface-muted"
            }`}
          >
            <span className="w-14 shrink-0 text-zinc-600">{stars} stars</span>
            <span className="border-surface-border h-2.5 w-40 shrink-0 overflow-hidden rounded-full border bg-white">
              <span
                className="bg-accent-500 block h-full"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="w-10 shrink-0 text-zinc-500">{percent}%</span>
          </button>
        );
      })}
      {activeStars !== null && (
        <button
          type="button"
          onClick={() => onSelectStars(null)}
          className="text-secondary-600 mt-1 w-fit text-xs font-semibold hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
