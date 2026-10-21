"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthFormProps = {
  mode: "login" | "signup";
};

function getSafeRedirect(value: string | null): string {
  return value === "/submit" || value === "/dashboard" ? value : "/dashboard";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const isSignup = mode === "signup";
  const redirectTo = getSafeRedirect(searchParams.get("next"));

  async function handlePasswordReset() {
    setErrorMessage("");
    setNotice("");

    const emailInput = emailInputRef.current;
    const email = emailInput?.value.trim() ?? "";
    if (!email || !emailInput?.validity.valid) {
      setErrorMessage("Enter a valid email address to reset your password.");
      emailInput?.focus();
      return;
    }
    if (!supabase) {
      setErrorMessage("Authentication is unavailable because Supabase is not configured.");
      return;
    }

    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setNotice("If an account exists for that email, a password reset link is on its way.");
    } catch (error) {
      console.error("Password reset request failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send a password reset email. Please try again.",
      );
    } finally {
      setIsSendingReset(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Authentication is unavailable because Supabase is not configured.");
      return;
    }

    setErrorMessage("");
    setNotice("");
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    try {
      if (isSignup) {
        const fullName = String(formData.get("fullName")).trim();
        const whatsappNumber = String(formData.get("whatsappNumber")).trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              whatsapp_number: whatsappNumber,
            },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/login?next=${encodeURIComponent(redirectTo)}`
                : undefined,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.replace(redirectTo);
          router.refresh();
        } else {
          setNotice("Account created. Check your email to confirm your address, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error("Authentication request failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't complete authentication. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          href="/#homes"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to Browse Homes
        </Link>
        <div className="mt-7 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <House aria-hidden="true" size={22} />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Landlord &amp; Agent Access
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Are you looking to rent a room? You do NOT need an account! Tenants
            can browse listings and contact landlords directly via WhatsApp for
            free. Accounts are only required for property owners posting and
            managing listings.
          </p>
          <p className="mt-3 text-xs font-semibold text-blue-700">
            {isSignup ? "Create an owner or agent account" : "Sign in to your owner or agent account"}
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input
                  autoComplete="name"
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  maxLength={100}
                  name="fullName"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                WhatsApp number
                <input
                  autoComplete="tel"
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  maxLength={20}
                  name="whatsappNumber"
                  placeholder="e.g. 024 123 4567"
                  required
                  type="tel"
                />
              </label>
            </>
          )}
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              autoComplete="email"
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              name="email"
              ref={emailInputRef}
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 px-3.5 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          {!isSignup && (
            <div className="-mt-2 text-right">
              <button
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-wait disabled:opacity-60"
                disabled={isSendingReset || isSubmitting}
                onClick={handlePasswordReset}
                type="button"
              >
                {isSendingReset ? "Sending reset link..." : "Forgot password?"}
              </button>
            </div>
          )}

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
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          {isSignup ? "Already have an account?" : "New to Sogakope Rentals?"}{" "}
          <Link
            className="font-semibold text-blue-600 hover:text-blue-700"
            href={`${isSignup ? "/auth/login" : "/auth/signup"}?next=${encodeURIComponent(redirectTo)}`}
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
