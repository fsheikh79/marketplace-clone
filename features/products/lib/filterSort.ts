import type { Product } from "@/types";

export type SortOption =
  "relevance" | "price-asc" | "price-desc" | "rating-desc" | "newest";

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort: SortOption;
}

interface RawFilterParams {
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}

const SORT_OPTIONS: SortOption[] = [
  "relevance",
  "price-asc",
  "price-desc",
  "rating-desc",
  "newest",
];

function toFiniteNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFilters(params: RawFilterParams): ProductFilters {
  const sort = SORT_OPTIONS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : "relevance";
  return {
    minPrice: toFiniteNumber(params.minPrice),
    maxPrice: toFiniteNumber(params.maxPrice),
    minRating: toFiniteNumber(params.minRating),
    sort,
  };
}

export function applyFilters(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const filtered = products.filter((product) => {
    if (filters.minPrice !== undefined && product.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice)
      return false;
    if (filters.minRating !== undefined && product.rating < filters.minRating)
      return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "rating-desc":
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case "newest":
      return [...filtered].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
    default:
      return filtered;
  }
}
