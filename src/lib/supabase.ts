import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseGlobal = typeof globalThis & {
  sogakopeSupabaseClient?: SupabaseClient;
};

function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable database features.",
      );
    }
    return null;
  }

  let projectUrl: URL;
  try {
    projectUrl = new URL(supabaseUrl);
  } catch (error) {
    console.error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL. Supabase features are disabled.",
      error,
    );
    return null;
  }

  if (/\/rest\/v1\/?$/i.test(projectUrl.pathname)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "NEXT_PUBLIC_SUPABASE_URL should be the project URL, not its /rest/v1 endpoint. Removing the trailing PostgREST path.",
      );
    }
    projectUrl.pathname = projectUrl.pathname.replace(/\/rest\/v1\/?$/i, "");
  }

  const globalForSupabase = globalThis as SupabaseGlobal;
  if (typeof window !== "undefined" && globalForSupabase.sogakopeSupabaseClient) {
    return globalForSupabase.sogakopeSupabaseClient;
  }

  const client = createClient(
    projectUrl.toString().replace(/\/$/, ""),
    supabaseAnonKey,
  );

  if (typeof window !== "undefined") {
    globalForSupabase.sogakopeSupabaseClient = client;
  }

  return client;
}

export const supabase = createSupabaseClient();
