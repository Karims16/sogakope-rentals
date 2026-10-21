import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Sogakope Rentals collects, uses, stores, and protects personal information.",
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
          Last updated: 21 October 2026
        </p>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#dce8df] bg-[#f3f8f2] p-4 text-sm leading-6 text-[#43564b]">
          <LockKeyhole
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#176b50]"
            size={18}
          />
          <p>
            This policy explains how Sogakope Rentals handles information when
            you browse listings, create an account, submit a listing or report,
            contact us, or subscribe to listing updates.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[#53625d]">
          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              1. Who is responsible
            </h2>
            <p className="mt-2">
              Sogakope Rentals operates an informational rental-listing
              directory for Sogakope and South Tongu, Ghana. For privacy
              questions or requests, contact us through our{" "}
              <Link className="font-semibold text-[#176b50] underline" href="/contact">
                contact page
              </Link>
              . Please include “Privacy request” in your message and tell us
              which email address or listing is involved. We may need to
              confirm your identity before acting on a request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              2. Information we collect
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Accounts:</strong> email address, authentication
                identifiers, and account details you provide, such as your
                name and WhatsApp number. Supabase Authentication manages
                sign-in and password recovery; we do not receive your
                plain-text password.
              </li>
              <li>
                <strong>Property listings:</strong> landlord or agent contact
                details, property title and description, location, rent and
                advance terms, facilities, availability, and photos you submit.
                Approved listings may display some of this information
                publicly.
              </li>
              <li>
                <strong>Reports and support:</strong> details you submit about
                a listing or through our contact form, which may include your
                name, email, phone number, and message.
              </li>
              <li>
                <strong>Listing-update subscriptions:</strong> your email
                address, used to send notifications about newly approved
                listings. We use Resend to deliver these emails.
              </li>
              <li>
                <strong>Usage information:</strong> Vercel Web Analytics may
                process website usage measurements, such as page views and
                referral or device information, to help us understand site
                performance. See Vercel’s privacy information for its current
                processing practices.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              3. How we use information
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To provide account access and password recovery.</li>
              <li>
                To review, publish, manage, and moderate property listings and
                reports.
              </li>
              <li>
                To connect prospective tenants with landlords or agents and
                deliver requested listing-update emails.
              </li>
              <li>
                To respond to support messages, protect the service, prevent
                misuse, and maintain or improve the website.
              </li>
            </ul>
            <p className="mt-2">
              We do not sell personal information. We do not use subscriber
              addresses for unrelated marketing. Please do not include
              unnecessary sensitive or financial information in public listing
              descriptions, images, reports, or support messages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              4. Service providers and disclosures
            </h2>
            <p className="mt-2">
              We use Supabase for database, file storage, and authentication;
              Resend to deliver support and listing-notification emails; and
              Vercel to host the website and provide Web Analytics. These
              providers process information to provide services to us, subject
              to their terms and privacy practices. Their infrastructure may
              process or store information outside Ghana. We may also disclose
              information when required by law or reasonably necessary to
              protect users, the service, or legal rights. We do not control
              information you choose to share directly with a landlord, agent,
              or another user.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              5. Public listings and your choices
            </h2>
            <p className="mt-2">
              Once a listing is approved, its property details and the contact
              information included for tenant enquiries may be visible to
              visitors. Do not submit details you are not comfortable making
              public. You can ask us to correct or remove a listing or update
              its contact information through the{" "}
              <Link className="font-semibold text-[#176b50] underline" href="/contact">
                contact page
              </Link>
              .
            </p>
            <p className="mt-2">
              You can stop listing-update emails by contacting us and
              requesting removal of your subscriber email. Each notification
              is sent as a listing update rather than a general marketing
              newsletter.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              6. Retention and deletion
            </h2>
            <p className="mt-2">
              We retain information for as long as reasonably necessary to
              provide the service, manage accounts and listings, address
              reports and support requests, maintain security, and meet legal
              obligations. Retention periods can differ by record type. When
              information is no longer needed, we will take reasonable steps
              to delete or de-identify it, subject to lawful retention needs
              and technical backup cycles.
            </p>
            <p className="mt-2">
              You may request access to, correction of, or deletion of
              information associated with you, including an account or
              subscription. Use the contact page. Deletion may not immediately
              remove copies already included in backups, records we must keep,
              or information another user has independently retained.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              7. Security
            </h2>
            <p className="mt-2">
              We use service-provider security features and access controls,
              including Supabase authentication and database permissions, and
              limit information use to operating the directory. We take
              reasonable steps to protect information, but no website,
              transmission, or storage system can be guaranteed completely
              secure. Keep your account credentials private and contact us
              promptly if you believe your account has been misused.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              8. Ghana’s Data Protection Act
            </h2>
            <p className="mt-2">
              We aim to handle personal data in accordance with the Data
              Protection Act, 2012 (Act 843) of Ghana, including its
              requirements concerning fair and lawful processing, purpose,
              data quality, openness, security safeguards, and data-subject
              rights. Subject to the Act and applicable exceptions, you may
              request access to or correction of your data, object to or
              restrict certain processing, and ask for information to be
              deleted where appropriate. You may also raise a concern with
              Ghana’s Data Protection Commission. This policy does not waive
              any rights provided by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#172b27]">
              9. Changes to this policy
            </h2>
            <p className="mt-2">
              We may update this policy when our services or legal
              responsibilities change. The “Last updated” date identifies the
              latest version. Material changes will be reflected on this page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
