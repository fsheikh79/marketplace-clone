import type { Product } from "@/types";
import { getAllProducts as getSeedProducts } from "@/features/products/lib/mockProducts";
import { productImages } from "@/features/products/lib/productPhotos";

// MOCK: the mutable product catalog, persisted to localStorage and seeded
// from the static catalog on first read. This is the single source of
// truth every storefront and admin screen reads/writes through (via
// features/products/api.ts) — proving admin edits are reflected on the
// customer-facing site in the same session, not two disconnected mocks.
// Replace with DynamoDB reads/writes (through API Gateway/Lambda) in
// Phase 2; the CRUD functions below are the seam to swap.

const PRODUCTS_KEY = "marketplace:mock-products";

function readProducts(): Product[] {
  if (typeof window === "undefined") return getSeedProducts();
  const raw = window.localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    const seed = getSeedProducts();
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return getSeedProducts();
  }
}

function writeProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, existing: Product[]): string {
  let slug = base || "product";
  let suffix = 2;
  while (existing.some((product) => product.slug === slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export function listProducts(): Product[] {
  return readProducts();
}

export function findProductBySlug(slug: string): Product | undefined {
  return readProducts().find((product) => product.slug === slug);
}

export function findProductById(id: string): Product | undefined {
  return readProducts().find((product) => product.id === id);
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  stock: number;
}

export function createProduct(input: ProductInput): Product {
  const products = readProducts();
  const slug = uniqueSlug(slugify(input.title), products);

  const product: Product = {
    id: slug,
    slug,
    title: input.title,
    description: input.description,
    price: input.price,
    currency: "USD",
    images: productImages(slug, input.title),
    category: input.category,
    brand: input.brand,
    rating: 0,
    reviewCount: 0,
    stock: input.stock,
    createdAt: new Date().toISOString(),
  };

  writeProducts([product, ...products]);
  return product;
}

export function updateProduct(
  id: string,
  patch: Partial<ProductInput>,
): Product | undefined {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return undefined;

  const updated: Product = { ...products[index], ...patch };
  const next = [...products];
  next[index] = updated;
  writeProducts(next);
  return updated;
}

export function deleteProduct(id: string): void {
  writeProducts(readProducts().filter((product) => product.id !== id));
}
