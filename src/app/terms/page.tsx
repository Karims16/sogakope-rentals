import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CircleAlert, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Sogakope Rentals terms for tenants, landlords, and property agents in South Tongu, Ghana.",
};

export default function TermsPage() {
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
          Sogakope Rentals · Ghana
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-[#172b27]">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#87908a]">
          Last updated: 20 October 2026
        </p>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-4 text-sm leading-6 text-[#635b49]">
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#a17b31]"
            size={18}
          />
          <p>
            These terms are a plain-language service notice for this preview,
            not legal advice. Have the final terms reviewed for applicable
            Ghanaian law before operating a live rental marketplace.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#53625d]">
          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              1. About this service
            </h2>
            <p className="mt-2">
              Sogakope Rentals is intended to help tenants discover rental
              listings and connect with landlords and property agents in
              Sogakope and South Tongu, Volta Region. Some homes and prices
              are illustrative demo content. Listing submissions, reports,
              and moderation actions use Supabase when database access is
              configured and permitted by its security policies. The general
              contact form and image uploads are not connected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              2. Rental listing disclaimer
            </h2>
            <p className="mt-2">
              The marketplace is intended to introduce users to one another.
              Unless a listing is specifically identified as verified through
              an active verification process, we do not represent or guarantee
              that a property exists, is available, is accurately described, or
              is owned or lawfully offered by the person advertising it. A
              review badge or publication decision is not a guarantee of title,
              property condition, safety, or legal authority to rent.
            </p>
            <p className="mt-2">
              Users should independently confirm all rent, advance, utility,
              agency, and other charges directly with the relevant parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              3. Landlord and agent responsibilities
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Only advertise properties you own or are authorised to offer.
              </li>
              <li>
                Provide accurate, current information about location, rent,
                advance requirements, facilities, and availability.
              </li>
              <li>
                Use genuine photographs that represent the property and do not
                mislead prospective tenants.
              </li>
              <li>
                Keep contact information current and respond respectfully to
                enquiries.
              </li>
              <li>
                Do not discriminate unlawfully, impersonate another person, or
                use the service to facilitate fraud or unlawful activity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              4. Tenant safety and payments
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Inspect the property in person, or through a trusted
                representative, before paying advance rent or other fees.
              </li>
              <li>
                Confirm the identity and authority of the landlord or agent and
                verify the rental agreement and payment recipient.
              </li>
              <li>
                Do not send money based only on online photographs, messages,
                or promises of future access.
              </li>
              <li>
                Request written receipts and keep copies of agreements and
                payment records.
              </li>
              <li>
                Meet in a safe place, tell someone you trust where you are
                going, and report suspicious conduct through a verified
                support channel.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              5. Reports, moderation, and availability
            </h2>
            <p className="mt-2">
              The service is intended to review reports and remove or restrict
              listings when appropriate. We do not guarantee continuous
              availability of listings or the service. Reports and listing
              moderation are subject to the database permissions and
              administrator access configured for the service. Review status
              and rejection notes are not persisted in the current schema.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              6. Limitation and changes
            </h2>
            <p className="mt-2">
              To the extent permitted by applicable law, use of the service is
              at your own discretion and users are responsible for their own
              checks, communications, and rental arrangements. These terms may
              change as the service develops. The applicable version should be
              reviewed before using a live service.
            </p>
          </section>
        </div>

        <p className="mt-8 flex items-start gap-2 border-t border-[#edf0e9] pt-6 text-sm leading-6 text-[#687672]">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#176b50]"
            size={17}
          />
          Never pay advance rent before you have independently inspected the
          property and verified the person receiving payment.
        </p>
      </article>
    </main>
  );
}
