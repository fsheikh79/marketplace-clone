"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/features/toast/context/ToastContext";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    setIsAdding(true);
    // MOCK: a brief delay standing in for a real add-to-cart API call, so
    // the disabled/loading state is meaningful rather than instantaneous.
    window.setTimeout(() => {
      addItem(product, quantity);
      showToast(`Added ${quantity} × ${product.title} to your cart`);
      setIsAdding(false);
    }, 400);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-brand-900 text-sm font-medium">Quantity</span>
        <div className="border-surface-border flex items-center rounded-md border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isAdding}
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
            disabled={quantity >= product.stock || isAdding}
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
        disabled={outOfStock || isAdding}
        isLoading={isAdding}
        className="w-full sm:w-64"
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  );
}
