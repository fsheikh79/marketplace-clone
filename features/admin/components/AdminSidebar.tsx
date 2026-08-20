"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowLeftCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { currentUser, logOut } = useAuth();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-zinc-900 text-zinc-300">
      <div className="border-b border-white/10 px-5 py-5">
        <span className="text-lg font-black tracking-tight text-white">
          market<span className="text-accent-500">place</span>
        </span>
        <p className="mt-0.5 text-xs font-medium tracking-wide text-zinc-500 uppercase">
          Admin
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <div className="mb-3 px-3">
          <p className="truncate text-sm font-semibold text-white">
            {currentUser?.name}
          </p>
          <p className="truncate text-xs text-zinc-500">{currentUser?.email}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeftCircle className="h-4 w-4" aria-hidden="true" />
          View storefront
        </Link>
        <button
          type="button"
          onClick={logOut}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
