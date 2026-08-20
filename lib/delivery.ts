export const FREE_DELIVERY_THRESHOLD = 50;
export const STANDARD_DELIVERY_FEE = 4.99;

export function getDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
}

/** Adds `days` business days (Mon–Fri) to `from`, skipping weekends. */
function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining -= 1;
    }
  }
  return result;
}

export function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/** Returns a "Get it by [date]" estimate 3–5 business days from today. */
export function getDeliveryEstimate(from: Date = new Date()): {
  earliest: Date;
  latest: Date;
  label: string;
} {
  const earliest = addBusinessDays(from, 3);
  const latest = addBusinessDays(from, 5);
  return {
    earliest,
    latest,
    label: `Get it by ${formatDeliveryDate(latest)}`,
  };
}
