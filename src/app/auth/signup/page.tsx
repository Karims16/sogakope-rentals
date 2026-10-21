import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an account to post and manage Sogakope Rentals listings.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="page-shell py-20 text-center text-slate-600">Loading sign up...</main>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
