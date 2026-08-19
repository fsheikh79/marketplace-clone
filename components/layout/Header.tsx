import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
// MOCK: cart page doesn't exist until sub-phase 1b — button is inert.
import { AccountMenu } from "@/components/layout/AccountMenu";

// MOCK: cart count is a static placeholder; wire up to the real cart
// feature (sub-phase 1b) when it lands.
const MOCK_CART_ITEM_COUNT = 0;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold tracking-tight text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:text-white"
        >
          market<span className="text-amber-500">place</span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              id="site-search"
              type="search"
              placeholder="Search products, brands, and categories"
              disabled
              className="h-11 w-full rounded-md border border-zinc-300 bg-zinc-50 pr-3 pl-10 text-sm text-zinc-500 placeholder:text-zinc-400 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              // MOCK: placeholder input, wired up once product search lands.
            />
          </div>
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
          <button
            type="button"
            disabled
            className="relative flex h-11 w-11 items-center justify-center rounded-md text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-200"
            aria-label={`Cart, ${MOCK_CART_ITEM_COUNT} items (coming soon)`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {MOCK_CART_ITEM_COUNT > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-zinc-900">
                {MOCK_CART_ITEM_COUNT}
              </span>
            )}
          </button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
