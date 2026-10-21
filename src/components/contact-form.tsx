"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [submittedName, setSubmittedName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (!supabase) {
        setErrorMessage("Message delivery is temporarily unavailable. Please try again later.");
        return;
      }
      const { error: saveError } = await supabase
        .from("support_messages")
        .insert([{ name, email, message }]);
      if (saveError) {
        console.error("Unable to save support inquiry:", saveError);
        setErrorMessage("We couldn't record your message. Please try again.");
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!response.ok || !result.success) {
        setErrorMessage(
          `Your message was recorded, but email delivery failed. ${result.error ?? "Please try again later."}`,
        );
        return;
      }

      setSubmittedName(name);
      form.reset();
    } catch (error) {
      console.error("Unable to reach the contact service:", error);
      setErrorMessage("We couldn't send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {submittedName ? (
        <div
          aria-live="polite"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900"
          role="status"
        >
          <h2 className="text-lg font-bold">Thank you, {submittedName}!</h2>
          <p className="mt-2">
            Your message has been sent to the team. We will get back to you shortly.
          </p>
          <button
            className="mt-5 font-semibold text-emerald-900 underline underline-offset-4"
            onClick={() => {
              setSubmittedName("");
            }}
            type="button"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Send Us a Message
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Have a question, feedback, or need help? Send us a note and the
            Sogakope Rentals team will reach back out directly.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Full Name
              <input
                autoComplete="name"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                maxLength={100}
                name="name"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Your Email Address
              <input
                autoComplete="email"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                maxLength={254}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Your Message
              <textarea
                className="mt-1.5 min-h-36 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-normal leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                maxLength={3000}
                name="message"
                required
                rows={4}
              />
            </label>
            {errorMessage && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {errorMessage}
              </p>
            )}
            <button
              className="min-h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message →"}
            </button>
            <p className="text-center text-xs leading-5 text-slate-500">
              Your contact details are kept strictly private and used only to
              respond to your inquiry.
            </p>
            <p className="text-center text-xs text-slate-500">
              <Link className="hover:text-blue-600" href="/privacy">
                Read our privacy policy
              </Link>
            </p>
          </form>
        </>
      )}
    </section>
  );
}
