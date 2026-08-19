import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { AccountMenu } from "@/components/layout/AccountMenu";

// MOCK: cart count is a static placeholder; wire up to the real cart
// feature (sub-phase 1b) when it lands.
const MOCK_CART_ITEM_COUNT = 0;

const CATEGORY_LINKS = [
  { label: "Today's Deals", href: "/deals" },
  { label: "Electronics", href: "/category/electronics" },
  { label: "Fashion", href: "/category/fashion" },
  { label: "Home & Kitchen", href: "/category/home-kitchen" },
  { label: "Beauty", href: "/category/beauty" },
  { label: "Sports & Outdoors", href: "/category/sports-outdoors" },
  { label: "Books", href: "/category/books" },
];

export function Header() {
  return (
    <header className="bg-brand-950 sticky top-0 z-30">
      {/* Primary bar: logo, search, account, cart */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-visible:outline-accent-500 shrink-0 rounded-sm px-1 py-1 text-2xl font-black tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          market<span className="text-accent-500">place</span>
        </Link>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <input
              id="site-search"
              type="search"
              placeholder="Search products, brands, and categories"
              disabled
              className="text-brand-950 focus:border-accent-500 h-11 w-full rounded-md border-2 border-transparent bg-white pr-12 pl-4 text-sm placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed"
              // MOCK: placeholder input, wired up once product search lands.
            />
            <button
              type="button"
              disabled
              aria-label="Search"
              className="bg-accent-500 text-brand-950 absolute top-0 right-0 flex h-11 w-11 items-center justify-center rounded-r-md disabled:cursor-not-allowed"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="order-2 ml-auto flex items-center gap-1 sm:order-3 sm:ml-0">
          <AccountMenu />
          <button
            type="button"
            disabled
            className="relative flex h-11 w-11 items-center justify-center rounded-md text-white disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={`Cart, ${MOCK_CART_ITEM_COUNT} items (coming soon)`}
          >
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            {MOCK_CART_ITEM_COUNT > 0 && (
              <span className="bg-accent-500 text-brand-950 absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                {MOCK_CART_ITEM_COUNT}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary bar: category navigation */}
      <nav
        aria-label="Product categories"
        className="bg-brand-900 border-t border-white/10"
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-6 lg:px-8">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-visible:outline-accent-500 shrink-0 rounded-sm px-2.5 py-1 text-xs font-medium whitespace-nowrap text-zinc-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
