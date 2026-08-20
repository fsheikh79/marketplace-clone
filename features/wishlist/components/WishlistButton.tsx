"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/features/toast/context/ToastContext";

// Wishlist actions require a signed-in user (same gating as reviews).
// This component is where that decision is made — WishlistContext itself
// has no idea auth exists.
export function WishlistButton({
  productId,
  variant = "overlay",
}: {
  productId: string;
  variant?: "overlay" | "inline";
}) {
  const { isSaved, toggle } = useWishlist();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const saved = isSaved(productId);

  const baseClasses =
    variant === "overlay"
      ? "absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
      : "flex h-11 w-11 items-center justify-center rounded-md border border-surface-border hover:bg-surface-muted";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!currentUser) {
          showToast("Sign in to save items to your wishlist");
          return;
        }
        toggle(productId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={baseClasses}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={saved ? "saved" : "unsaved"}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="flex"
        >
          <Heart
            className={`h-5 w-5 ${saved ? "text-red-500" : "text-zinc-500"}`}
            fill={saved ? "currentColor" : "none"}
          />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
