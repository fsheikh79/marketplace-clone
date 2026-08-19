import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { LogInForm } from "@/features/auth/components/LogInForm";
import { ContinueAsGuest } from "@/features/auth/components/ContinueAsGuest";

export const metadata: Metadata = {
  title: "Sign in — marketplace",
};

export default function LogInPage() {
  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back — enter your details below."
    >
      <LogInForm />
      <ContinueAsGuest />
    </AuthCard>
  );
}
