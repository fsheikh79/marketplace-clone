import Link from "next/link";
import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RecentlyViewed } from "@/features/products/components/RecentlyViewed";
import { HeroCarousel } from "@/features/home/components/HeroCarousel";
import { HomeCarousels } from "@/features/home/components/HomeCarousels";
import { CategoryGrid } from "@/features/home/components/CategoryGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

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
      <HeroCarousel />

      {/* Shop by category */}
      <ScrollReveal className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-brand-950 text-2xl font-extrabold tracking-tight">
            Shop by category
          </h2>
        </div>
        <CategoryGrid />
      </ScrollReveal>

      {/* Promo strip */}
      <ScrollReveal className="mx-auto w-full max-w-[1400px] px-4 pb-14 sm:px-6 lg:px-8">
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
            <Link href="/products?category=electronics">
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
            <Link href="/products?category=books">
              <Button variant="primary" className="w-fit">
                See what&apos;s new
              </Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <HomeCarousels />

      <RecentlyViewed />

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
