import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
        In development
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
        Shop everything, in one place.
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Product browsing, cart, and checkout are coming in the next sub-phase.
        For now, create an account or sign in to try the auth flow.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/signup">
          <Button variant="primary">Create an account</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
