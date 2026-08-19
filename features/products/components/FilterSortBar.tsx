"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type {
  ProductFilters,
  SortOption,
} from "@/features/products/lib/filterSort";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "rating-desc": "Avg. customer rating",
  newest: "Newest arrivals",
};

export function FilterSortBar({
  basePath,
  extraParams = {},
  filters,
}: {
  basePath: string;
  extraParams?: Record<string, string>;
  filters: ProductFilters;
}) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");

  function navigate(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(extraParams);
    const merged = {
      minPrice,
      maxPrice,
      minRating: filters.minRating?.toString(),
      sort: filters.sort,
      ...overrides,
    };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${basePath}?${params.toString()}`);
  }

  function handlePriceSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({ minPrice, maxPrice });
  }

  return (
    <div className="border-surface-border flex flex-wrap items-end gap-6 border-b pb-4">
      <form onSubmit={handlePriceSubmit} className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="minPrice"
            className="text-xs font-semibold text-zinc-600"
          >
            Min price
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 w-24 rounded-md border px-2 text-sm outline-none focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="maxPrice"
            className="text-xs font-semibold text-zinc-600"
          >
            Max price
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 w-24 rounded-md border px-2 text-sm outline-none focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="border-brand-900 text-brand-900 hover:bg-brand-900 h-9 rounded-md border px-3 text-sm font-semibold hover:text-white"
        >
          Apply
        </button>
      </form>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="minRating"
          className="text-xs font-semibold text-zinc-600"
        >
          Customer rating
        </label>
        <select
          id="minRating"
          value={filters.minRating?.toString() ?? ""}
          onChange={(e) => navigate({ minRating: e.target.value || undefined })}
          className="border-surface-border text-brand-950 focus:ring-brand-500 h-9 rounded-md border px-2 text-sm outline-none focus:ring-2"
        >
          <option value="">Any rating</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
        </select>
      </div>

      <div className="ml-auto flex flex-col gap-1">
        <label htmlFor="sort" className="text-xs font-semibold text-zinc-600">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => navigate({ sort: e.target.value })}
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
  );
}
