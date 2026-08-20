"use client";

import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useFormValidation } from "@/features/auth/hooks/useFormValidation";
import { hasErrors } from "@/features/auth/lib/validation";
import {
  validateProductForm,
  type ProductFormValues,
} from "@/features/admin/lib/productValidation";
import { CATEGORIES } from "@/features/products/lib/categories";

export function useProductForm(initialValues: ProductFormValues) {
  return useFormValidation(initialValues, validateProductForm);
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  title: "",
  description: "",
  price: "",
  category: CATEGORIES[0]?.slug ?? "",
  brand: "",
  stock: "",
};

export function ProductForm({
  form,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  form: ReturnType<typeof useProductForm>;
  onSubmit: (values: ProductFormValues) => void;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  const { values, errors, touched, handleChange, handleBlur, touchAll } = form;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    touchAll();
    if (hasErrors(errors)) return;
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-xl flex-col gap-4"
    >
      <Input
        label="Title"
        name="title"
        value={values.title}
        onChange={(e) => handleChange("title", e.target.value)}
        onBlur={() => handleBlur("title")}
        error={touched.title ? errors.title : undefined}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-zinc-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          rows={4}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-500"
        />
        {touched.description && errors.description && (
          <p role="alert" className="text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={values.price}
          onChange={(e) => handleChange("price", e.target.value)}
          onBlur={() => handleBlur("price")}
          error={touched.price ? errors.price : undefined}
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={values.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          onBlur={() => handleBlur("stock")}
          error={touched.stock ? errors.stock : undefined}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="category"
          className="text-sm font-semibold text-zinc-700"
        >
          Category
        </label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => handleChange("category", e.target.value)}
          onBlur={() => handleBlur("category")}
          className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.label}
            </option>
          ))}
        </select>
        {touched.category && errors.category && (
          <p role="alert" className="text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      <Input
        label="Brand (optional)"
        name="brand"
        value={values.brand}
        onChange={(e) => handleChange("brand", e.target.value)}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}
