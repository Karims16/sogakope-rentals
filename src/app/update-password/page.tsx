"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));
    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match. Please check them and try again.");
      return;
    }
    if (!supabase) {
      setErrorMessage("Authentication is unavailable because Supabase is not configured.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setNotice("Your password has been updated. Redirecting you to the home page...");
      window.setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Password update failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't update your password. Please request a new reset link and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Set a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a new password for your landlord or agent account.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            New password
            <input
              autoComplete="new-password"
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Confirm new password
            <input
              autoComplete="new-password"
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              minLength={6}
              name="confirmPassword"
              required
              type="password"
            />
          </label>

          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
          {notice && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
              {notice}
            </p>
          )}
          <button
            className="min-h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting || Boolean(notice)}
            type="submit"
          >
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
