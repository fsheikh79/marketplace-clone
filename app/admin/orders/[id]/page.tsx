"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/types";
import {
  getOrderById,
  updateOrderStatus,
} from "@/features/orders/lib/mockOrderStore";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { useToast } from "@/features/toast/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // Syncing from the mock order store on mount, not derived render
    // state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(getOrderById(id) ?? null);
  }, [id]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <div className="flex-1 p-6">
        <p className="text-sm text-zinc-600">Order not found.</p>
        <Link href="/admin/orders">
          <Button variant="secondary" className="mt-4">
            Back to orders
          </Button>
        </Link>
      </div>
    );
  }

  function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    // MOCK: instant local status update. Replace with an API Gateway/
    // Lambda PATCH to DynamoDB in Phase 2.
    const updated = updateOrderStatus(order.id, status);
    if (updated) setOrder(updated);
    showToast(`Order marked ${status}`);
  }

  return (
    <>
      <AdminPageHeader title={`Order #${order.id}`} />
      <div className="flex-1 p-6">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          &larr; Back to orders
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 lg:col-span-2">
            <h2 className="mb-4 text-sm font-bold tracking-wide text-zinc-900 uppercase">
              Line items
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-zinc-600">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span>
                    {item.title} &times; {item.quantity}
                  </span>
                  <span className="font-medium text-zinc-900">
                    {formatPrice(item.price * item.quantity, order.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1.5 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {order.deliveryFee === 0
                    ? "FREE"
                    : formatPrice(order.deliveryFee, order.currency)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>
                    Discount{" "}
                    {order.discountCode ? `(${order.discountCode})` : ""}
                  </span>
                  <span>
                    -{formatPrice(order.discountAmount, order.currency)}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-between border-t border-zinc-200 pt-4 text-base font-bold text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>

            <h2 className="mt-6 mb-2 text-sm font-bold tracking-wide text-zinc-900 uppercase">
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

          <div className="h-fit rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-bold tracking-wide text-zinc-900 uppercase">
              Status
            </h2>
            <OrderStatusBadge status={order.status} />
            <div className="mt-4 flex flex-col gap-2">
              {STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={status === order.status ? "primary" : "secondary"}
                  onClick={() => handleStatusChange(status)}
                  className="h-9 justify-start px-3 text-sm capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
