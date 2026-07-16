/**
 * next-intl request config — cookie-based locale, "without i18n routing" mode.
 *
 * No `[locale]` URL segment: `/login` and `/todo` stay clean. Locale is resolved from
 * the `NEXT_LOCALE` cookie (server-read via `await cookies()`, Next 16 async API),
 * defaulting to Vietnamese per BR-006.
 */
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "vi";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export default getRequestConfig(async () => {
  let cookieLocale: string | undefined;

  try {
    const cookieStore = await cookies();
    cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  } catch {
    // cookies() can throw outside a request context (e.g. during certain build steps);
    // fall back to the default locale rather than failing the render.
    cookieLocale = undefined;
  }

  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
