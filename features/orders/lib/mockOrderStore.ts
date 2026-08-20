import type { CartItem, Order, OrderStatus } from "@/types";
import type { ShippingFormValues } from "@/features/checkout/lib/validation";

// MOCK: orders persisted to localStorage, seeded with a handful of
// realistic historical orders so the admin table isn't empty on first
// load. Replace with API Gateway/Lambda writes to DynamoDB (and real
// payment capture via Stripe) in Phase 2.

const ORDERS_KEY = "marketplace:mock-orders";

const SEED_ORDERS: Order[] = [
  {
    id: "seed-order-1",
    userId: null,
    items: [
      {
        productId: "aurora-wireless-noise-cancelling-headphones",
        title: "Aurora Wireless Noise-Cancelling Headphones",
        price: 149.99,
        quantity: 1,
      },
    ],
    total: 149.99,
    currency: "USD",
    status: "delivered",
    createdAt: "2026-01-15T14:22:00.000Z",
    shippingAddress: {
      fullName: "Morgan Ellis",
      line1: "48 Birchwood Ave",
      city: "Portland",
      state: "OR",
      postalCode: "97205",
      country: "United States",
      phone: "503-555-0142",
    },
  },
  {
    id: "seed-order-2",
    userId: null,
    items: [
      {
        productId: "crispgo-air-fryer-6-quart",
        title: "Crispgo 6-Quart Digital Air Fryer",
        price: 89.99,
        quantity: 1,
      },
      {
        productId: "brewhaven-programmable-coffee-maker",
        title: "Brewhaven Programmable Coffee Maker",
        price: 79.0,
        quantity: 1,
      },
    ],
    total: 168.99,
    currency: "USD",
    status: "shipped",
    createdAt: "2026-02-03T09:10:00.000Z",
    shippingAddress: {
      fullName: "Devon Park",
      line1: "1120 Cedar St, Apt 4B",
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "United States",
      phone: "512-555-0177",
    },
  },
  {
    id: "seed-order-3",
    userId: null,
    items: [
      {
        productId: "swiftstride-trail-running-shoes",
        title: "Swiftstride Trail Running Shoes",
        price: 94.99,
        quantity: 2,
      },
    ],
    total: 189.98,
    currency: "USD",
    status: "processing",
    createdAt: "2026-02-20T18:45:00.000Z",
    shippingAddress: {
      fullName: "Riley Chen",
      line1: "77 Lakeshore Dr",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
      phone: "312-555-0193",
    },
  },
  {
    id: "seed-order-4",
    userId: null,
    items: [
      {
        productId: "bookhaven-modern-cloud-architecture",
        title: "Modern Cloud Architecture",
        price: 34.99,
        quantity: 1,
      },
      {
        productId: "bookhaven-deep-work-principles",
        title: "Deep Work Principles",
        price: 16.99,
        quantity: 1,
      },
    ],
    total: 51.98,
    currency: "USD",
    status: "pending",
    createdAt: "2026-03-01T11:05:00.000Z",
    shippingAddress: {
      fullName: "Sam Okafor",
      line1: "902 Maple Ct",
      city: "Denver",
      state: "CO",
      postalCode: "80202",
      country: "United States",
      phone: "720-555-0165",
    },
  },
  {
    id: "seed-order-5",
    userId: null,
    items: [
      {
        productId: "lumen-65-inch-4k-smart-tv",
        title: 'Lumen 65" 4K Smart TV',
        price: 549.0,
        quantity: 1,
      },
    ],
    total: 549.0,
    currency: "USD",
    status: "cancelled",
    createdAt: "2026-01-28T16:30:00.000Z",
    shippingAddress: {
      fullName: "Taylor Brooks",
      line1: "233 Ocean View Blvd",
      city: "San Diego",
      state: "CA",
      postalCode: "92101",
      country: "United States",
      phone: "619-555-0128",
    },
  },
];

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ORDERS_KEY);
  if (!raw) {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  }
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

export function getAllOrders(): Order[] {
  return [...readOrders()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | undefined {
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return undefined;

  const updated: Order = { ...orders[index], status };
  const next = [...orders];
  next[index] = updated;
  writeOrders(next);
  return updated;
}
