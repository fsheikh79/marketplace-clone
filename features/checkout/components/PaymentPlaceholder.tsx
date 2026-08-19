import { CreditCard } from "lucide-react";

/**
 * PLACEHOLDER: this is the UI shell where a real Stripe Elements card form
 * will be embedded in Phase 2. No payment logic — real or fake — lives
 * here; "Place order" below mocks a successful order without any payment
 * dependency.
 */
export function PaymentPlaceholder() {
  return (
    <div className="border-surface-border bg-surface-muted rounded-lg border-2 border-dashed p-6">
      <div className="text-brand-900 mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5" aria-hidden="true" />
        <p className="text-sm font-bold">Payment details</p>
      </div>
      <p className="mb-4 text-sm text-zinc-600">
        Stripe Elements will be embedded here in a later phase to securely
        collect card details. No payment is processed in this preview build.
      </p>
      <div className="flex flex-col gap-3 opacity-60">
        <div className="border-surface-border h-11 rounded-md border bg-white px-3 py-3 text-sm text-zinc-400">
          Card number
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-surface-border h-11 rounded-md border bg-white px-3 py-3 text-sm text-zinc-400">
            MM / YY
          </div>
          <div className="border-surface-border h-11 rounded-md border bg-white px-3 py-3 text-sm text-zinc-400">
            CVC
          </div>
        </div>
      </div>
    </div>
  );
}
