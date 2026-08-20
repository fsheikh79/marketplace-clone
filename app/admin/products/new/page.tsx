"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/features/products/lib/productStore";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import {
  ProductForm,
  useProductForm,
  EMPTY_PRODUCT_FORM,
} from "@/features/admin/components/ProductForm";
import { useToast } from "@/features/toast/context/ToastContext";
import type { ProductFormValues } from "@/features/admin/lib/productValidation";

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const form = useProductForm(EMPTY_PRODUCT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    // MOCK: instant local write. Replace with an API Gateway/Lambda POST to
    // DynamoDB in Phase 2.
    const product = createProduct({
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      category: values.category,
      brand: values.brand.trim() || undefined,
      stock: Number(values.stock),
    });
    showToast(`${product.title} added to the catalog`);
    router.push("/admin/products");
  }

  return (
    <>
      <AdminPageHeader
        title="Add product"
        description="New products appear on the storefront immediately."
      />
      <div className="flex-1 p-6">
        <ProductForm
          form={form}
          onSubmit={handleSubmit}
          submitLabel="Add product"
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}
