import type { FieldErrors } from "@/features/auth/lib/validation";

export interface ShippingFormValues {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const POSTAL_CODE_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/;

function required(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} is required.`;
}

export function validateShippingForm(values: ShippingFormValues): FieldErrors {
  return {
    fullName: required(values.fullName, "Full name"),
    line1: required(values.line1, "Street address"),
    city: required(values.city, "City"),
    state: required(values.state, "State / province"),
    postalCode: !values.postalCode.trim()
      ? "Postal code is required."
      : !POSTAL_CODE_RE.test(values.postalCode.trim())
        ? "Enter a valid postal code."
        : undefined,
    country: required(values.country, "Country"),
  };
}
