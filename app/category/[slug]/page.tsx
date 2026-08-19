import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  getCategoryBySlug,
} from "@/features/products/lib/categories";
import { getProductsByCategory } from "@/features/products/lib/mockProducts";
import { applyFilters, parseFilters } from "@/features/products/lib/filterSort";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterSortBar } from "@/features/products/components/FilterSortBar";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category ? `${category.label} — marketplace` : "Category not found",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const filters = parseFilters(await searchParams);
  const products = applyFilters(getProductsByCategory(slug), filters);
  const Icon = category.icon;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${category.tint} text-white`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-brand-950 text-2xl font-extrabold tracking-tight">
            {category.label}
          </h1>
          <p className="text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>
      <div className="mb-6">
        <FilterSortBar basePath={`/category/${slug}`} filters={filters} />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
