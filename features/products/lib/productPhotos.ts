import type { ProductImage } from "@/types";

/**
 * Real product photography, hotlinked from Lorem Picsum
 * (https://picsum.photos) rather than Unsplash: this sandbox's outbound
 * network policy blocks images.unsplash.com, so exact Unsplash photo IDs
 * couldn't be verified before shipping, and a portfolio demo with broken
 * image links is worse than one with the "wrong" real-photo source. Picsum
 * URLs are seeded (deterministic, same seed always returns the same photo)
 * so the catalog looks stable across reloads. Swapping to curated Unsplash
 * URLs later is a one-function change — this is the only place that
 * generates a product photo URL.
 */
const IMAGE_SIZE = 800;
const IMAGES_PER_PRODUCT = 4;

function photoUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${IMAGE_SIZE}/${IMAGE_SIZE}`;
}

export function productImages(slug: string, title: string): ProductImage[] {
  return Array.from({ length: IMAGES_PER_PRODUCT }, (_, index) => ({
    url: photoUrl(`${slug}-${index}`),
    alt: index === 0 ? title : `${title} — view ${index + 1}`,
  }));
}

export function singleProductImage(slug: string, title: string): ProductImage {
  return { url: photoUrl(slug), alt: title };
}
