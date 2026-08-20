"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/features/products/lib/categories";
import {
  staggerContainer,
  staggerItem,
} from "@/components/motion/ScrollReveal";

export function CategoryGrid() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      {CATEGORIES.map(({ label, slug, icon: Icon, tint }) => (
        <motion.div key={slug} variants={staggerItem}>
          <Link
            href={`/products?category=${slug}`}
            className="group border-surface-border focus-visible:outline-brand-500 flex flex-col items-center gap-3 rounded-lg border bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full ${tint} text-white transition-transform group-hover:scale-105`}
            >
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-brand-950 text-sm font-semibold">
              {label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
