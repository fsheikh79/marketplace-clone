"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types";
import type { ReactNode } from "react";

export function RequireAuth({
  children,
}: {
  children: (user: User) => ReactNode;
}) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return null;

  if (!currentUser) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-brand-950 text-2xl font-extrabold">
          Sign in to continue
        </h1>
        <p className="max-w-sm text-zinc-600">
          You need an account to view this page.
        </p>
        <Link href="/login">
          <Button variant="primary">Sign in</Button>
        </Link>
      </div>
    );
  }

  return <>{children(currentUser)}</>;
}
