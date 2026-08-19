"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";

export function WishlistButton({
  productId,
  variant = "overlay",
}: {
  productId: string;
  variant?: "overlay" | "inline";
}) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  const baseClasses =
    variant === "overlay"
      ? "absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
      : "flex h-11 w-11 items-center justify-center rounded-md border border-surface-border hover:bg-surface-muted";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={baseClasses}
    >
      <Heart
        className={`h-5 w-5 ${saved ? "text-red-500" : "text-zinc-500"}`}
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}
