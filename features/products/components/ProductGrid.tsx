"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { QuickViewModal } from "@/features/products/components/QuickViewModal";

export function ProductGrid({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">
        No products found in this category yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
