import {
  BookOpen,
  Cpu,
  Dumbbell,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  slug: string;
  label: string;
  icon: LucideIcon;
  /** Tailwind background class — kept as one source of truth for tinting
   * category chips, cards, and product placeholder art consistently. */
  tint: string;
  /** Hex equivalent of `tint`, used where a literal color is needed (e.g.
   * generated SVG placeholder art) instead of a Tailwind class. */
  hex: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "electronics",
    label: "Electronics",
    icon: Cpu,
    tint: "bg-secondary-500",
    hex: "#0f6e64",
  },
  {
    slug: "fashion",
    label: "Fashion",
    icon: Shirt,
    tint: "bg-accent-600",
    hex: "#d98a0f",
  },
  {
    slug: "home-kitchen",
    label: "Home & Kitchen",
    icon: HomeIcon,
    tint: "bg-brand-700",
    hex: "#1f3350",
  },
  {
    slug: "beauty",
    label: "Beauty",
    icon: Sparkles,
    tint: "bg-secondary-600",
    hex: "#0b5951",
  },
  {
    slug: "sports-outdoors",
    label: "Sports & Outdoors",
    icon: Dumbbell,
    tint: "bg-brand-600",
    hex: "#2a4468",
  },
  {
    slug: "books",
    label: "Books",
    icon: BookOpen,
    tint: "bg-accent-700",
    hex: "#b26f0a",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
