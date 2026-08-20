"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useCart } from "@/features/cart/context/CartContext";
import { useToast } from "@/features/toast/context/ToastContext";
import { getProductsByIds } from "@/features/products/api";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/features/products/components/StarRating";
import { formatPrice } from "@/lib/format";

function WishlistItems() {
  const { productIds, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    // Syncing from the mock product API (an external, async data source),
    // not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(null);
    getProductsByIds(productIds).then(setProducts);
  }, [productIds]);

  if (products === null) return null;

  if (products.length === 0) {
    return (
      <div className="border-surface-border mt-6 flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
        <Heart className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        <p className="text-sm text-zinc-600">Your wishlist is empty.</p>
        <Link href="/">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-4">
      {products.map((product) => (
        <li
          key={product.id}
          className="border-surface-border flex gap-4 rounded-lg border bg-white p-4"
        >
          <Link href={`/product/${product.slug}`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art */}
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt ?? product.title}
              className="bg-surface-muted h-24 w-24 rounded-md object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link
                href={`/product/${product.slug}`}
                className="text-brand-950 text-sm font-semibold hover:underline"
              >
                {product.title}
              </Link>
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
              <p className="text-brand-950 mt-1 text-sm font-bold">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  addItem(product, 1);
                  toggle(product.id);
                  showToast(`Moved ${product.title} to your cart`);
                }}
                disabled={product.stock === 0}
                className="h-9 px-4 text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? "Out of stock" : "Move to cart"}
              </Button>
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function WishlistPage() {
  const { currentUser, isLoading } = useAuth();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">
        Your wishlist
      </h1>

      {isLoading ? null : !currentUser ? (
        <div className="border-surface-border flex flex-col items-center gap-3 rounded-lg border bg-white py-16 text-center">
          <Heart className="h-10 w-10 text-zinc-300" aria-hidden="true" />
          <p className="text-sm text-zinc-600">
            Sign in to save and view your wishlist.
          </p>
          <Link href="/login">
            <Button variant="primary">Sign in</Button>
          </Link>
        </div>
      ) : (
        <WishlistItems />
      )}
    </div>
  );
}
