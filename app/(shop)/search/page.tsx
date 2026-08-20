"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { searchProducts } from "@/features/products/api";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductGridSkeleton } from "@/features/products/components/ProductCardSkeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Syncing from the mock product API (an external, async data source)
    // whenever the query changes, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(null);
    searchProducts(q).then((items) => {
      if (!cancelled) setResults(items);
    });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <h1 className="text-brand-950 mb-1 text-2xl font-extrabold tracking-tight">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="mb-8 text-sm text-zinc-500">
        {results === null
          ? "Searching…"
          : `${results.length} ${results.length === 1 ? "product" : "products"} found`}
      </p>
      {!q ? (
        <p className="text-sm text-zinc-500">
          Enter a search term to find products.
        </p>
      ) : results === null ? (
        <ProductGridSkeleton count={4} />
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
