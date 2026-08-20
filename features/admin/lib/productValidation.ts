import type { FieldErrors } from "@/features/auth/lib/validation";

export interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  stock: string;
}

export function validateProductForm(values: ProductFormValues): FieldErrors {
  const price = Number(values.price);
  const stock = Number(values.stock);
  return {
    title: values.title.trim() ? undefined : "Title is required.",
    description: values.description.trim()
      ? undefined
      : "Description is required.",
    category: values.category ? undefined : "Choose a category.",
    price: !values.price.trim()
      ? "Price is required."
      : !Number.isFinite(price) || price <= 0
        ? "Enter a valid price greater than 0."
        : undefined,
    stock: !values.stock.trim()
      ? "Stock is required."
      : !Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)
        ? "Enter a valid non-negative whole number."
        : undefined,
  };
}
