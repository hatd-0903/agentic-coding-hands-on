"use client";

/**
 * Client-side auth guard hooks (client-only auth — no proxy/middleware).
 *
 * Enforces the binary auth gate in the browser via the Supabase session:
 * - `useRedirectIfAuthed` — for `/login`: authed session → redirect away (FR-002, BR-002).
 * - `useRequireAuth` — for protected pages (`/homepage`, `/todo`): no session →
 *   redirect to login (FR-003, BR-003, FR-H1).
 *
 * This is UX-level gating, NOT a security boundary (client-only decision, see
 * plans/260716-1143-login-page-supabase/clarifications.md). Both hooks expose
 * `{ checking }` so callers can render a loading state and avoid a flash of
 * gated/ungated content before the session check resolves.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type GuardResult = { checking: boolean };

function useSessionRedirect(shouldRedirect: (session: Session | null) => boolean, to: string): GuardResult {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    async function evaluate(session: Session | null) {
      if (!isMounted) return;
      if (shouldRedirect(session)) {
        router.replace(to);
        // Keep `checking = true` — we're navigating away, no need to flash content.
        return;
      }
      setChecking(false);
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          // Treat a session-fetch error as "no session" so the guard fails safe
          // (redirects to the more restrictive route) rather than hanging forever.
          evaluate(null);
          return;
        }
        evaluate(data.session);
      })
      .catch(() => {
        evaluate(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      evaluate(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // `to`/`shouldRedirect` are stable per call site (default params) and `router` is
    // stable; the guard is meant to run once on mount, so empty deps are intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { checking };
}

/** For `/login`: an authenticated session redirects away to `to` (default `/homepage`, FR-H1). */
export function useRedirectIfAuthed(to = "/homepage"): GuardResult {
  return useSessionRedirect((session) => session != null, to);
}

/** For protected pages: no session redirects to `to` (default `/login`). */
export function useRequireAuth(to = "/login"): GuardResult {
  return useSessionRedirect((session) => session == null, to);
}
