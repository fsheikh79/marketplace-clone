"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";

export function WishlistLink() {
  const { productIds } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="focus-visible:outline-accent-500 relative hidden h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex"
      aria-label={`Wishlist, ${productIds.length} item${productIds.length === 1 ? "" : "s"}`}
    >
      <Heart className="h-6 w-6" aria-hidden="true" />
      {productIds.length > 0 && (
        <span className="bg-accent-500 text-brand-950 absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
          {productIds.length > 99 ? "99+" : productIds.length}
        </span>
      )}
    </Link>
  );
}
