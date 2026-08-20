import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 && " / "}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-brand-900 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
