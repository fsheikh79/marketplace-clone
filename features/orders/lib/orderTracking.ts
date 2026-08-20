import type { OrderStatus } from "@/types";

export interface TrackingStep {
  label: string;
  /** Days after order creation this step is expected to happen. */
  offsetDays: number;
}

export const TRACKING_STEPS: TrackingStep[] = [
  { label: "Order placed", offsetDays: 0 },
  { label: "Processing", offsetDays: 1 },
  { label: "Shipped", offsetDays: 2 },
  { label: "Out for delivery", offsetDays: 4 },
  { label: "Delivered", offsetDays: 5 },
];

// The order status stored on an Order (pending/processing/shipped/
// delivered/cancelled) is coarser than the 5-step customer-facing tracking
// timeline the UI shows, so this maps status -> "how many of the 5 steps
// have been reached." "Out for delivery" isn't a real order status in this
// app — it's treated as reached once the order has been delivered.
const STEPS_REACHED: Record<OrderStatus, number> = {
  pending: 1,
  processing: 2,
  shipped: 3,
  delivered: 5,
  cancelled: 0,
};

export function getStepsReached(status: OrderStatus): number {
  return STEPS_REACHED[status];
}

export function getStepDate(createdAt: string, step: TrackingStep): Date {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + step.offsetDays);
  return date;
}
