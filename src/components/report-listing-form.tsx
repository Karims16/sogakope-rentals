"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Flag, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReportListingFormProps = {
  propertyId: string;
  isDemo?: boolean;
};

const reportReasons = [
  "Already rented out",
  "Incorrect price or details",
  "Suspicious / Potential scam",
  "Landlord unreachable",
  "Other",
];

export default function ReportListingForm({
  propertyId,
  isDemo = false,
}: ReportListingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function closeModal() {
    if (isSubmitting) return;
    setIsOpen(false);
    setMessage("");
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsSuccess(false);

    if (isDemo) {
      setMessage("This is a demo listing, so your report was not sent or stored.");
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    if (!supabase) {
      setMessage("Reporting is temporarily unavailable. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("property_reports").insert({
        property_id: propertyId,
        reason,
        details: details.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: reporterPhone.trim() || null,
      });

      if (error) {
        console.error("Property report submission failed:", error.message);
        setMessage("We couldn't send your report. Please try again later.");
        return;
      }

      setMessage("Thank you. Our moderation team will verify this listing.");
      setIsSuccess(true);
      setReason("");
      setDetails("");
      setContactEmail("");
      setReporterPhone("");
    } catch (error) {
      console.error("Unable to reach the report service:", error);
      setMessage("Reporting is temporarily unavailable. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#687672] transition hover:bg-[#f5f6f1] hover:text-[#176b50]"
        onClick={() => {
          setIsOpen(true);
          setMessage("");
          setIsSuccess(false);
        }}
        type="button"
      >
        <Flag aria-hidden="true" size={14} />
        Report listing
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#172b27]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            aria-labelledby="report-listing-title"
            aria-modal="true"
            className="my-auto w-full max-w-lg rounded-[24px] border border-[#e7e9e2] bg-white p-5 shadow-2xl sm:p-7"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#fff3dc] text-[#9b6b1e]">
                  <AlertTriangle aria-hidden="true" size={19} />
                </span>
                <h2
                  className="mt-3 text-xl font-bold text-[#172b27]"
                  id="report-listing-title"
                >
                  Report listing
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#687672]">
                  Help our moderation team verify this property.
                </p>
              </div>
              <button
                aria-label="Close report form"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#687672] transition hover:bg-[#f5f6f1]"
                onClick={closeModal}
                type="button"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-[#33413b]">
                Reason
                <select
                  className="mt-1.5 block min-h-11 w-full rounded-xl border border-[#d9ddcf] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  onChange={(event) => setReason(event.target.value)}
                  required
                  value={reason}
                >
                  <option value="">Choose a reason</option>
                  {reportReasons.map((reportReason) => (
                    <option key={reportReason} value={reportReason}>
                      {reportReason}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-[#33413b]">
                Extra notes <span className="font-normal text-[#87908a]">(Optional)</span>
                <textarea
                  className="mt-1.5 block min-h-24 w-full rounded-xl border border-[#d9ddcf] bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  maxLength={2000}
                  onChange={(event) => setDetails(event.target.value)}
                  value={details}
                />
              </label>
              <label className="block text-sm font-semibold text-[#33413b]">
                Phone number <span className="font-normal text-[#87908a]">(Optional)</span>
                <input
                  autoComplete="tel"
                  className="mt-1.5 block min-h-11 w-full rounded-xl border border-[#d9ddcf] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  maxLength={20}
                  onChange={(event) => setReporterPhone(event.target.value)}
                  type="tel"
                  value={reporterPhone}
                />
              </label>
              <label className="block text-sm font-semibold text-[#33413b]">
                Email for follow-up <span className="font-normal text-[#87908a]">(Optional)</span>
                <input
                  autoComplete="email"
                  className="mt-1.5 block min-h-11 w-full rounded-xl border border-[#d9ddcf] bg-white px-3 text-sm font-normal outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/15"
                  maxLength={254}
                  onChange={(event) => setContactEmail(event.target.value)}
                  type="email"
                  value={contactEmail}
                />
              </label>
              {message && (
                <p
                  aria-live="polite"
                  className={`flex items-start gap-2 text-sm leading-6 ${
                    isSuccess ? "text-[#176b50]" : "text-[#a13d32]"
                  }`}
                  role={isSuccess ? "status" : "alert"}
                >
                  {isSuccess && (
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 shrink-0"
                      size={16}
                    />
                  )}
                  {message}
                </p>
              )}
              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  className="min-h-11 rounded-full border border-[#d7ded4] px-5 text-sm font-bold text-[#53625d] transition hover:bg-[#f2f6ee] disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="min-h-11 rounded-full bg-[#176b50] px-5 text-sm font-bold text-white transition hover:bg-[#10533e] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting || isSuccess}
                  type="submit"
                >
                  {isSubmitting ? "Sending report…" : "Submit report"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
