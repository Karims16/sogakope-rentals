"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const footerLinkClass =
  "text-sm text-slate-400 transition-colors hover:text-blue-400";

export default function Footer() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [newsletterNotice, setNewsletterNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    const authClient = supabase;
    let active = true;

    const { data: authListener } = authClient.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );

    async function checkUser() {
      try {
        const { data, error } = await authClient.auth.getSession();
        if (!active) return;
        if (error) {
          console.error("Unable to check footer account state:", error);
          setUser(null);
          return;
        }
        setUser(data.session?.user ?? null);
      } catch (error) {
        if (!active) return;
        console.error("Unable to check footer account state:", error);
        setUser(null);
      }
    }

    void checkUser();

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setNewsletterNotice("Newsletter sign-up is not available yet. Please contact us to request updates.");
    setEmail("");
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-900 px-6 py-12 text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 border-b border-slate-800 pb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
        <div className="mb-6 flex flex-col gap-4 md:mb-0 lg:col-span-1">
          <Link
            aria-label="Sogakope Rentals home"
            className="group flex items-center gap-2.5"
            href="/"
          >
            <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-slate-700/50 shadow-sm">
              <Image
                alt="Sogakope Rentals"
                className="object-cover"
                fill
                sizes="36px"
                src="/logo-round.png"
              />
            </span>
            <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
              Sogakope <span className="text-blue-500">Rentals</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            A local start for finding home across Sogakope and South Tongu.
          </p>
        </div>

        <nav aria-label="Explore renters" className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3">
            <li><Link className={footerLinkClass} href="/#homes">Browse Rentals</Link></li>
            <li><Link className={footerLinkClass} href="/about#how-it-works">How It Works</Link></li>
          </ul>
        </nav>

        <nav aria-label="Property owners">
          <h2 className="text-sm font-semibold text-white">Property Owners</h2>
          <ul className="mt-4 space-y-3">
            <li><Link className={footerLinkClass} href="/submit">Post a Property</Link></li>
            <li>
              {user ? (
                <Link className={footerLinkClass} href="/dashboard">My Listings</Link>
              ) : (
                <Link className={footerLinkClass} href="/auth/login">Landlord Login</Link>
              )}
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="text-sm font-semibold text-white">Company</h2>
          <ul className="mt-4 space-y-3">
            <li><Link className={footerLinkClass} href="/about">About Us</Link></li>
            <li><Link className={footerLinkClass} href="/faqs">FAQs</Link></li>
            <li><Link className={footerLinkClass} href="/contact">Contact Support</Link></li>
            <li><Link className={footerLinkClass} href="/privacy">Privacy &amp; Terms</Link></li>
          </ul>
        </nav>

        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-white">Stay Updated</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Get notified when new verified rooms are listed in Sogakope.
          </p>
          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={handleNewsletterSubmit}
          >
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              type="email"
              value={email}
            />
            <button
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
              type="submit"
            >
              Join
            </button>
          </form>
          {newsletterNotice && (
            <p className="mt-2 text-xs leading-5 text-slate-400" role="status">
              {newsletterNotice}{" "}
              <Link className="text-blue-400 hover:text-blue-300" href="/contact">
                Contact Support
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-8 text-center text-xs text-slate-500">
        © 2026 Sogakope Rentals. All rights reserved.
      </div>
    </footer>
  );
}
