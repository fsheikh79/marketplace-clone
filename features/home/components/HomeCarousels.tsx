"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import {
  getDealsProducts,
  getTrendingProducts,
  getRecommendedProducts,
} from "@/features/products/api";
import { ProductCarouselRow } from "@/features/products/components/ProductCarouselRow";

export function HomeCarousels() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getDealsProducts(),
      getTrendingProducts(),
      getRecommendedProducts(),
    ]).then(([dealsRes, trendingRes, recommendedRes]) => {
      if (cancelled) return;

      setDeals(dealsRes);
      setTrending(trendingRes);
      setRecommended(recommendedRes);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ProductCarouselRow title="Today's Deals" products={deals} />
      <ProductCarouselRow title="Trending Now" products={trending} />
      <ProductCarouselRow title="Recommended for You" products={recommended} />
    </>
  );
}
