"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
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
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <UserIcon className="h-5 w-5" aria-hidden="true" />
        Sign in
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
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-zinc-900">
          {initials}
        </span>
        <span className="hidden sm:inline">{currentUser.name}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {currentUser.email}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logOut();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
