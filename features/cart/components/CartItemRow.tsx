"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/lib/format";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="border-surface-border flex gap-4 border-b py-5 last:border-b-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art */}
      <img
        src={item.imageUrl}
        alt=""
        className="bg-surface-muted h-24 w-24 shrink-0 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <p className="text-brand-950 text-sm font-semibold">{item.title}</p>
          <p className="text-brand-950 text-sm font-bold whitespace-nowrap">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="border-surface-border flex items-center rounded-md border">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="text-brand-900 flex h-8 w-8 items-center justify-center"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="w-7 text-center text-sm font-semibold"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
              className="text-brand-900 flex h-8 w-8 items-center justify-center"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
