import { useCallback, useState } from "react";
import type { FieldErrors } from "@/features/auth/lib/validation";

/**
 * Generic form-state + validation hook: tracks values, per-field "touched"
 * state, and derives errors from a supplied validator. Keeps validation
 * logic out of JSX — components only read `errors`/`touched` and call
 * `handleChange`/`handleBlur`/`validateAll`.
 */
export function useFormValidation<T extends { [K in keyof T]: string }>(
  initialValues: T,
  validate: (values: T) => FieldErrors,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const errors = validate(values);

  const handleChange = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const touchAll = useCallback(() => {
    setTouched(
      Object.fromEntries(
        Object.keys(initialValues).map((key) => [key, true]),
      ) as Record<keyof T, boolean>,
    );
  }, [initialValues]);

  const isValid = !Object.values(errors).some(Boolean);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    touchAll,
  };
}
