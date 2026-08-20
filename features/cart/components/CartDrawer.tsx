"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, subtotal, totalItems, isDrawerOpen, closeDrawer } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="border-surface-border flex items-center justify-between border-b p-4">
              <h2 className="text-brand-950 text-lg font-bold">
                Your cart ({totalItems})
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                <ShoppingCart
                  className="h-10 w-10 text-zinc-300"
                  aria-hidden="true"
                />
                <p className="text-sm text-zinc-600">Your cart is empty.</p>
                <Button variant="primary" onClick={closeDrawer}>
                  Continue shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4">
                  {items.map((item) => (
                    <CartItemRow key={item.productId} item={item} />
                  ))}
                </div>
                <div className="border-surface-border border-t p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-zinc-600">
                    <span>Subtotal</span>
                    <span className="text-brand-950 font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/cart" onClick={closeDrawer}>
                      <Button variant="secondary" className="w-full">
                        View cart
                      </Button>
                    </Link>
                    <Link href="/checkout" onClick={closeDrawer}>
                      <Button variant="primary" className="w-full">
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
