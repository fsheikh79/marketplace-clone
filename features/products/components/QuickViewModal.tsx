"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/features/products/components/StarRating";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/lib/format";
import {
  getStockLabel,
  getStockColorClass,
} from "@/features/products/lib/stockStatus";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem, openDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    addItem(product, quantity);
    onClose();
    openDrawer();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked external photo, not a local optimizable asset */}
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.title}
            className="bg-surface-muted aspect-square w-full rounded-lg object-cover"
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              {product.brand}
            </p>
            <h2 className="text-brand-950 text-lg font-extrabold">
              {product.title}
            </h2>
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
            <p className="text-brand-950 text-2xl font-bold">
              {formatPrice(product.price, product.currency)}
            </p>
            <p
              className={`text-sm font-semibold ${getStockColorClass(product.stock)}`}
            >
              {getStockLabel(product.stock)}
            </p>
            <p className="line-clamp-3 text-sm text-zinc-600">
              {product.description}
            </p>

            <div className="mt-2 flex items-center gap-2">
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
                <span className="w-8 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="text-brand-900 flex h-9 w-9 items-center justify-center disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock}
                className="flex-1"
              >
                {outOfStock ? "Out of stock" : "Add to cart"}
              </Button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="text-secondary-600 mt-1 text-sm font-semibold hover:underline"
              onClick={onClose}
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
