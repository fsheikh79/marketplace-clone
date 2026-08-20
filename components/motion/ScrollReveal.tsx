"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fades + slides content up as it scrolls into view. `once` keeps it from
 * re-triggering on every scroll past — matches how most "polished" sites
 * animate content in, not a scroll-jacking effect.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggers its direct motion-variant children as a group scrolls into view. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};
