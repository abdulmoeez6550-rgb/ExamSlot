import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role (secret key) client. This module must never be imported from
// client components — the guard below throws if it ever runs in a browser.
if (typeof window !== "undefined") {
  throw new Error(
    "The service-role Supabase client must never be loaded in the browser.",
  );
}

// Use ONLY inside verified server code (Server Actions / Route Handlers)
// after checking the caller's role with the auth DAL. Bypasses RLS by design.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY on the server. Check your environment variables.",
    );
  }
  return createSupabaseClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
