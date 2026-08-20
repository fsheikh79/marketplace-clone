import type { Product } from "@/types";
import { getProductBadges } from "@/features/products/lib/productBadges";

const BADGE_STYLES = {
  sale: "bg-red-600 text-white",
  new: "bg-secondary-600 text-white",
  bestSeller: "bg-accent-500 text-brand-950",
  limitedStock: "bg-zinc-900 text-white",
};

export function ProductBadges({ product }: { product: Product }) {
  const badges = getProductBadges(product);

  const items: { key: string; label: string; style: string }[] = [];
  if (badges.isOnSale) {
    items.push({
      key: "sale",
      label: `Sale -${badges.salePercentOff}%`,
      style: BADGE_STYLES.sale,
    });
  }
  if (badges.isLimitedStock) {
    items.push({
      key: "limited",
      label: "Limited Stock",
      style: BADGE_STYLES.limitedStock,
    });
  }
  if (badges.isNew) {
    items.push({ key: "new", label: "New", style: BADGE_STYLES.new });
  }
  if (badges.isBestSeller) {
    items.push({
      key: "bestseller",
      label: "Best Seller",
      style: BADGE_STYLES.bestSeller,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
      {items.slice(0, 2).map((item) => (
        <span
          key={item.key}
          className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${item.style}`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
