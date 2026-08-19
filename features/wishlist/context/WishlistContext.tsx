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

// MOCK: wishlist persisted to localStorage as a list of product IDs.
// Replace with a DynamoDB-backed wishlist (synced via API Gateway/Lambda)
// in Phase 2 — the public interface below (productIds, toggle, isSaved) is
// the seam a real implementation slots into.
//
// This context intentionally knows nothing about auth — whether wishlist
// actions require a signed-in user is a UI-layer decision made by the
// components that consume both useAuth() and useWishlist() together (see
// WishlistButton), keeping the contexts themselves decoupled.

const WISHLIST_KEY = "marketplace:mock-wishlist";

export interface WishlistContextValue {
  productIds: string[];
  toggle: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(WISHLIST_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Syncing from localStorage (an external system) on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProductIds(readWishlist());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(productIds));
  }, [productIds, isHydrated]);

  const toggle = useCallback((productId: string) => {
    setProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isSaved = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ productIds, toggle, isSaved }),
    [productIds, toggle, isSaved],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
