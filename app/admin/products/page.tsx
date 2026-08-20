"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import {
  listProducts,
  deleteProduct,
} from "@/features/products/lib/productStore";
import { CATEGORIES } from "@/features/products/lib/categories";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/features/toast/context/ToastContext";
import { formatPrice } from "@/lib/format";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  function refresh() {
    setProducts(listProducts());
  }

  useEffect(() => {
    // Syncing from the shared mock product store on mount, not derived
    // render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        product.title.toLowerCase().includes(normalized) ||
        (product.brand ?? "").toLowerCase().includes(normalized);
      const matchesCategory = !category || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    // MOCK: instant local delete. Replace with an API Gateway/Lambda
    // DELETE call to DynamoDB in Phase 2.
    deleteProduct(pendingDelete.id);
    showToast(`Deleted ${pendingDelete.title}`);
    setPendingDelete(null);
    refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Reused by the storefront — edits here show up there immediately."
        action={
          <Link href="/admin/products/new">
            <Button variant="primary" className="h-10 px-4 text-sm">
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search by title or brand"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-64 rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element -- generated data-URI placeholder art */}
                      <img
                        src={product.images[0]?.url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded bg-zinc-100 object-cover"
                      />
                      <span className="font-medium text-zinc-900">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 capitalize">
                    {product.category.replace("-", " ")}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatPrice(product.price, product.currency)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${product.title}`}
                        onClick={() => setPendingDelete(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products !== null && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete product"
        description={`Are you sure you want to delete "${pendingDelete?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
