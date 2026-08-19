import type { CartItem, Order } from "@/types";
import type { ShippingFormValues } from "@/features/checkout/lib/validation";

// MOCK: orders persisted to localStorage. Replace with API Gateway/Lambda
// writes to DynamoDB (and real payment capture via Stripe) in Phase 2.

const ORDERS_KEY = "marketplace:mock-orders";

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(
  items: CartItem[],
  shipping: ShippingFormValues,
  userId: string | null,
): Order {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order: Order = {
    id: crypto.randomUUID(),
    userId,
    items: items.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    total,
    currency: "USD",
    status: "processing",
    createdAt: new Date().toISOString(),
    shippingAddress: {
      fullName: shipping.fullName,
      line1: shipping.line1,
      line2: shipping.line2 || undefined,
      city: shipping.city,
      state: shipping.state,
      postalCode: shipping.postalCode,
      country: shipping.country,
      phone: shipping.phone,
    },
  };

  writeOrders([...readOrders(), order]);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((order) => order.id === id);
}
