"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { addReview } from "@/features/reviews/lib/mockReviewStore";
import { StarRatingInput } from "@/features/reviews/components/StarRatingInput";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types";

export function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: (review: Review) => void;
}) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <p className="border-surface-border bg-surface-muted rounded-md border p-4 text-sm text-zinc-600">
        <Link
          href="/login"
          className="text-secondary-600 font-semibold hover:underline"
        >
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentUser) return;
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!title.trim() || !body.trim()) {
      setError("Please fill in a title and review.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // MOCK: instant local write. Replace with API Gateway/Lambda write to
    // DynamoDB in Phase 2.
    const review = addReview(
      productId,
      currentUser.id,
      currentUser.name,
      rating,
      title.trim(),
      body.trim(),
    );
    onSubmitted(review);
    setRating(0);
    setTitle("");
    setBody("");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <StarRatingInput value={rating} onChange={setRating} />
      <input
        type="text"
        placeholder="Review title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-surface-border text-brand-950 focus:ring-brand-500 h-11 rounded-md border px-3 text-sm outline-none focus:ring-2"
      />
      <textarea
        placeholder="What did you like or dislike?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="border-surface-border text-brand-950 focus:ring-brand-500 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="secondary"
        isLoading={isSubmitting}
        className="w-fit"
      >
        Submit review
      </Button>
    </form>
  );
}
