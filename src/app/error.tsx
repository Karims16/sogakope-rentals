"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  return (
    <main className="page-shell py-20 text-center sm:py-28">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#fff3dc] text-[#9b6b1e]">
        <AlertTriangle aria-hidden="true" size={25} />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687672]">
        We couldn’t finish loading this page. You can try again or return to
        Sogakope Rentals.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-[#87908a]">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#176b50] px-5 text-sm font-bold text-white transition hover:bg-[#10533e]"
          onClick={() => reset()}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={16} />
          Try again
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d7ded4] px-5 text-sm font-bold text-[#176b50] transition hover:bg-white"
          href="/"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
