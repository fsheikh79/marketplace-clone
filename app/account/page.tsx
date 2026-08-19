"use client";

import { RequireAuth } from "@/features/account/components/RequireAuth";
import { AccountNav } from "@/features/account/components/AccountNav";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-brand-950 mb-6 text-2xl font-extrabold">Account</h1>
      <RequireAuth>
        {(user) => (
          <div>
            <AccountNav />
            <div className="border-surface-border mt-6 max-w-md rounded-lg border bg-white p-6">
              <div className="flex items-center gap-4">
                <span className="bg-accent-500 text-brand-950 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold">
                  {user.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div>
                  <p className="text-brand-950 text-lg font-bold">
                    {user.name}
                  </p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </RequireAuth>
    </div>
  );
}
