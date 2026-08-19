import { Check } from "lucide-react";

const STEPS = ["Shipping", "Review", "Payment"] as const;

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mb-8 flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < current;
        const isActive = stepNumber === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isComplete
                    ? "bg-secondary-500 text-white"
                    : isActive
                      ? "bg-brand-900 text-white"
                      : "bg-surface-muted text-zinc-500"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
              </span>
              <span
                className={`hidden text-sm font-semibold sm:inline ${
                  isActive ? "text-brand-950" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber < STEPS.length && (
              <div
                className={`h-px flex-1 ${isComplete ? "bg-secondary-500" : "bg-surface-border"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
