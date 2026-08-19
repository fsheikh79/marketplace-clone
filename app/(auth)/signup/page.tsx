import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { ContinueAsGuest } from "@/features/auth/components/ContinueAsGuest";

export const metadata: Metadata = {
  title: "Create an account — marketplace",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join marketplace to track orders, save items, and check out faster."
    >
      <SignUpForm />
      <ContinueAsGuest />
    </AuthCard>
  );
}
