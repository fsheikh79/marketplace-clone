"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { Order } from "@/types";
import { RequireAuth } from "@/features/account/components/RequireAuth";
import { AccountNav } from "@/features/account/components/AccountNav";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { getOrdersByUserId } from "@/features/orders/lib/mockOrderStore";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

function OrderHistoryList({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    // Syncing from localStorage (an external system) on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(getOrdersByUserId(userId));
  }, [userId]);

  if (orders === null) return null;

  if (orders.length === 0) {
    return (
      <div className="border-surface-border mt-6 flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
        <PackageSearch className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        <p className="text-sm text-zinc-600">
          You haven&apos;t placed any orders yet.
        </p>
        <Link href="/">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-4">
      {orders.map((order) => (
        <li
          key={order.id}
          className="border-surface-border rounded-lg border bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-brand-950 text-sm font-semibold">
                Order #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs text-zinc-500">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-2 line-clamp-1 text-sm text-zinc-600">
            {order.items.map((item) => item.title).join(", ")}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-brand-950 text-sm font-bold">
              {formatPrice(order.total, order.currency)}
            </span>
            <Link
              href={`/order-confirmation/${order.id}`}
              className="text-secondary-600 text-sm font-semibold hover:underline"
            >
              View details
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function OrderHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">Account</h1>
      <RequireAuth>
        {(user) => (
          <div>
            <AccountNav />
            <div className="max-w-2xl">
              <OrderHistoryList userId={user.id} />
            </div>
          </div>
        )}
      </RequireAuth>
    </div>
  );
}
