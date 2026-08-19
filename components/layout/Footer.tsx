"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

const FOOTER_SECTIONS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Get to know us",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press releases", href: "/press" },
    ],
  },
  {
    title: "Let us help you",
    links: [
      { label: "Your orders", href: "/account/orders" },
      { label: "Shipping rates & policies", href: "/shipping" },
      { label: "Returns & replacements", href: "/returns" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    title: "Make money with us",
    links: [
      { label: "Sell on marketplace", href: "/sell" },
      { label: "Become an affiliate", href: "/affiliates" },
      { label: "Advertise your products", href: "/advertise" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy notice", href: "/legal/privacy" },
      { label: "Terms of use", href: "/legal/terms" },
      { label: "Cookie policy", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-zinc-300">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-brand-800 hover:bg-brand-700 hidden w-full py-3 text-center text-xs font-semibold text-white sm:block"
      >
        Back to top
      </button>

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-bold text-white">{section.title}</h3>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 text-center">
          <span className="text-lg font-black tracking-tight text-white">
            market<span className="text-accent-500">place</span>
          </span>
          <p className="max-w-md text-sm text-zinc-400">
            Get order updates, exclusive deals, and new arrivals straight to
            your inbox.
          </p>
          <Button variant="secondary-on-dark">Subscribe to updates</Button>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-zinc-500">
        &copy; {year} marketplace. All rights reserved.
      </div>
    </footer>
  );
}
