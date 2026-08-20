"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import {
  getDeliveryFee,
  getDeliveryEstimate,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/delivery";
import { demoDelay } from "@/lib/demoDelay";

function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-surface-muted mb-6 h-8 w-48 animate-pulse rounded" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="border-surface-border flex flex-col gap-4 rounded-lg border bg-white p-5 lg:col-span-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="bg-surface-muted h-24 w-full animate-pulse rounded-md"
            />
          ))}
        </div>
        <div className="bg-surface-muted h-40 w-full animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, subtotal, totalItems } = useCart();
  const deliveryFee = getDeliveryFee(subtotal);
  const estimate = getDeliveryEstimate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // DEMO: artificial delay to showcase skeleton loading — remove in
    // production. Cart hydration from localStorage is otherwise instant.
    demoDelay().then(() => setIsLoading(false));
  }, []);

  if (isLoading) return <CartSkeleton />;

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
          <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
            <span>Delivery</span>
            <span
              className={
                deliveryFee === 0
                  ? "text-secondary-600 font-semibold"
                  : "text-brand-950 font-semibold"
              }
            >
              {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
            </span>
          </div>
          {deliveryFee > 0 && (
            <p className="mt-1 text-xs text-zinc-500">
              Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for
              free delivery.
            </p>
          )}
          <div className="border-surface-border mt-3 flex items-start gap-2 border-t pt-3 text-xs text-zinc-500">
            <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{estimate.label} if you check out today.</span>
          </div>
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
