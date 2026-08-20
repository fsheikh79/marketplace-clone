/**
 * Shared domain types for the marketplace app.
 * Defined up front (even before every feature exists) so later phases
 * never redefine these shapes inconsistently across features.
 */

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: ProductImage[];
  category: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export type OrderStatus =
  "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string | null;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}
