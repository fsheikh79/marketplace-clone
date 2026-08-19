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
  validateLogInForm,
  type LogInFormValues,
} from "@/features/auth/lib/validation";
import { AuthError } from "@/features/auth/lib/mockAuthStore";

const initialValues: LogInFormValues = { email: "", password: "" };

export function LogInForm() {
  const { logIn } = useAuth();
  const router = useRouter();
  const { values, errors, touched, handleChange, handleBlur, touchAll } =
    useFormValidation(initialValues, validateLogInForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    touchAll();
    setSubmitError(null);
    if (hasErrors(errors)) return;

    setIsSubmitting(true);
    try {
      await logIn(values.email, values.password);
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
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : undefined}
      />
      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={touched.password ? errors.password : undefined}
        />
        <Link
          href="/forgot-password"
          className="text-secondary-600 self-end text-sm font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Sign in
      </Button>

      <p className="text-center text-sm text-zinc-600">
        New here?{" "}
        <Link
          href="/signup"
          className="text-secondary-600 font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
