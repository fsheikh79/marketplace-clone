import type { Product } from "@/types";
import { getCategoryBySlug } from "@/features/products/lib/categories";
import { placeholderProductImage } from "@/features/products/lib/placeholderImage";

// MOCK: static in-memory product catalog. This module is the raw
// synchronous data source; application code should go through the async
// wrappers in features/products/api.ts instead of importing from here
// directly, so the later swap to real DynamoDB reads is a drop-in change.

interface ProductSeed {
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  // Electronics
  {
    slug: "aurora-wireless-noise-cancelling-headphones",
    title: "Aurora Wireless Noise-Cancelling Headphones",
    description:
      "Over-ear Bluetooth headphones with active noise cancellation, 40-hour battery life, and a memory-foam headband for all-day comfort.",
    price: 149.99,
    category: "electronics",
    brand: "Aurora",
    rating: 4.6,
    reviewCount: 2318,
    stock: 42,
  },
  {
    slug: "lumen-65-inch-4k-smart-tv",
    title: 'Lumen 65" 4K Smart TV',
    description:
      "65-inch 4K UHD smart TV with HDR10+, built-in streaming apps, and a voice-remote for hands-free control.",
    price: 549.0,
    category: "electronics",
    brand: "Lumen",
    rating: 4.4,
    reviewCount: 981,
    stock: 15,
  },
  {
    slug: "keystroke-mechanical-keyboard",
    title: "Keystroke RGB Mechanical Keyboard",
    description:
      "Hot-swappable mechanical keyboard with tactile switches, per-key RGB lighting, and a durable aluminum frame.",
    price: 89.99,
    category: "electronics",
    brand: "Keystroke",
    rating: 4.7,
    reviewCount: 1542,
    stock: 60,
  },
  {
    slug: "wavecast-portable-bluetooth-speaker",
    title: "Wavecast Portable Bluetooth Speaker",
    description:
      "Waterproof (IPX7) portable speaker with 360° sound, 20-hour battery, and pairing for stereo mode with a second unit.",
    price: 59.99,
    category: "electronics",
    brand: "Wavecast",
    rating: 4.5,
    reviewCount: 3021,
    stock: 88,
  },
  {
    slug: "pulseband-smartwatch-fitness-tracker",
    title: "Pulseband Smartwatch Fitness Tracker",
    description:
      "Fitness smartwatch with heart-rate and sleep tracking, GPS, a 7-day battery, and a bright always-on display.",
    price: 129.0,
    category: "electronics",
    brand: "Pulseband",
    rating: 4.3,
    reviewCount: 764,
    stock: 33,
  },

  // Fashion
  {
    slug: "northfield-mens-slim-fit-chinos",
    title: "Northfield Men's Slim Fit Chinos",
    description:
      "Cotton-stretch chino pants with a tailored slim fit, available in five colors, built for everyday wear.",
    price: 44.5,
    category: "fashion",
    brand: "Northfield",
    rating: 4.2,
    reviewCount: 512,
    stock: 120,
  },
  {
    slug: "wintermere-wool-blend-coat",
    title: "Wintermere Wool-Blend Overcoat",
    description:
      "Classic wool-blend overcoat with a tailored silhouette, satin lining, and a two-button front closure.",
    price: 189.0,
    category: "fashion",
    brand: "Wintermere",
    rating: 4.6,
    reviewCount: 289,
    stock: 24,
  },
  {
    slug: "stridewell-classic-leather-sneakers",
    title: "Stridewell Classic Leather Sneakers",
    description:
      "Full-grain leather sneakers with a cushioned insole and a rubber outsole built for daily comfort.",
    price: 79.99,
    category: "fashion",
    brand: "Stridewell",
    rating: 4.5,
    reviewCount: 1873,
    stock: 76,
  },
  {
    slug: "basicform-cotton-crewneck-3-pack",
    title: "Basicform Cotton Crewneck T-Shirts (3-Pack)",
    description:
      "Soft, breathable 100% cotton crewneck t-shirts, pre-shrunk and reinforced at the seams. Set of three.",
    price: 29.99,
    category: "fashion",
    brand: "Basicform",
    rating: 4.4,
    reviewCount: 2245,
    stock: 210,
  },
  {
    slug: "rustlane-denim-jacket",
    title: "Rustlane Classic Denim Jacket",
    description:
      "Mid-weight denim jacket with a relaxed fit, button-flap chest pockets, and a fully lined body.",
    price: 64.0,
    category: "fashion",
    brand: "Rustlane",
    rating: 4.3,
    reviewCount: 398,
    stock: 55,
  },

