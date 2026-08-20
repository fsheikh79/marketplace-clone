"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@/types";
import { getOrderById } from "@/features/orders/lib/mockOrderStore";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // Syncing from localStorage (an external system) on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(getOrderById(orderId) ?? null);
  }, [orderId]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Order not found
        </h1>
        <p className="max-w-sm text-zinc-600">
          We couldn&apos;t find that order. It may have been cleared from this
          browser&apos;s local storage.
        </p>
        <Link href="/">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="text-secondary-600 h-14 w-14" />
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Order confirmed
        </h1>
        <p className="text-zinc-600">
          Thanks
          {order.shippingAddress.fullName
            ? `, ${order.shippingAddress.fullName.split(" ")[0]}`
            : ""}
          ! Your order has been placed.
        </p>
        <p className="text-sm text-zinc-500">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
      </div>

      <div className="border-surface-border mt-10 rounded-lg border bg-white p-6">
        <h2 className="text-brand-950 mb-4 text-sm font-bold tracking-wide uppercase">
          Items
        </h2>
        <ul className="flex flex-col gap-2 text-sm text-zinc-600">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-2">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="text-brand-950 font-medium">
                {formatPrice(item.price * item.quantity, order.currency)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-surface-border text-brand-950 mt-4 flex justify-between border-t pt-4 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total, order.currency)}</span>
        </div>

        <h2 className="text-brand-950 mt-6 mb-2 text-sm font-bold tracking-wide uppercase">
          Shipping to
        </h2>
        <address className="text-sm text-zinc-600 not-italic">
          {order.shippingAddress.fullName}
          <br />
          {order.shippingAddress.line1}
          {order.shippingAddress.line2 && (
            <>
              <br />
              {order.shippingAddress.line2}
            </>
          )}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
          <br />
          {order.shippingAddress.phone}
        </address>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button variant="secondary">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
