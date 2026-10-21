import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Filter, MessageCircle, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Browse local rentals, contact landlords directly, and inspect a property in South Tongu.",
};

const steps = [
  {
    title: "Browse & Filter",
    description:
      "Find a place that fits by filtering listings for local utilities, water source, and ECG meter type.",
    Icon: Filter,
  },
  {
    title: "Contact Landlords Directly",
    description:
      "Start an instant WhatsApp chat or call the landlord directly, with zero middleman agents.",
    Icon: MessageCircle,
  },
  {
    title: "Inspect & Move In",
    description:
      "Use GhanaPost GPS and verified landmarks to locate the property, then inspect it before making a decision.",
    Icon: MapPin,
  },
];

export default function HowItWorksPage() {
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
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
          A simpler rental search
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-slate-900 sm:text-5xl">
          How It Works
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Find a local listing, get in touch with the landlord, and make sure
          the property is right for you.
        </p>
      </header>

      <ol className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {steps.map(({ title, description, Icon }, index) => (
          <li
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7"
            key={title}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-600">
                0{index + 1}
              </span>
              <Icon aria-hidden="true" className="text-blue-600" size={20} />
            </div>
            <h2 className="mt-6 text-lg font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 flex max-w-5xl flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          href="/#homes"
        >
          Browse rentals
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href="/about"
        >
          About Sogakope Rentals
        </Link>
      </div>
    </main>
  );
}
