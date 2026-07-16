"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { LoginWithGoogleButton } from "./login-with-google-button";

/**
 * Client container that wires the presentational login button to real Google
 * OAuth (client-only Supabase). Owns the SM-001 submitting/error state:
 * - click → `submitting` (button disabled + spinner), start Google OAuth redirect
 * - failure/cancel → BR-005 localized message, button back to idle
 * - a redirect back to `/login?error=oauth` (from the callback page) also surfaces BR-005
 *
 * Uses `useSearchParams` → must be rendered inside a <Suspense> boundary (LoginHero provides it).
 */
export function LoginAction() {
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [clickError, setClickError] = useState<string | undefined>(undefined);

  // OAuth failure/cancel comes back as /login?error=oauth (set by the callback page);
  // a failed click sets clickError. Either surfaces the localized BR-005 message.
  const errorMessage =
    clickError ?? (searchParams.get("error") === "oauth" ? t("oauthError") : undefined);

  async function handleLogin() {
    setSubmitting(true);
    setClickError(undefined);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        // Failed to even start the OAuth redirect — surface BR-005 and reset.
        setClickError(t("oauthError"));
        setSubmitting(false);
      }
      // On success the browser navigates to Google — keep `submitting` true.
    } catch {
      setClickError(t("oauthError"));
      setSubmitting(false);
    }
  }

  return (
    <LoginWithGoogleButton
      label={t("loginButton")}
      onClick={handleLogin}
      submitting={submitting}
      errorMessage={errorMessage}
    />
  );
}
