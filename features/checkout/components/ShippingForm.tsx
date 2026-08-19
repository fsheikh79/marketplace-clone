"use client";

import { Input } from "@/components/ui/Input";
import { useFormValidation } from "@/features/auth/hooks/useFormValidation";
import {
  validateShippingForm,
  type ShippingFormValues,
} from "@/features/checkout/lib/validation";

const initialValues: ShippingFormValues = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export function useShippingForm() {
  return useFormValidation(initialValues, validateShippingForm);
}

export function ShippingForm({
  form,
}: {
  form: ReturnType<typeof useShippingForm>;
}) {
  const { values, errors, touched, handleChange, handleBlur } = form;

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Full name"
        name="fullName"
        autoComplete="name"
        value={values.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        onBlur={() => handleBlur("fullName")}
        error={touched.fullName ? errors.fullName : undefined}
      />
      <Input
        label="Street address"
        name="line1"
        autoComplete="address-line1"
        value={values.line1}
        onChange={(e) => handleChange("line1", e.target.value)}
        onBlur={() => handleBlur("line1")}
        error={touched.line1 ? errors.line1 : undefined}
      />
      <Input
        label="Apartment, suite, etc. (optional)"
        name="line2"
        autoComplete="address-line2"
        value={values.line2}
        onChange={(e) => handleChange("line2", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          autoComplete="address-level2"
          value={values.city}
          onChange={(e) => handleChange("city", e.target.value)}
          onBlur={() => handleBlur("city")}
          error={touched.city ? errors.city : undefined}
        />
        <Input
          label="State / province"
          name="state"
          autoComplete="address-level1"
          value={values.state}
          onChange={(e) => handleChange("state", e.target.value)}
          onBlur={() => handleBlur("state")}
          error={touched.state ? errors.state : undefined}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postal code"
          name="postalCode"
          autoComplete="postal-code"
          value={values.postalCode}
          onChange={(e) => handleChange("postalCode", e.target.value)}
          onBlur={() => handleBlur("postalCode")}
          error={touched.postalCode ? errors.postalCode : undefined}
        />
        <Input
          label="Country"
          name="country"
          autoComplete="country-name"
          value={values.country}
          onChange={(e) => handleChange("country", e.target.value)}
          onBlur={() => handleBlur("country")}
          error={touched.country ? errors.country : undefined}
        />
      </div>
    </div>
  );
}
