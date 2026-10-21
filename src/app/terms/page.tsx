import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CircleAlert, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms for using Sogakope Rentals, an informational property-listing directory in South Tongu, Ghana.",
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
          Last updated: 21 October 2026
        </p>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-4 text-sm leading-6 text-[#635b49]">
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#a17b31]"
            size={18}
          />
          <p>
            Please read these terms before using the directory. By accessing
            Sogakope Rentals, you agree to use it lawfully and understand that
            rental decisions and arrangements are made directly between users.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#53625d]">
          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              1. What Sogakope Rentals does
            </h2>
            <p className="mt-2">
              Sogakope Rentals is an informational listing directory that
              helps prospective tenants discover properties and connect with
              property owners or agents, principally in Sogakope and South
              Tongu, Ghana. We are not a landlord, letting agent, broker,
              property manager, party to a tenancy, or payment intermediary.
              We do not negotiate or conclude rental agreements for users.
              Some clearly identified content may be illustrative rather than
              an actual available property.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              2. Listings, verification, and independent checks
            </h2>
            <p className="mt-2">
              Listings are supplied by owners or agents and may be reviewed
              before publication. A review, approval, “verified” label, or
              other moderation action is not a guarantee of identity,
              ownership, authority to rent, accuracy, availability, safety, or
              suitability. We do not independently inspect or certify every
              property or representation. Listings can become inaccurate or
              unavailable without notice.
            </p>
            <p className="mt-2">
              Prospective tenants are responsible for confirming the property,
              the advertiser’s identity and authority, current availability,
              rent and all other charges, the condition of the property, and
              the terms of any proposed agreement. Inspect the property in
              person or through someone you trust before making a commitment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              3. No payments through the directory
            </h2>
            <p className="mt-2">
              Sogakope Rentals does not collect, hold, transfer, or guarantee
              rent, deposits, advance payments, agency fees, or other
              transaction funds. Any payment or agreement made outside the
              directory is solely between the paying user and the recipient.
              We are not responsible for off-platform payments, payment
              instructions, refunds, or losses. Verify the recipient and
              payment terms independently, and obtain written receipts and
              agreements. Do not pay based only on online messages or photos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              4. Disclaimers and limits of responsibility
            </h2>
            <p className="mt-2">
              To the extent permitted by applicable law, the directory and its
              content are provided on an “as available” basis. We do not adopt
              or warrant landlord or agent representations, listing accuracy,
              property availability, title or rental authority, or the
              physical condition, safety, legality, or suitability of a
              property. We are not responsible for inspections, repairs,
              deposits, rent, tenancy agreements, eviction, or disputes between
              a tenant and an owner or agent.
            </p>
            <p className="mt-2">
              To the extent permitted by law, Sogakope Rentals is not liable
              for losses arising from user-provided listings, user
              interactions, physical property conditions, off-platform
              payments, or rental disputes. Nothing in these terms excludes
              liability or a right that cannot lawfully be excluded under
              Ghanaian law, including liability for fraud or wilful
              misconduct where it cannot be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              5. Rules for landlords and agents
            </h2>
            <p className="mt-2">
              By submitting a listing, you confirm that you are the owner or
              are authorised to advertise the property. You must:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Provide truthful, current descriptions, location, availability,
                facilities, photographs, and contact details.
              </li>
              <li>
                State rent, advance requirements, and other material charges
                accurately and update them when they change.
              </li>
              <li>
                Use a verified, reachable contact number and respond honestly
                and respectfully to enquiries.
              </li>
              <li>
                Remove or correct a listing promptly if it is unavailable or
                materially inaccurate.
              </li>
              <li>
                Not post fraudulent, duplicate, misleading, unlawful, or
                unauthorised listings, impersonate another person, or upload
                content you do not have permission to use.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              6. Rules for all users
            </h2>
            <p className="mt-2">
              You must use the directory lawfully and respectfully. Do not
              harass or threaten users, submit false reports, attempt to
              access accounts or systems without permission, interfere with
              the service, distribute malware, scrape or misuse contact
              information, or use the directory to facilitate fraud,
              discrimination prohibited by law, or other unlawful conduct.
              Do not rely on the directory as legal, financial, or property
              inspection advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              7. Moderation, suspension, and availability
            </h2>
            <p className="mt-2">
              We may review, decline, edit for clarity, restrict, or remove
              listings and may suspend access when we reasonably believe
              content violates these terms, creates risk, or must be removed
              by law. We may change, pause, or discontinue features and do not
              guarantee uninterrupted access or that a particular listing
              will remain published. Where practical, users should keep their
              own copies of agreements and important communications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              8. Privacy and changes to these terms
            </h2>
            <p className="mt-2">
              Our handling of personal information is described in the{" "}
              <Link className="font-semibold text-[#176b50] underline" href="/privacy">
                Privacy Policy
              </Link>
              . We may update these terms as the directory or applicable
              requirements change. The date above identifies the latest
              version. Continued use after an update means you accept the
              revised terms, to the extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              9. Governing law and contact
            </h2>
            <p className="mt-2">
              These terms are governed by the laws of Ghana, subject to
              applicable consumer protections and other mandatory legal
              requirements. Questions about these terms or a listing can be
              sent through our{" "}
              <Link className="font-semibold text-[#176b50] underline" href="/contact">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>

        <p className="mt-8 flex items-start gap-2 border-t border-[#edf0e9] pt-6 text-sm leading-6 text-[#687672]">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#176b50]"
            size={17}
          />
          Always inspect the property and independently verify the advertiser
          and payment recipient before paying rent or fees.
        </p>
      </article>
    </main>
  );
}
