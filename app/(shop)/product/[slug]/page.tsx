"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/types";
import { getProductBySlug, getRelatedProducts } from "@/features/products/api";
import { getCategoryBySlug } from "@/features/products/lib/categories";
import { StarRating } from "@/features/products/components/StarRating";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { ReviewsSection } from "@/features/reviews/components/ReviewsSection";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

// Client-rendered (rather than statically generated) so admin edits made
// through /admin/products — which write to the same localStorage-backed
// product store — show up here immediately in the same browser session.
// This trades away per-product static generation/metadata, an acceptable
// cost given the whole catalog is mock/local-state for now.
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Syncing from the mock product API (an external, async data source),
    // not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProduct(undefined);
    getProductBySlug(slug).then((found) => {
      if (cancelled) return;
      setProduct(found ?? null);
      if (found) {
        getRelatedProducts(found).then((items) => {
          if (!cancelled) setRelated(items);
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (product === undefined) return null;

  if (product === null) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <PackageSearch className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Product not found
        </h1>
        <Link href="/products">
          <Button variant="primary">Back to all products</Button>
        </Link>
      </div>
    );
  }

  const category = getCategoryBySlug(product.category);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-brand-900 hover:underline">
          Home
        </Link>
        {category && (
          <>
            {" / "}
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-brand-900 hover:underline"
            >
              {category.label}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-brand-900">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art, not an optimizable remote asset */}
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.title}
            className="bg-surface-muted aspect-square w-full rounded-lg object-cover"
          />
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art
                <img
                  key={image.url}
                  src={image.url}
                  alt={image.alt}
                  className="bg-surface-muted h-20 w-20 rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
              {product.brand}
            </p>
            <h1 className="text-brand-950 mt-1 text-2xl font-extrabold sm:text-3xl">
              {product.title}
            </h1>
          </div>

          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          <p className="text-brand-950 text-3xl font-bold">
            {formatPrice(product.price, product.currency)}
          </p>

          <p
            className={`text-sm font-semibold ${product.stock > 0 ? "text-secondary-600" : "text-red-600"}`}
          >
            {product.stock > 0
              ? `In stock (${product.stock} available)`
              : "Out of stock"}
          </p>

          <p className="leading-relaxed text-zinc-700">{product.description}</p>

          <div className="flex items-start gap-3 pt-2">
            <AddToCartButton product={product} />
            <WishlistButton productId={product.id} variant="inline" />
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-brand-950 mb-6 text-xl font-extrabold">
            Related products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
