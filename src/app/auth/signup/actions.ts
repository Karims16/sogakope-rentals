"use server";

import { createClient } from "@supabase/supabase-js";
import { isPasswordValid } from "@/lib/password-validation";

type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  whatsappNumber: string;
  emailRedirectTo: string;
};

type SignUpResult =
  | { success: false; error: string }
  | {
      success: true;
      session?: { access_token: string; refresh_token: string };
    };

export async function signUpLandlord({
  email,
  password,
  fullName,
  whatsappNumber,
  emailRedirectTo,
}: SignUpInput): Promise<SignUpResult> {
  if (!isPasswordValid(password)) {
    return {
      success: false,
      error: "Password must meet all listed requirements.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error: "Authentication is unavailable because Supabase is not configured.",
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        whatsapp_number: whatsappNumber,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      },
      emailRedirectTo,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      : undefined,
  };
}
