import Link from "next/link";

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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {section.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-200 px-4 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        &copy; {year} marketplace. All rights reserved.
      </div>
    </footer>
  );
}
