"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingCart className="h-12 w-12 text-zinc-300" aria-hidden="true" />
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Your cart is empty
        </h1>
        <p className="max-w-sm text-zinc-600">
          Looks like you haven&apos;t added anything yet. Start browsing to find
          something you&apos;ll love.
        </p>
        <Link href="/">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">
        Your cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="border-surface-border rounded-lg border bg-white px-5 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>

        <div className="border-surface-border h-fit rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between text-sm text-zinc-600">
            <span>
              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
            <span className="text-brand-950 font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Shipping and taxes calculated at checkout.
          </p>
          <Link href="/checkout" className="mt-4 block">
            <Button variant="primary" className="w-full">
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
