"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { QuickViewModal } from "@/features/products/components/QuickViewModal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const SCROLL_AMOUNT = 640;

export function ProductCarouselRow({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  if (products.length === 0) return null;

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <ScrollReveal className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="group/carousel relative">
        <h2 className="text-brand-950 mb-4 text-xl font-extrabold">{title}</h2>

        <div
          ref={scrollerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {products.map((product) => (
            <div key={product.id} className="w-44 shrink-0 sm:w-52">
              <ProductCard
                product={product}
                onQuickView={setQuickViewProduct}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(-SCROLL_AMOUNT)}
          aria-label={`Scroll ${title} left`}
          className="border-surface-border absolute top-1/2 -left-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(SCROLL_AMOUNT)}
          aria-label={`Scroll ${title} right`}
          className="border-surface-border absolute top-1/2 -right-3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white opacity-0 shadow-md transition-opacity group-hover/carousel:opacity-100 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </ScrollReveal>
  );
}
