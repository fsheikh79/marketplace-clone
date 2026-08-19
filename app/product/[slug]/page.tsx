import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/lib/mockProducts";
import { getCategoryBySlug } from "@/features/products/lib/categories";
import { StarRating } from "@/features/products/components/StarRating";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { ReviewsSection } from "@/features/reviews/components/ReviewsSection";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.title} — marketplace` : "Product not found",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product);

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
              href={`/category/${category.slug}`}
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

          <div className="pt-2">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-brand-950 mb-6 text-xl font-extrabold">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
