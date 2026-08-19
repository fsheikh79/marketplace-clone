import Link from "next/link";

/**
 * Guest checkout entry point, shown wherever auth is presented. Links to
 * the homepage for now — will link to the checkout flow once it exists.
 */
export function ContinueAsGuest() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-medium text-zinc-400 uppercase">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
      >
        Continue as guest
      </Link>
    </div>
  );
}
