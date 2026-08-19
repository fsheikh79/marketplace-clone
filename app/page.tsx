import Link from "next/link";
import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/features/products/lib/categories";

const TRUST_BADGES = [
  {
    icon: Truck,
    title: "Free shipping",
    body: "On orders over $35, nationwide.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "Encrypted payments, every order.",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    body: "30-day hassle-free return window.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    body: "Real humans, whenever you need us.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-brand-950 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,166,35,0.18),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(15,110,100,0.35),transparent_50%)]"
        />
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <span className="bg-accent-500 text-brand-950 inline-block rounded-sm px-3 py-1 text-xs font-bold tracking-wide uppercase">
              Now in development
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Shop everything, in one place.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-zinc-300">
              Thousands of products, unbeatable prices, delivered fast. Browse
              the catalog, add to cart, and check out in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/category/electronics">
                <Button variant="primary" className="h-12 px-7 text-base">
                  Start shopping
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary-on-dark"
                  className="h-12 px-7 text-base"
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="grid w-full max-w-md grid-cols-3 gap-3 lg:w-auto"
          >
            {CATEGORIES.map(({ label, icon: Icon, tint }) => (
              <div
                key={label}
                className={`flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-lg ${tint} text-white shadow-lg sm:h-28 sm:w-28`}
              >
                <Icon className="h-7 w-7" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-brand-950 text-2xl font-extrabold tracking-tight">
            Shop by category
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ label, slug, icon: Icon, tint }) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="group border-surface-border focus-visible:outline-brand-500 flex flex-col items-center gap-3 rounded-lg border bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${tint} text-white transition-transform group-hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-brand-950 text-sm font-semibold">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="from-secondary-600 to-secondary-500 flex flex-col justify-between gap-6 rounded-lg bg-gradient-to-br p-8 text-white">
            <div>
              <span className="text-xs font-bold tracking-wide uppercase opacity-80">
                Best sellers
              </span>
              <h3 className="mt-2 text-2xl font-extrabold">
                Top-rated picks, all in one spot.
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Curated by real customer ratings.
              </p>
            </div>
            <Link href="/category/electronics">
              <Button variant="secondary-on-dark" className="w-fit">
                Browse best sellers
              </Button>
            </Link>
          </div>
          <div className="from-brand-800 to-brand-950 flex flex-col justify-between gap-6 rounded-lg bg-gradient-to-br p-8 text-white">
            <div>
              <span className="text-accent-400 text-xs font-bold tracking-wide uppercase">
                New arrivals
              </span>
              <h3 className="mt-2 text-2xl font-extrabold">
                Just landed across every category.
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Fresh picks, added regularly.
              </p>
            </div>
            <Link href="/category/books">
              <Button variant="primary" className="w-fit">
                See what&apos;s new
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-surface-border bg-surface-muted border-t">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST_BADGES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="bg-brand-900 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-brand-950 text-sm font-bold">{title}</p>
                <p className="text-sm text-zinc-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
