import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductListing } from "@/features/products/components/ProductListing";
import { ProductGridSkeleton } from "@/features/products/components/ProductCardSkeleton";

export const metadata: Metadata = { title: "All Products — marketplace" };

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ProductListing />
    </Suspense>
  );
}
