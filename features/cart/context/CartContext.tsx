"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types";

// MOCK: cart persisted to localStorage. Replace with a DynamoDB-backed cart
// (synced via API Gateway/Lambda) in Phase 2 — the public interface below
// (items, addItem, removeItem, updateQuantity, clearCart, totalItems,
// subtotal) is the seam a real implementation slots into.

const CART_KEY = "marketplace:mock-cart";

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  addItems: (items: CartItem[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Syncing from localStorage (an external system) on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
          imageUrl: product.images[0]?.url,
        },
      ];
    });
  }, []);

  const addItems = useCallback((newItems: CartItem[]) => {
    setItems((prev) => {
      const next = [...prev];
      for (const newItem of newItems) {
        const existingIndex = next.findIndex(
          (item) => item.productId === newItem.productId,
        );
        if (existingIndex === -1) {
          next.push(newItem);
        } else {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + newItem.quantity,
          };
        }
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      addItems,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    }),
    [
      items,
      addItem,
      addItems,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
