import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Runs in Server Components, Server Actions and Route Handlers.
// Requests carry the signed-in user's session cookie, so Row Level Security
// applies to every query made with this client.
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env.local.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called while rendering a Server Component — the proxy refreshes
          // the session instead. Safe to ignore.
        }
      },
    },
  });
}
