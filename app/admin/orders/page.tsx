"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/features/orders/lib/mockOrderStore";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { useToast } from "@/features/toast/context/ToastContext";
import { formatPrice } from "@/lib/format";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  function refresh() {
    setOrders(getAllOrders());
  }

  useEffect(() => {
    // Syncing from the mock order store on mount, not derived render
    // state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return statusFilter
      ? orders.filter((order) => order.status === statusFilter)
      : orders;
  }, [orders, statusFilter]);

  function handleStatusChange(order: Order, status: OrderStatus) {
    // MOCK: instant local status update. Replace with an API Gateway/
    // Lambda PATCH to DynamoDB in Phase 2.
    updateOrderStatus(order.id, status);
    showToast(`Order #${order.id.slice(0, 8)} marked ${status}`);
    refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description="Includes orders placed at checkout plus seeded history."
      />

      <div className="flex-1 p-6">
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-zinc-900">
                    {order.shippingAddress.fullName}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <select
                        aria-label={`Update status for order ${order.id}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order,
                            e.target.value as OrderStatus,
                          )
                        }
                        className="h-8 rounded-md border border-zinc-300 px-2 text-xs text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-500"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      aria-label={`View order ${order.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders !== null && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No orders match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
