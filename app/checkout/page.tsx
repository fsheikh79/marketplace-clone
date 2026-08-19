"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  ShippingForm,
  useShippingForm,
} from "@/features/checkout/components/ShippingForm";
import { hasErrors } from "@/features/auth/lib/validation";
import { createOrder } from "@/features/orders/lib/mockOrderStore";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const form = useShippingForm();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Your cart is empty
        </h1>
        <p className="max-w-sm text-zinc-600">
          Add something to your cart before checking out.
        </p>
        <Link href="/">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  function handlePlaceOrder() {
    form.touchAll();
    if (hasErrors(form.errors)) return;

    setIsPlacingOrder(true);
    // MOCK: instant local order creation. Replace with a real checkout API
    // call (payment capture + order write) in Phase 2.
    const order = createOrder(items, form.values, currentUser?.id ?? null);
    clearCart();
    router.push(`/order-confirmation/${order.id}?placed=1`);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">Checkout</h1>

      {!currentUser && (
        <div className="border-secondary-500/30 bg-secondary-500/5 text-secondary-600 mb-6 rounded-md border px-4 py-3 text-sm">
          Checking out as a guest.{" "}
          <Link href="/login" className="font-semibold hover:underline">
            Sign in
          </Link>{" "}
          to save this address for next time.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="border-surface-border rounded-lg border bg-white p-6 lg:col-span-2">
          <h2 className="text-brand-950 mb-4 text-lg font-bold">
            Shipping address
          </h2>
          <ShippingForm form={form} />
        </div>

        <div className="border-surface-border h-fit rounded-lg border bg-white p-6">
          <h2 className="text-brand-950 mb-4 text-lg font-bold">
            Order summary
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-zinc-600">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="line-clamp-1">
                  {item.title} × {item.quantity}
                </span>
                <span className="text-brand-950 shrink-0 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-surface-border text-brand-950 mt-4 flex items-center justify-between border-t pt-4 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={handlePlaceOrder}
            isLoading={isPlacingOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
}
