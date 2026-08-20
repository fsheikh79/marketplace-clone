import type { Metadata } from "next";
import { searchProducts } from "@/features/products/api";
import { ProductGrid } from "@/features/products/components/ProductGrid";

export const metadata: Metadata = { title: "Search — marketplace" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-1 text-2xl font-extrabold tracking-tight">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="mb-8 text-sm text-zinc-500">
        {results.length} {results.length === 1 ? "product" : "products"} found
      </p>
      {!q ? (
        <p className="text-sm text-zinc-500">
          Enter a search term to find products.
        </p>
      ) : results.length === 0 ? (
        <div className="border-surface-border rounded-lg border bg-white py-16 text-center">
          <p className="text-sm text-zinc-600">
            No products match &ldquo;{q}&rdquo;. Try a different search term.
          </p>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}
