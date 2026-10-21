import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell py-20 text-center sm:py-28">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
        <House aria-hidden="true" size={25} />
      </span>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#7b8982]">
        404 · Page not found
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#172b27] sm:text-4xl">
        This page isn’t here.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687672]">
        The link may be out of date, or the page may have moved. Let’s get you
        back to the marketplace.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#176b50] px-5 text-sm font-bold text-white transition hover:bg-[#10533e]"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to home
      </Link>
    </main>
  );
}
