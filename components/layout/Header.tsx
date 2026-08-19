import Link from "next/link";
import { Suspense } from "react";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { CartButton } from "@/components/layout/CartButton";
import { WishlistLink } from "@/components/layout/WishlistLink";
import { SearchBar } from "@/components/layout/SearchBar";
import { CATEGORIES } from "@/features/products/lib/categories";

const CATEGORY_LINKS = [
  { label: "Today's Deals", href: "/deals" },
  ...CATEGORIES.map((category) => ({
    label: category.label,
    href: `/products?category=${category.slug}`,
  })),
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
          <Suspense fallback={<div className="h-11 rounded-md bg-white" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="order-2 ml-auto flex items-center gap-1 sm:order-3 sm:ml-0">
          <AccountMenu />
          <WishlistLink />
          <CartButton />
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
