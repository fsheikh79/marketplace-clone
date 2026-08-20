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
import { CheckoutSteps } from "@/features/checkout/components/CheckoutSteps";
import { PaymentPlaceholder } from "@/features/checkout/components/PaymentPlaceholder";
import { hasErrors } from "@/features/auth/lib/validation";
import { createOrder } from "@/features/orders/lib/mockOrderStore";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const form = useShippingForm();
  const [step, setStep] = useState<Step>(1);
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

  function handleContinueToReview() {
    form.touchAll();
    if (hasErrors(form.errors)) return;
    setStep(2);
  }

  function handlePlaceOrder() {
    setIsPlacingOrder(true);
    // MOCK: instant local order creation, no payment dependency yet.
    // Replace with a real checkout API call (Stripe payment capture + order
    // write) in Phase 2.
    const order = createOrder(items, form.values, currentUser?.id ?? null);
    clearCart();
    router.push(`/order-confirmation/${order.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-2 text-2xl font-extrabold">Checkout</h1>

      {!currentUser && (
        <div className="border-secondary-500/30 bg-secondary-500/5 text-secondary-600 mb-6 rounded-md border px-4 py-3 text-sm">
          Checking out as a guest.{" "}
          <Link href="/login" className="font-semibold hover:underline">
            Sign in
          </Link>{" "}
          to save this address for next time.
        </div>
      )}

      <CheckoutSteps current={step} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="border-surface-border rounded-lg border bg-white p-6 lg:col-span-2">
          {step === 1 && (
            <>
              <h2 className="text-brand-950 mb-4 text-lg font-bold">
                Shipping address
              </h2>
              <ShippingForm form={form} />
              <Button
                variant="primary"
                className="mt-6 w-full sm:w-auto"
                onClick={handleContinueToReview}
              >
                Continue to review
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-brand-950 text-lg font-bold">
                  Review your order
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-secondary-600 text-sm font-semibold hover:underline"
                >
                  Edit shipping
                </button>
              </div>
              <address className="mb-6 text-sm text-zinc-600 not-italic">
                {form.values.fullName}
                <br />
                {form.values.line1}
                {form.values.line2 && (
                  <>
                    <br />
                    {form.values.line2}
                  </>
                )}
                <br />
                {form.values.city}, {form.values.state} {form.values.postalCode}
                <br />
                {form.values.country}
                <br />
                {form.values.phone}
              </address>
              <ul className="mb-6 flex flex-col gap-2 text-sm text-zinc-600">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between gap-2"
                  >
                    <span className="line-clamp-1">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="text-brand-950 shrink-0 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  Continue to payment
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-brand-950 mb-4 text-lg font-bold">Payment</h2>
              <PaymentPlaceholder />
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  isLoading={isPlacingOrder}
                >
                  Place order
                </Button>
              </div>
            </>
          )}
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
        </div>
      </div>
    </div>
  );
}
