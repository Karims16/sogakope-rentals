import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, House, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Sogakope Rentals supports renters and landlords across South Tongu.",
};

export default function AboutPage() {
  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to Sogakope Rentals
      </Link>

      <header className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <House aria-hidden="true" size={22} />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
          Rooted in South Tongu
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-slate-900 sm:text-5xl">
          A more local way to find home.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Empowering South Tongu renters and landlords with verified listings,
          accurate utility details, and transparent pricing.
        </p>
      </header>

      <section className="mx-auto mt-12 max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <MapPin aria-hidden="true" size={19} />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-[-0.04em] text-slate-900">
          Built for our community
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          We focus on rentals in Sogakope and neighbouring South Tongu
          communities. By making local property information easier to find and
          helping renters connect directly with landlords, Sogakope Rentals
          aims to make the search more straightforward for everyone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            href="/#homes"
          >
            Browse rentals
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            href="/submit"
          >
            List a property
          </Link>
        </div>
      </section>
    </main>
  );
}
