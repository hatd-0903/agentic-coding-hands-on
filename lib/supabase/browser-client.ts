/**
 * Browser-only Supabase client (singleton).
 *
 * Client-only auth: session lives in the browser (localStorage), auto-refreshed by
 * supabase-js. PKCE flow + `detectSessionInUrl: true` lets the OAuth callback page
 * (`app/auth/callback/page.tsx`) auto-exchange the `?code=` query param on load.
 *
 * There is no server/SSR Supabase client in this project (client-only auth decision —
 * see plans/260716-1143-login-page-supabase/clarifications.md).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: SupabaseClient | undefined;

/**
 * Returns a memoized singleton Supabase browser client. Throws a clear error if the
 * required `NEXT_PUBLIC_` env vars are missing, since a silently-misconfigured client
 * would fail confusingly deep inside auth calls.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Supabase browser env vars: NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must both be set. Check .env.local " +
        "against .env.example."
    );
  }

  browserClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}
