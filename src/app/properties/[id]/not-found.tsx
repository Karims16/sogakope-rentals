import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <main className="page-shell py-20 text-center sm:py-28">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#edf3e8] text-[#176b50]">
        <House aria-hidden="true" size={25} />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-[#172b27]">
        Listing not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687672]">
        This listing may have been removed or is not available to the public.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#176b50] px-5 text-sm font-bold text-white transition hover:bg-[#10533e]"
        href="/#homes"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Browse homes
      </Link>
    </main>
  );
}
