"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useFormValidation } from "@/features/auth/hooks/useFormValidation";
import {
  hasErrors,
  validateSignUpForm,
  type SignUpFormValues,
} from "@/features/auth/lib/validation";
import { AuthError } from "@/features/auth/lib/mockAuthStore";

const initialValues: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const { values, errors, touched, handleChange, handleBlur, touchAll } =
    useFormValidation(initialValues, validateSignUpForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    touchAll();
    setSubmitError(null);
    if (hasErrors(errors)) return;

    setIsSubmitting(true);
    try {
      await signUp(values.name, values.email, values.password);
      router.push("/");
    } catch (error) {
      setSubmitError(
        error instanceof AuthError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Full name"
        name="name"
        autoComplete="name"
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        onBlur={() => handleBlur("name")}
        error={touched.name ? errors.name : undefined}
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : undefined}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={(e) => handleChange("password", e.target.value)}
        onBlur={() => handleBlur("password")}
        error={touched.password ? errors.password : undefined}
      />
      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        onBlur={() => handleBlur("confirmPassword")}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
      />

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-secondary-600 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
