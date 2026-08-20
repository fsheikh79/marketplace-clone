"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/features/toast/context/ToastContext";

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
      { label: "Your orders", href: "/orders" },
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

// MOCK: text marks standing in for real brand icons — lucide-react
// dropped brand/social icons (trademark reasons), and drawing Facebook/
// Instagram/etc. marks ourselves isn't something to do without a license.
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", mark: "f" },
  { label: "Instagram", href: "https://instagram.com", mark: "IG" },
  { label: "Twitter", href: "https://twitter.com", mark: "X" },
  { label: "YouTube", href: "https://youtube.com", mark: "YT" },
];

// MOCK: simple text marks standing in for real payment-provider brand
// SVGs (Visa/Mastercard/Amex trademarks aren't ours to embed as-is).
const PAYMENT_METHODS = ["VISA", "Mastercard", "AMEX", "Discover"];

function NewsletterForm() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // MOCK: no real subscription backend — just confirms the interaction.
    showToast("Thanks for subscribing!");
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="focus:ring-accent-500 h-11 flex-1 rounded-md border border-white/20 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-zinc-400 focus:ring-2"
      />
      <Button type="submit" variant="primary" className="h-11">
        Subscribe
      </Button>
    </form>
  );
}

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
          <NewsletterForm />

          <div className="mt-2 flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, mark }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {mark}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {year} marketplace. All rights reserved.
          </p>
          <div className="flex gap-2" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded border border-white/15 px-2 py-1 text-[10px] font-bold tracking-wide text-zinc-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
