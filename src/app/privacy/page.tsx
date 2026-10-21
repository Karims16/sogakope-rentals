import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Sogakope Rentals is designed to handle tenant, landlord, agent, and listing information.",
};

export default function PrivacyPage() {
  return (
    <main className="page-shell py-8 sm:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#53625d] transition hover:text-[#176b50]"
        href="/"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to Sogakope Rentals
      </Link>

      <article className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-[#e7e9e2] bg-white p-5 sm:mt-12 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7b8982]">
          Your information matters
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-[#172b27]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#87908a]">
          Last updated: 20 October 2026
        </p>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-4 text-sm leading-6 text-[#635b49]">
          <LockKeyhole
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#a17b31]"
            size={18}
          />
          <p>
            This is a draft notice and should receive legal review before
            launch. Property submissions and listing reports are sent to the
            configured Supabase database, and selected property photos are
            uploaded to its Storage service. The general contact form remains
            demo-only and is not transmitted. Avoid submitting information you
            do not want stored.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#53625d]">
          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              1. Information covered
            </h2>
            <p className="mt-2">
              Property submissions store the landlord or agent name, phone
              and WhatsApp numbers, property details, location, landmark,
              optional GhanaPost GPS address, amenities, rent, advance terms,
              and listing status. Reports store the reported property, reason,
              details, and reporter email. Selected photos are uploaded to
              Supabase Storage. Avoid placing sensitive personal information in
              a property description or photograph.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              2. Contact details and public listings
            </h2>
            <p className="mt-2">
              Phone and WhatsApp details are stored with a listing and may be
              displayed on its public detail page when the listing is
              approved and permitted by the database policies. Pending or
              rejected listings should not be publicly available. Anyone
              viewing contact details should use them only for a legitimate
              rental enquiry.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              3. Verification and moderation information
            </h2>
            <p className="mt-2">
              Information supplied for listing review, including submitted
              contact details, images, reported reasons, and moderation
              decisions, is intended to support safety, accuracy checks, and
              review of reported listings. A moderation record does not itself
              prove ownership or guarantee that a property is safe or
              available.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              4. How information may be used
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To display approved property listings to prospective tenants.</li>
              <li>To respond to enquiries or messages when contact services are enabled.</li>
              <li>To review submissions and investigate reports.</li>
              <li>To protect the marketplace from abuse, fraud, or technical issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              5. Storage, sharing, and security
            </h2>
            <p className="mt-2">
              Listing and report records are stored in the configured
              Supabase database, with access governed by its Row Level Security
              policies. Property photo storage and contact-form delivery are
              not connected. The operator must define retention and deletion
              periods, verify administrator access policies, and explain any
              hosting or service providers that process data. Information
              should not be sold or shared for unrelated advertising without
              an appropriate legal basis and notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              6. Your choices and questions
            </h2>
            <p className="mt-2">
              A process for access, correction, and deletion requests should
              be established before launch. No operational support email,
              office address, or data-request channel has been configured.
              The general contact form is a demo and does not send messages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              7. Updates
            </h2>
            <p className="mt-2">
              This notice may be updated as the marketplace is implemented.
              The effective date above should be updated when the policy
              changes.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
