export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** Hotlinked from Lorem Picsum, not Unsplash — see productPhotos.ts for
   * why (this sandbox's network policy blocks image CDNs from being
   * verified, Picsum is the substitute). */
  imageUrl: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "electronics-sale",
    eyebrow: "Limited time",
    title: "Summer Sale — Up to 60% off Electronics",
    body: "Headphones, TVs, and more at their lowest prices this season.",
    ctaLabel: "Shop Electronics",
    ctaHref: "/products?category=electronics",
    imageUrl: "https://picsum.photos/seed/hero-electronics/1600/700",
  },
  {
    id: "fashion-arrivals",
    eyebrow: "Just landed",
    title: "New Arrivals in Fashion",
    body: "Fresh styles across jackets, sneakers, and everyday essentials.",
    ctaLabel: "Shop Fashion",
    ctaHref: "/products?category=fashion",
    imageUrl: "https://picsum.photos/seed/hero-fashion/1600/700",
  },
  {
    id: "free-shipping",
    eyebrow: "Every order",
    title: "Free Shipping on Orders Over $50",
    body: "No code needed — the discount applies automatically at checkout.",
    ctaLabel: "Start Shopping",
    ctaHref: "/products",
    imageUrl: "https://picsum.photos/seed/hero-shipping/1600/700",
  },
  {
    id: "home-kitchen",
    eyebrow: "Refresh your space",
    title: "Home & Kitchen Essentials",
    body: "Everything from cookware to smart cleaning, all in one place.",
    ctaLabel: "Shop Home & Kitchen",
    ctaHref: "/products?category=home-kitchen",
    imageUrl: "https://picsum.photos/seed/hero-kitchen/1600/700",
  },
  {
    id: "top-rated",
    eyebrow: "Customer favorites",
    title: "Top-Rated Picks, All in One Spot",
    body: "Thousands of 5-star reviews across every category.",
    ctaLabel: "Browse Best Sellers",
    ctaHref: "/products",
    imageUrl: "https://picsum.photos/seed/hero-toprated/1600/700",
  },
];
