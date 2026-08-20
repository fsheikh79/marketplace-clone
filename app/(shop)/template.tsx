"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Next.js remounts `template.tsx` on every navigation (unlike layout.tsx),
// which is exactly what a per-page fade transition needs. Scoped to the
// (shop) route group only — the admin panel stays instant/functional.
export default function ShopTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
