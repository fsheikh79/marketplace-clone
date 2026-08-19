"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import {
  getProducts,
  type ProductPage,
  type SortOption,
} from "@/features/products/api";
import { CATEGORIES } from "@/features/products/lib/categories";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductGridSkeleton } from "@/features/products/components/ProductCardSkeleton";
import { Pagination } from "@/features/products/components/Pagination";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest arrivals",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export function ProductListing() {
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<ProductPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Re-sync category from the URL whenever it changes — e.g. a header/home
  // link to /products?category=X while already on this route doesn't
  // remount the component, so the initial useState value alone would miss it.
  useEffect(() => {
    // Syncing from the URL (an external system) on navigation, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(searchParams.get("category") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    // Syncing from the mock product API (an external, async data source)
    // whenever the query changes, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    getProducts({
      category: category || undefined,
      minPrice,
      maxPrice,
      sort,
      page,
    }).then((res) => {
      if (cancelled) return;
      setResult(res);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [category, minPrice, maxPrice, sort, page]);

  function handleCategoryChange(next: string) {
    setCategory(next);
    setPage(1);
  }

  function handlePriceApply(event: FormEvent) {
    event.preventDefault();
    setMinPrice(minPriceInput ? Number(minPriceInput) : undefined);
    setMaxPrice(maxPriceInput ? Number(maxPriceInput) : undefined);
    setPage(1);
  }

  function handleSortChange(next: SortOption) {
    setSort(next);
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold tracking-tight">
        All Products
      </h1>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar: category + price filters */}
        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="text-brand-950 mb-3 text-sm font-bold tracking-wide uppercase">
              Category
            </h2>
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  aria-current={category === "" ? "true" : undefined}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                    category === ""
                      ? "bg-brand-900 font-semibold text-white"
                      : "hover:bg-surface-muted text-zinc-600"
                  }`}
                >
                  All categories
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(cat.slug)}
                    aria-current={category === cat.slug ? "true" : undefined}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                      category === cat.slug
                        ? "bg-brand-900 font-semibold text-white"
                        : "hover:bg-surface-muted text-zinc-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-brand-950 mb-3 text-sm font-bold tracking-wide uppercase">
              Price
            </h2>
            <form onSubmit={handlePriceApply} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="minPrice" className="sr-only">
                  Min price
                </label>
                <input
                  id="minPrice"
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 w-full rounded-md border px-2 text-sm outline-none focus:ring-2"
                />
                <span className="text-zinc-400">–</span>
                <label htmlFor="maxPrice" className="sr-only">
                  Max price
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 w-full rounded-md border px-2 text-sm outline-none focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="border-brand-900 text-brand-900 hover:bg-brand-900 h-9 rounded-md border text-sm font-semibold hover:text-white"
              >
                Apply
              </button>
            </form>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              {isLoading
                ? "Loading products…"
                : `${result?.total ?? 0} ${result?.total === 1 ? "product" : "products"}`}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-zinc-600">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 rounded-md border px-2 text-sm outline-none focus:ring-2"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : !result || result.items.length === 0 ? (
            <div className="border-surface-border flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
              <PackageSearch
                className="h-10 w-10 text-zinc-300"
                aria-hidden="true"
              />
              <p className="text-sm text-zinc-600">
                No products match your filters.
              </p>
            </div>
          ) : (
            <>
              <ProductGrid products={result.items} />
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
