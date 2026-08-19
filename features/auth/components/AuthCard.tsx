import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-muted mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className="border-surface-border rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-brand-950 text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
