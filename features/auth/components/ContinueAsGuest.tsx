import Link from "next/link";

/**
 * Guest checkout entry point, shown wherever auth is presented. Links to
 * the homepage for now — will link to the checkout flow once it exists.
 */
export function ContinueAsGuest() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="flex w-full items-center gap-3">
        <div className="bg-surface-border h-px flex-1" />
        <span className="text-xs font-medium text-zinc-400 uppercase">or</span>
        <div className="bg-surface-border h-px flex-1" />
      </div>
      <Link
        href="/"
        className="text-brand-800 text-sm font-medium hover:underline"
      >
        Continue as guest
      </Link>
    </div>
  );
}
