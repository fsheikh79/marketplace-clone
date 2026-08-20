"use client";

import { type ReactNode, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type Variant =
  "primary" | "secondary" | "secondary-on-dark" | "ghost" | "danger";

interface ButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "ref" | "children"
> {
  variant?: Variant;
  isLoading?: boolean;
  children?: ReactNode;
}

// One accent color, one hierarchy: primary is the only filled/CTA style,
// secondary is its outlined counterpart (secondary-on-dark for use on brand
// navy surfaces), ghost is text-only for low-emphasis actions. No other
// color pairing should be introduced ad hoc.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-brand-950 hover:bg-accent-600 focus-visible:outline-accent-600",
  secondary:
    "border-2 border-brand-900 bg-transparent text-brand-900 hover:bg-brand-900 hover:text-white focus-visible:outline-brand-900",
  "secondary-on-dark":
    "border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-950 focus-visible:outline-white",
  ghost:
    "bg-transparent text-brand-800 hover:bg-surface-muted focus-visible:outline-brand-500",
  // Destructive actions only (e.g. admin delete confirmations) — never
  // used for primary storefront CTAs.
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
