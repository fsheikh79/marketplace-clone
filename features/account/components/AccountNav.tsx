"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="border-surface-border flex gap-1 border-b">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "border-accent-500 text-brand-950"
                : "hover:text-brand-900 border-transparent text-zinc-500"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
