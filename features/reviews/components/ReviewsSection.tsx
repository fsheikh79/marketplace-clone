"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/types";
import { getReviewsByProduct } from "@/features/reviews/lib/mockReviewStore";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    // Syncing from localStorage (an external system) on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(getReviewsByProduct(productId));
  }, [productId]);

  if (reviews === null) return null;

  return (
    <section className="mt-16 grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-brand-950 mb-6 text-xl font-extrabold">
          Customer reviews ({reviews.length})
        </h2>
        <ReviewList reviews={reviews} />
      </div>
      <div>
        <h2 className="text-brand-950 mb-4 text-lg font-bold">
          Write a review
        </h2>
        <ReviewForm
          productId={productId}
          onSubmitted={(review) =>
            setReviews((prev) => [review, ...(prev ?? [])])
          }
        />
      </div>
    </section>
  );
}
