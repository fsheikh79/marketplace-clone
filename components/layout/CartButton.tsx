"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";

export function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="focus-visible:outline-accent-500 relative flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
    >
      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
      {totalItems > 0 && (
        <span className="bg-accent-500 text-brand-950 absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
