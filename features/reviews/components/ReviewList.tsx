import type { Review } from "@/types";
import { StarRating } from "@/features/products/components/StarRating";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No reviews yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="border-surface-border border-b pb-5 last:border-b-0"
        >
          <div className="flex items-center justify-between gap-2">
            <StarRating rating={review.rating} />
            <span className="text-xs text-zinc-500">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-brand-950 mt-1.5 text-sm font-semibold">
            {review.title}
          </p>
          <p className="mt-1 text-sm text-zinc-600">{review.body}</p>
          <p className="mt-1.5 text-xs font-medium text-zinc-500">
            {review.userName}
          </p>
        </li>
      ))}
    </ul>
  );
}
