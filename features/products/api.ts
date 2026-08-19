import type { Product } from "@/types";
import {
  getAllProducts,
  getProductById as getProductByIdSync,
  getProductBySlug as getProductBySlugSync,
  getRelatedProducts as getRelatedProductsSync,
} from "@/features/products/lib/mockProducts";

/**
 * Mock product API. Every call here returns a Promise and takes the same
 * shape a real API Gateway/Lambda-backed fetch would, so call sites already
 * look async — swapping the body of these functions for real `fetch()`
 * calls in Phase 2 requires no changes anywhere else in the app.
 */

// MOCK: small artificial latency so loading states are actually observable
// in the UI, standing in for real network latency.
const MOCK_LATENCY_MS = 350;

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

  let items = getAllProducts();

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
  return delay(getProductBySlugSync(slug));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return delay(getRelatedProductsSync(product, limit));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = ids
    .map((id) => getProductByIdSync(id))
    .filter((product): product is Product => Boolean(product));
  return delay(products);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return delay([]);
  const matches = getAllProducts().filter((product) =>
    [product.title, product.brand, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
  return delay(matches);
}
