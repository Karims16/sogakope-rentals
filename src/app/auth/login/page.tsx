import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage and post Sogakope Rentals listings.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page-shell py-20 text-center text-slate-600">Loading sign in...</main>}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
