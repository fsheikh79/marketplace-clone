"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { RequireAuth } from "@/features/account/components/RequireAuth";
import { AccountNav } from "@/features/account/components/AccountNav";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { getProductById } from "@/features/products/lib/mockProducts";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

function WishlistGrid() {
  const { productIds } = useWishlist();
  const products = productIds
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));

  if (products.length === 0) {
    return (
      <div className="border-surface-border mt-6 flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
        <Heart className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        <p className="text-sm text-zinc-600">Your wishlist is empty.</p>
        <Link href="/">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <ProductGrid products={products} />
    </div>
  );
}

export default function WishlistPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">Account</h1>
      <RequireAuth>
        {() => (
          <div>
            <AccountNav />
            <WishlistGrid />
          </div>
        )}
      </RequireAuth>
    </div>
  );
}
