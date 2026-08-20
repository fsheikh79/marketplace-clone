"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  findProductById,
  updateProduct,
} from "@/features/products/lib/productStore";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import {
  ProductForm,
  useProductForm,
} from "@/features/admin/components/ProductForm";
import { useToast } from "@/features/toast/context/ToastContext";
import { Button } from "@/components/ui/Button";
import type { ProductFormValues } from "@/features/admin/lib/productValidation";
import type { Product } from "@/types";

function EditForm({ product }: { product: Product }) {
  const router = useRouter();
  const { showToast } = useToast();
  const form = useProductForm({
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    brand: product.brand ?? "",
    stock: String(product.stock),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    // MOCK: instant local write. Replace with an API Gateway/Lambda PATCH
    // to DynamoDB in Phase 2.
    updateProduct(product.id, {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      category: values.category,
      brand: values.brand.trim() || undefined,
      stock: Number(values.stock),
    });
    showToast(`Saved changes to ${values.title.trim()}`);
    router.push("/admin/products");
  }

  return (
    <ProductForm
      form={form}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      isSubmitting={isSubmitting}
    />
  );
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    // Syncing from the shared mock product store on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProduct(findProductById(id) ?? null);
  }, [id]);

  if (product === undefined) return null;

  if (product === null) {
    return (
      <div className="flex-1 p-6">
        <p className="text-sm text-zinc-600">Product not found.</p>
        <Link href="/admin/products">
          <Button variant="secondary" className="mt-4">
            Back to products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader title={`Edit: ${product.title}`} />
      <div className="flex-1 p-6">
        <EditForm product={product} />
      </div>
    </>
  );
}
