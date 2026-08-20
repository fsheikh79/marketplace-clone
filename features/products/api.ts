import type { Product } from "@/types";
import {
  listProducts,
  findProductBySlug,
  findProductById,
} from "@/features/products/lib/productStore";
import { getProductBadges } from "@/features/products/lib/productBadges";

/**
 * Mock product API. Every call here returns a Promise and takes the same
 * shape a real API Gateway/Lambda-backed fetch would, so call sites already
 * look async — swapping the body of these functions for real `fetch()`
 * calls in Phase 2 requires no changes anywhere else in the app. Reads go
 * through productStore.ts, the same mutable data source the admin
 * dashboard writes to.
 */

// DEMO: artificial delay to showcase skeleton loading — remove in
// production. Also stands in for real network latency once this becomes a
// real API call.
const MOCK_LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

export type SortOption = "newest" | "price-asc" | "price-desc";

export interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 8;

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductPage> {
  const {
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = query;

  let items = listProducts();

  if (category) {
    items = items.filter((product) => product.category === category);
  }
  if (minPrice !== undefined) {
    items = items.filter((product) => product.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    items = items.filter((product) => product.price <= maxPrice);
  }

  items = [...items].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return delay({
    items: pageItems,
    total,
    page: currentPage,
    pageSize,
    totalPages,
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return delay(findProductBySlug(slug));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const related = listProducts()
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id,
    )
    .slice(0, limit);
  return delay(related);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = ids
    .map((id) => findProductById(id))
    .filter((product): product is Product => Boolean(product));
  return delay(products);
}

// MOCK: homepage carousel sections, derived from the existing catalog
// (sale flag / review count / rating) rather than a real recommendation
// or promotions engine. Replace with real merchandising/recommendation
// endpoints in Phase 2.
export async function getDealsProducts(limit = 10): Promise<Product[]> {
  const items = listProducts().filter(
    (product) => getProductBadges(product).isOnSale,
  );
  return delay(items.slice(0, limit));
}

export async function getTrendingProducts(limit = 10): Promise<Product[]> {
  const items = [...listProducts()].sort(
    (a, b) => b.reviewCount - a.reviewCount,
  );
  return delay(items.slice(0, limit));
}

export async function getRecommendedProducts(limit = 10): Promise<Product[]> {
  const trendingIds = new Set(
    [...listProducts()]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit)
      .map((p) => p.id),
  );
  const items = listProducts()
    .filter((product) => product.rating >= 4.5 && !trendingIds.has(product.id))
    .sort((a, b) => b.rating - a.rating);
  return delay(items.slice(0, limit));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return delay([]);
  const matches = listProducts().filter((product) =>
    [product.title, product.brand, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
  return delay(matches);
}
