import Link from "next/link";
import type { Product } from "@/types";
import { StarRating } from "@/features/products/components/StarRating";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group border-surface-border focus-visible:outline-brand-500 flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art, not an optimizable remote asset */}
      <img
        src={product.images[0]?.url}
        alt={product.images[0]?.alt ?? product.title}
        className="bg-surface-muted aspect-square w-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          {product.brand}
        </p>
        <h3 className="text-brand-950 line-clamp-2 text-sm font-semibold">
          {product.title}
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="text-brand-950 mt-auto pt-2 text-lg font-bold">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
