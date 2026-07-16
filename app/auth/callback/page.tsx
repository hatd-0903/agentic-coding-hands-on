"use client";

/**
 * Client OAuth callback (client-only auth — no server route handler).
 *
 * The Supabase browser client (PKCE + `detectSessionInUrl: true`, see
 * lib/supabase/browser-client.ts) auto-exchanges the `?code=` query param on load.
 * This page just waits for that exchange to resolve into a session, then redirects:
 * - Google returned `?error=...` (denied/cancelled) → `/login?error=oauth` immediately.
 * - Session appears (via `getSession()` or `onAuthStateChange(SIGNED_IN)`) → `/homepage` (FR-H1).
 * - Neither happens within ~10s → treat as failure → `/login?error=oauth`.
 */
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

// Generous window so a slow PKCE exchange doesn't false-flash BR-005 before it resolves.
const SESSION_WAIT_TIMEOUT_MS = 10000;

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failed, setFailed] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      settledRef.current = true;
      router.replace("/login?error=oauth");
      return;
    }

    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    function settle(success: boolean) {
      if (settledRef.current || !isMounted) return;
      settledRef.current = true;
      if (success) {
        router.replace("/homepage");
      } else {
        setFailed(true);
        router.replace("/login?error=oauth");
      }
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) return;
        if (data.session) settle(true);
      })
      .catch(() => {
        // Ignore — onAuthStateChange or the timeout below will settle the outcome.
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        settle(true);
      }
    });

    const timeoutId = setTimeout(() => settle(false), SESSION_WAIT_TIMEOUT_MS);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per mount; params read at effect start.
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <p role="status" aria-live="polite">
        {failed ? "Redirecting..." : "Signing you in..."}
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center" />}>
      <CallbackContent />
    </Suspense>
  );
}
