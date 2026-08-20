"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { QuickViewModal } from "@/features/products/components/QuickViewModal";
import { Button } from "@/components/ui/Button";
import {
  staggerContainer,
  staggerItem,
} from "@/components/motion/ScrollReveal";

export function ProductGrid({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );

  if (products.length === 0) {
    return (
      <div className="border-surface-border flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
        <PackageSearch className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        <p className="text-sm text-zinc-600">
          No products found in this category yet.
        </p>
        <Link href="/products">
          <Button variant="primary">Browse all products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={staggerItem}>
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </motion.div>
        ))}
      </motion.div>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
