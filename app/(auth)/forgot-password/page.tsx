import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";

export const metadata: Metadata = {
  title: "Reset your password — marketplace",
};

// Stub page: password-reset email delivery requires a real backend
// (Cognito forgot-password flow), which lands in Phase 2.
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Password reset isn't available yet in this preview build."
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This flow will send a reset link to your email once account recovery is
        wired up to a real auth backend in a later phase.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        Back to sign in
      </Link>
    </AuthCard>
  );
}
