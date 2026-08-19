import type { Review } from "@/types";

// MOCK: reviews persisted to localStorage, seeded with a few starter
// reviews so product pages aren't empty by default. Replace with API
// Gateway/Lambda reads and writes to DynamoDB in Phase 2.

const REVIEWS_KEY = "marketplace:mock-reviews";

const SEED_REVIEWS: Review[] = [
  {
    id: "seed-review-1",
    productId: "aurora-wireless-noise-cancelling-headphones",
    userId: "seed-user-1",
    userName: "Priya K.",
    rating: 5,
    title: "Best headphones I've owned",
    body: "The noise cancellation is fantastic for open offices, and the battery genuinely lasts most of the week for me.",
    createdAt: "2026-02-10T12:00:00.000Z",
  },
  {
    id: "seed-review-2",
    productId: "aurora-wireless-noise-cancelling-headphones",
    userId: "seed-user-2",
    userName: "Marcus T.",
    rating: 4,
    title: "Great sound, a bit tight at first",
    body: "Audio quality is excellent. The headband was snug out of the box but loosened up after a week of wear.",
    createdAt: "2026-02-18T09:30:00.000Z",
  },
  {
    id: "seed-review-3",
    productId: "bookhaven-deep-work-principles",
    userId: "seed-user-3",
    userName: "Alicia R.",
    rating: 5,
    title: "Changed how I plan my week",
    body: "Practical, not preachy. I started blocking two-hour focus sessions after reading chapter three and it stuck.",
    createdAt: "2026-01-22T15:00:00.000Z",
  },
];

function readReviews(): Review[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(REVIEWS_KEY);
  if (!raw) {
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

function writeReviews(reviews: Review[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getReviewsByProduct(productId: string): Review[] {
  return readReviews()
    .filter((review) => review.productId === productId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReview(
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  title: string,
  body: string,
): Review {
  const review: Review = {
    id: crypto.randomUUID(),
    productId,
    userId,
    userName,
    rating,
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  writeReviews([...readReviews(), review]);
  return review;
}
