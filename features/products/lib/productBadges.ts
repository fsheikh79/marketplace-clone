import type { Product } from "@/types";

const NEW_WITHIN_DAYS = 30;
const BEST_SELLER_REVIEW_THRESHOLD = 2000;
const SALE_PERCENT_OFF = 20;

/** Small deterministic hash so "is this on sale" is stable across renders
 * and reloads without needing a real promotions field on Product. */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export interface ProductBadgeInfo {
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isLimitedStock: boolean;
  salePercentOff: number;
  compareAtPrice: number;
}

// MOCK: "on sale" is a deterministic, purely presentational flag derived
// from the product slug — display only, doesn't change what checkout
// actually charges. Replace with a real promotions/pricing field in
// Phase 2.
export function getProductBadges(product: Product): ProductBadgeInfo {
  const daysSinceCreated =
    (Date.now() - new Date(product.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);
  const isOnSale = hashSlug(product.slug) % 5 === 0;

  return {
    isNew: daysSinceCreated <= NEW_WITHIN_DAYS,
    isBestSeller: product.reviewCount >= BEST_SELLER_REVIEW_THRESHOLD,
    isOnSale,
    isLimitedStock: product.stock > 0 && product.stock < 5,
    salePercentOff: SALE_PERCENT_OFF,
    compareAtPrice: isOnSale
      ? Math.round((product.price / (1 - SALE_PERCENT_OFF / 100)) * 100) / 100
      : product.price,
  };
}
