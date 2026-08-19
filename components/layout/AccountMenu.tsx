"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User as UserIcon, LogOut, Package } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

export function AccountMenu() {
  const { currentUser, isLoading, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-md bg-white/10" />;
  }

  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="focus-visible:outline-accent-500 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <UserIcon className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:flex sm:flex-col sm:items-start sm:leading-tight">
          <span className="text-[11px] font-normal text-zinc-300">
            Hello, sign in
          </span>
          <span>Account</span>
        </span>
      </Link>
    );
  }

  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="focus-visible:outline-accent-500 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="bg-accent-500 text-brand-950 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
          {initials}
        </span>
        <span className="hidden sm:inline">{currentUser.name}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="border-surface-border text-brand-950 absolute top-full right-0 z-20 mt-2 w-52 overflow-hidden rounded-md border bg-white py-1 shadow-xl"
        >
          <div className="border-surface-border border-b px-4 py-2 text-xs text-zinc-500">
            {currentUser.email}
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="text-brand-900 hover:bg-surface-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
          >
            <UserIcon className="h-4 w-4" aria-hidden="true" />
            Your account
          </Link>
          <Link
            href="/account/orders"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="text-brand-900 hover:bg-surface-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            Your orders
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logOut();
              setIsOpen(false);
            }}
            className="text-brand-900 hover:bg-surface-muted border-surface-border flex w-full items-center gap-2 border-t px-4 py-2 text-left text-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