  // Home & Kitchen
  {
    slug: "castiron-co-stainless-steel-cookware-set",
    title: "Castiron & Co. 10-Piece Stainless Steel Cookware Set",
    description:
      "Tri-ply stainless steel cookware set with tempered glass lids, oven-safe to 500°F, dishwasher safe.",
    price: 199.99,
    category: "home-kitchen",
    brand: "Castiron & Co.",
    rating: 4.7,
    reviewCount: 1102,
    stock: 18,
  },
  {
    slug: "tidysweep-robot-vacuum-cleaner",
    title: "Tidysweep Robot Vacuum Cleaner",
    description:
      "App-controlled robot vacuum with smart mapping, 2000Pa suction, and automatic recharge-and-resume.",
    price: 249.0,
    category: "home-kitchen",
    brand: "Tidysweep",
    rating: 4.4,
    reviewCount: 863,
    stock: 27,
  },
  {
    slug: "brewhaven-programmable-coffee-maker",
    title: "Brewhaven Programmable Coffee Maker",
    description:
      "12-cup programmable coffee maker with a built-in grinder, thermal carafe, and customizable brew strength.",
    price: 79.0,
    category: "home-kitchen",
    brand: "Brewhaven",
    rating: 4.5,
    reviewCount: 1467,
    stock: 44,
  },
  {
    slug: "cloudrest-memory-foam-pillow-2-pack",
    title: "Cloudrest Memory Foam Pillows (2-Pack)",
    description:
      "Contoured memory foam pillows with a breathable cooling cover, designed for side and back sleepers.",
    price: 49.99,
    category: "home-kitchen",
    brand: "Cloudrest",
    rating: 4.3,
    reviewCount: 2087,
    stock: 95,
  },
  {
    slug: "crispgo-air-fryer-6-quart",
    title: "Crispgo 6-Quart Digital Air Fryer",
    description:
      "6-quart digital air fryer with 8 presets, a nonstick basket, and rapid hot-air circulation for less oil.",
    price: 89.99,
    category: "home-kitchen",
    brand: "Crispgo",
    rating: 4.6,
    reviewCount: 3210,
    stock: 51,
  },

  // Beauty
  {
    slug: "glowlab-vitamin-c-facial-serum",
    title: "Glowlab Vitamin C Facial Serum",
    description:
      "Brightening facial serum with 15% vitamin C, hyaluronic acid, and vitamin E for daily radiance.",
    price: 24.99,
    category: "beauty",
    brand: "Glowlab",
    rating: 4.5,
    reviewCount: 4521,
    stock: 160,
  },
  {
    slug: "sleekedge-ceramic-hair-straightener",
    title: "Sleekedge Ceramic Hair Straightener",
    description:
      "Ceramic-plate flat iron with adjustable heat up to 450°F and a fast 30-second heat-up time.",
    price: 39.99,
    category: "beauty",
    brand: "Sleekedge",
    rating: 4.2,
    reviewCount: 987,
    stock: 70,
  },
  {
    slug: "brightsmile-electric-toothbrush",
    title: "Brightsmile Sonic Electric Toothbrush",
    description:
      "Rechargeable sonic toothbrush with 5 cleaning modes, a 2-minute smart timer, and 3-week battery life.",
    price: 34.99,
    category: "beauty",
    brand: "Brightsmile",
    rating: 4.6,
    reviewCount: 1755,
    stock: 130,
  },
  {
    slug: "daylayer-moisturizer-spf-30",
    title: "Daylayer Daily Moisturizer SPF 30",
    description:
      "Lightweight, non-greasy daily moisturizer with broad-spectrum SPF 30 protection for all skin types.",
    price: 18.5,
    category: "beauty",
    brand: "Daylayer",
    rating: 4.4,
    reviewCount: 2634,
    stock: 200,
  },
  {
    slug: "softbristle-bamboo-makeup-brush-set",
    title: "Softbristle Bamboo Makeup Brush Set (12-Piece)",
    description:
      "12-piece makeup brush set with bamboo handles and cruelty-free synthetic bristles, includes a travel case.",
    price: 22.0,
    category: "beauty",
    brand: "Softbristle",
    rating: 4.3,
    reviewCount: 1120,
    stock: 85,
  },

