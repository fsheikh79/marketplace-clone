"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ClipboardList,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import type { OrderStatus } from "@/types";
import { listProducts } from "@/features/products/lib/productStore";
import { getAllOrders } from "@/features/orders/lib/mockOrderStore";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { StatCard } from "@/features/admin/components/StatCard";

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Clock,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalOrders: number;
    byStatus: Record<OrderStatus, number>;
  } | null>(null);

  useEffect(() => {
    const orders = getAllOrders();
    const byStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );
    // Syncing from the mock local data stores on mount, not derived render
    // state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats({
      totalProducts: listProducts().length,
      totalOrders: orders.length,
      byStatus,
    });
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="At-a-glance overview of the mock catalog and orders."
      />
      <div className="flex-1 p-6">
        {stats && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total products"
                value={stats.totalProducts}
                icon={Package}
              />
              <StatCard
                label="Total orders"
                value={stats.totalOrders}
                icon={ClipboardList}
              />
              {(["pending", "processing"] as OrderStatus[]).map((status) => (
                <StatCard
                  key={status}
                  label={`${STATUS_LABELS[status]} orders`}
                  value={stats.byStatus[status] ?? 0}
                  icon={STATUS_ICONS[status]}
                />
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-bold tracking-wide text-zinc-900 uppercase">
                Orders by status
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {(
                  [
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                  ] as OrderStatus[]
                ).map((status) => (
                  <div key={status} className="text-center">
                    <p className="text-2xl font-bold text-zinc-900">
                      {stats.byStatus[status] ?? 0}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {STATUS_LABELS[status]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
