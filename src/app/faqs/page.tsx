import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about renting and listing properties in Sogakope.",
};

export default function FAQsPage() {
  return (
    <main className="page-shell py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          className="text-xs text-blue-600 hover:underline"
          href="/"
        >
          ← Back to Rentals
        </Link>
      </div>
      <FAQ />
    </main>
  );
}