  // Sports & Outdoors
  {
    slug: "ironforge-adjustable-dumbbell-set",
    title: "Ironforge Adjustable Dumbbell Set (5-50 lbs)",
    description:
      "Space-saving adjustable dumbbells, 5 to 50 lbs per hand in quick increments, replaces 15 pairs.",
    price: 299.0,
    category: "sports-outdoors",
    brand: "Ironforge",
    rating: 4.7,
    reviewCount: 642,
    stock: 12,
  },
  {
    slug: "trailpeak-insulated-water-bottle",
    title: "Trailpeak Insulated Water Bottle 32oz",
    description:
      "Double-wall vacuum-insulated stainless steel bottle, keeps drinks cold 24 hours or hot for 12.",
    price: 27.99,
    category: "sports-outdoors",
    brand: "Trailpeak",
    rating: 4.6,
    reviewCount: 3987,
    stock: 175,
  },
  {
    slug: "basecamp-4-person-camping-tent",
    title: "Basecamp 4-Person Camping Tent",
    description:
      "Weatherproof 4-person dome tent with a rainfly, mesh ventilation panels, and a 5-minute setup.",
    price: 119.99,
    category: "sports-outdoors",
    brand: "Basecamp",
    rating: 4.4,
    reviewCount: 511,
    stock: 22,
  },
  {
    slug: "wildroot-yoga-mat-carry-strap",
    title: "Wildroot Non-Slip Yoga Mat with Carry Strap",
    description:
      "Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material, includes a carry strap.",
    price: 32.0,
    category: "sports-outdoors",
    brand: "Wildroot",
    rating: 4.5,
    reviewCount: 2298,
    stock: 140,
  },
  {
    slug: "swiftstride-trail-running-shoes",
    title: "Swiftstride Trail Running Shoes",
    description:
      "Lightweight trail running shoes with an aggressive lug outsole and a breathable, water-resistant upper.",
    price: 94.99,
    category: "sports-outdoors",
    brand: "Swiftstride",
    rating: 4.5,
    reviewCount: 876,
    stock: 38,
  },

  // Books
  {
    slug: "bookhaven-deep-work-principles",
    title: "Deep Work Principles",
    description:
      "A practical guide to building focus habits and doing meaningful, distraction-free work in a noisy world.",
    price: 16.99,
    category: "books",
    brand: "Bookhaven Press",
    rating: 4.6,
    reviewCount: 5210,
    stock: 300,
  },
  {
    slug: "bookhaven-the-minimalist-kitchen",
    title: "The Minimalist Kitchen",
    description:
      "A cookbook built around a small set of versatile ingredients and tools for simpler, faster home cooking.",
    price: 21.99,
    category: "books",
    brand: "Bookhaven Press",
    rating: 4.5,
    reviewCount: 1342,
    stock: 180,
  },
  {
    slug: "bookhaven-modern-cloud-architecture",
    title: "Modern Cloud Architecture",
    description:
      "A hands-on guide to designing resilient, cost-aware systems on modern cloud platforms.",
    price: 34.99,
    category: "books",
    brand: "Bookhaven Press",
    rating: 4.7,
    reviewCount: 908,
    stock: 90,
  },
  {
    slug: "bookhaven-mystery-at-midnight",
    title: "Mystery at Midnight",
    description:
      "A page-turning detective novel set in a fog-bound coastal town where nothing is quite what it seems.",
    price: 14.99,
    category: "books",
    brand: "Bookhaven Press",
    rating: 4.3,
    reviewCount: 2765,
    stock: 250,
  },
  {
    slug: "bookhaven-the-long-way-home",
    title: "The Long Way Home",
    description:
      "A quiet, character-driven novel following three siblings retracing their late father's cross-country route.",
    price: 15.99,
    category: "books",
    brand: "Bookhaven Press",
    rating: 4.4,
    reviewCount: 1189,
    stock: 210,
  },
];

function toProduct(seed: ProductSeed, index: number): Product {
  const category = getCategoryBySlug(seed.category);
  const hex = category?.hex ?? "#375883";
  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    price: seed.price,
    currency: "USD",
    images: [
      { url: placeholderProductImage(hex, index), alt: seed.title },
      {
        url: placeholderProductImage(hex, index + 100),
        alt: `${seed.title} — alternate view`,
      },
    ],
    category: seed.category,
    brand: seed.brand,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    stock: seed.stock,
    createdAt: new Date(2026, 0, 1 + index).toISOString(),
  };
}

const ALL_PRODUCTS: Product[] = PRODUCT_SEEDS.map(toProduct);

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return ALL_PRODUCTS.filter((product) => product.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return ALL_PRODUCTS.filter(
    (candidate) =>
      candidate.category === product.category && candidate.id !== product.id,
  ).slice(0, limit);
}
