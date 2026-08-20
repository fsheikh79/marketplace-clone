"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getProductsByIds } from "@/features/products/api";
import { getRecentlyViewedIds } from "@/features/products/lib/recentlyViewedStore";
import { ProductCard } from "@/features/products/components/ProductCard";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    const ids = getRecentlyViewedIds().filter((id) => id !== excludeId);
    if (ids.length === 0) return;
    getProductsByIds(ids).then((items) => {
      if (cancelled) return;
      // Preserve most-recent-first order — getProductsByIds doesn't
      // guarantee it since it looks products up one at a time.
      const byId = new Map(items.map((item) => [item.id, item]));

      setProducts(
        ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p)),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-brand-950 mb-6 text-xl font-extrabold">
        Recently viewed
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((product) => (
          <div key={product.id} className="w-44 shrink-0 sm:w-52">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
