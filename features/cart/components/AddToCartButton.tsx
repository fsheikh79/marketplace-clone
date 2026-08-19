"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/features/cart/context/CartContext";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    addItem(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-brand-900 text-sm font-medium">Quantity</span>
        <div className="border-surface-border flex items-center rounded-md border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="text-brand-900 flex h-9 w-9 items-center justify-center disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="w-8 text-center text-sm font-semibold"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="text-brand-900 flex h-9 w-9 items-center justify-center disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className="w-full sm:w-64"
      >
        {justAdded ? (
          <>
            <Check className="h-4 w-4" /> Added to cart
          </>
        ) : outOfStock ? (
          "Out of stock"
        ) : (
          "Add to cart"
        )}
      </Button>
    </div>
  );
}
