"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Do tenants have to pay any registration or search fees?",
    answer:
      "No. Browsing listings, viewing contact numbers, and chatting with landlords directly on WhatsApp is 100% free. We do not charge registration fees or middleman agent markups.",
  },
  {
    question: "How do I know what water and electricity utilities a property has?",
    answer:
      "Every verified property card displays utility specs upfront, including whether water is sourced from Ghana Water (GWCL), a borehole, or polytank storage, as well as whether electricity is on an ECG prepaid or postpaid meter (personal vs. shared).",
  },
  {
    question: "Is it free for landlords to post a room or apartment?",
    answer:
      "Yes! Property owners and verified agents can create a free account, list vacant rooms with photos, and receive inquiries straight to their WhatsApp or phone.",
  },
  {
    question: "How long does it take for a submitted listing to go live?",
    answer:
      "All new submissions are reviewed by our team within 2 to 6 hours to verify the photos, GhanaPost GPS location, and landmark details before appearing publicly.",
  },
  {
    question: "How do I report a fake landlord or suspicious listing?",
    answer:
      "Every property details page features a 'Report this Listing' button. You can also send us a message via the Contact page or our support channels so we can review and take action immediately.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto max-w-4xl py-12 px-4 sm:px-6"
    >
      <header className="mb-7">
        <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
          Frequently Asked Questions
        </span>
        <h2
          className="text-2xl font-extrabold text-slate-900 md:text-3xl"
          id="faq-title"
        >
          Everything You Need to Know
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Clear answers for tenants searching for rooms and landlords listing
          homes in Sogakope.
        </p>
      </header>

      <div>
        {questions.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const answerId = `faq-answer-${index}`;

          return (
            <article
              className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all"
              key={question}
            >
              <h3>
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold text-slate-900"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  type="button"
                >
                  <span>{question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`shrink-0 text-blue-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    size={19}
                  />
                </button>
              </h3>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                id={answerId}
                role="region"
              >
                <div className="overflow-hidden">
                  <p className="p-5 pt-0 text-sm leading-relaxed text-slate-600">
                    {answer}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
