"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <input
          id="site-search"
          type="search"
          placeholder="Search products, brands, and categories"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-brand-950 focus:border-accent-500 h-11 w-full rounded-md border-2 border-transparent bg-white pr-12 pl-4 text-sm placeholder:text-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-accent-500 text-brand-950 hover:bg-accent-600 absolute top-0 right-0 flex h-11 w-11 items-center justify-center rounded-r-md"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
