"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "@/features/toast/context/ToastContext";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

// Admin gate: non-admin users are redirected, never shown a broken or
// half-rendered admin page. MOCK: role check against the local mock user
// session — replace with a real Cognito user-group/role claim check
// (e.g. verified server-side via middleware) in Phase 2.
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.replace("/login");
    } else if (currentUser.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, currentUser, router]);

  if (isLoading || !currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-x-hidden">{children}</div>
      </div>
    </ToastProvider>
  );
}
