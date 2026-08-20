"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import type { Order } from "@/types";
import { getOrderById } from "@/features/orders/lib/mockOrderStore";
import {
  TRACKING_STEPS,
  getStepsReached,
  getStepDate,
} from "@/features/orders/lib/orderTracking";
import { Button } from "@/components/ui/Button";
import { formatDeliveryDate } from "@/lib/delivery";

export default function OrderTrackingPage({
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
        <Link href="/">
          <Button variant="primary">Back to home</Button>
        </Link>
      </div>
    );
  }

  const stepsReached = getStepsReached(order.status);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <h1 className="text-brand-950 text-2xl font-extrabold">Track order</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Order ID: <span className="font-mono">{order.id}</span>
      </p>

      <div className="border-surface-border mt-8 rounded-lg border bg-white p-6">
        {order.status === "cancelled" ? (
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="h-6 w-6" />
            <p className="font-semibold">This order was cancelled.</p>
          </div>
        ) : (
          <ol className="flex flex-col gap-0">
            {TRACKING_STEPS.map((step, index) => {
              const isReached = index < stepsReached;
              const isCurrent = index === stepsReached - 1;
              const date = getStepDate(order.createdAt, step);
              return (
                <li key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {isReached ? (
                      <CheckCircle2 className="text-secondary-600 h-6 w-6 shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-zinc-300" />
                    )}
                    {index < TRACKING_STEPS.length - 1 && (
                      <span
                        className={`my-1 h-10 w-0.5 ${isReached ? "bg-secondary-600" : "bg-zinc-200"}`}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p
                      className={`text-sm font-bold ${
                        isReached ? "text-brand-950" : "text-zinc-400"
                      } ${isCurrent ? "underline decoration-2 underline-offset-4" : ""}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {isReached ? "" : "Estimated "}
                      {formatDeliveryDate(date)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button variant="secondary">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
