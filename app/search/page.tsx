import type { Metadata } from "next";
import { searchProducts } from "@/features/products/lib/mockProducts";
import { applyFilters, parseFilters } from "@/features/products/lib/filterSort";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { FilterSortBar } from "@/features/products/components/FilterSortBar";

export const metadata: Metadata = { title: "Search — marketplace" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { q = "" } = resolvedSearchParams;
  const filters = parseFilters(resolvedSearchParams);
  const results = applyFilters(searchProducts(q), filters);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-1 text-2xl font-extrabold tracking-tight">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        {results.length} {results.length === 1 ? "product" : "products"} found
      </p>
      {q ? (
        <>
          <div className="mb-6">
            <FilterSortBar
              basePath="/search"
              extraParams={{ q }}
              filters={filters}
            />
          </div>
          <ProductGrid products={results} />
        </>
      ) : (
        <p className="text-sm text-zinc-500">
          Enter a search term to find products.
        </p>
      )}
    </div>
  );
}
