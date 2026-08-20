"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { Order } from "@/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/features/toast/context/ToastContext";
import { getAllOrders } from "@/features/orders/lib/mockOrderStore";
import { findProductById } from "@/features/products/lib/productStore";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { demoDelay } from "@/lib/demoDelay";

function OrderHistorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="border-surface-border h-40 animate-pulse rounded-lg border bg-white"
        />
      ))}
    </div>
  );
}

export default function OrderHistoryPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { addItems } = useCart();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    // DEMO: artificial delay to showcase skeleton loading — remove in
    // production. This read is instant (localStorage) otherwise.
    demoDelay().then(() => {
      if (cancelled) return;
      const mine = getAllOrders().filter(
        (order) => order.userId === currentUser.id,
      );

      setOrders(mine);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  function handleBuyAgain(order: Order) {
    const items = order.items.map((item) => {
      const product = findProductById(item.productId);
      return {
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        imageUrl: product?.images[0]?.url,
      };
    });
    addItems(items);
    showToast("Items added to your cart");
  }

  if (isAuthLoading) return null;

  if (!currentUser) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Sign in to view your orders
        </h1>
        <Link href="/login">
          <Button variant="primary">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">
        Your orders
      </h1>

      {orders === null ? (
        <OrderHistorySkeleton />
      ) : orders.length === 0 ? (
        <div className="border-surface-border flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
          <PackageSearch
            className="h-10 w-10 text-zinc-300"
            aria-hidden="true"
          />
          <p className="text-sm text-zinc-600">
            You haven&apos;t placed any orders with this account yet.
          </p>
          <Link href="/products">
            <Button variant="primary">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-surface-border rounded-lg border bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-brand-950 text-sm font-bold">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-zinc-600">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between gap-2"
                  >
                    <span className="line-clamp-1">
                      {item.title} × {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-surface-border mt-3 flex items-center justify-between border-t pt-3">
                <p className="text-brand-950 text-sm font-bold">
                  {formatPrice(order.total, order.currency)}
                </p>
                <div className="flex gap-2">
                  <Link href={`/orders/${order.id}/track`}>
                    <Button variant="secondary" className="h-9 px-3 text-sm">
                      Track order
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    className="h-9 px-3 text-sm"
                    onClick={() => handleBuyAgain(order)}
                  >
                    Buy again
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
