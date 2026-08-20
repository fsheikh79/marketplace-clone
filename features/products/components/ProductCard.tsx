"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import type { Product } from "@/types";
import { StarRating } from "@/features/products/components/StarRating";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { ProductBadges } from "@/features/products/components/ProductBadges";
import { getProductBadges } from "@/features/products/lib/productBadges";
import { formatPrice } from "@/lib/format";
import {
  getStockLevel,
  getStockLabel,
  getStockColorClass,
} from "@/features/products/lib/stockStatus";

const MotionLink = motion.create(Link);

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const stockLevel = getStockLevel(product.stock);
  const badges = getProductBadges(product);

  return (
    <MotionLink
      href={`/product/${product.slug}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group border-surface-border focus-visible:outline-brand-500 flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked external photo, not a local optimizable asset */}
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt ?? product.title}
          className="bg-surface-muted aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <ProductBadges product={product} />
        <WishlistButton productId={product.id} />
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-brand-950/85 absolute bottom-0 left-0 flex w-full translate-y-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          {product.brand}
        </p>
        <h3 className="text-brand-950 line-clamp-2 text-sm font-semibold">
          {product.title}
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        {stockLevel !== "in" && (
          <p
            className={`text-xs font-semibold ${getStockColorClass(product.stock)}`}
          >
            {getStockLabel(product.stock)}
          </p>
        )}
        <p className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-brand-950 text-lg font-bold">
            {formatPrice(product.price, product.currency)}
          </span>
          {badges.isOnSale && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(badges.compareAtPrice, product.currency)}
            </span>
          )}
        </p>
      </div>
    </MotionLink>
  );
}
