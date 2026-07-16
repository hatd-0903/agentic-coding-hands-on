/**
 * Server action to persist the selected UI language.
 *
 * Writes the `NEXT_LOCALE` cookie that `i18n/request.ts` reads to resolve locale
 * (cookie-based next-intl, no `[locale]` URL segment). Non-sensitive preference cookie:
 * not `httpOnly` so a client-side selector could also read it if ever needed, `sameSite=lax`.
 *
 * Caller contract: after invoking this action, the caller must refresh the current
 * route (e.g. `router.refresh()`) so Server Components re-render with the new locale —
 * this action only sets the cookie, it does not trigger a re-render itself.
 */
"use server";

import { cookies } from "next/headers";

import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, type SupportedLocale } from "@/i18n/request";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLocale(locale: SupportedLocale): Promise<void> {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}. Expected one of: ${SUPPORTED_LOCALES.join(", ")}`);
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_IN_SECONDS,
    });
  } catch (error) {
    // Surface a clear error rather than silently failing to persist the preference —
    // the caller (language selector) should catch this and can retry or no-op.
    throw new Error(
      `Failed to persist locale cookie "${LOCALE_COOKIE_NAME}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
