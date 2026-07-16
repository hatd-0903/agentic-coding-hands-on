"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { setLocale } from "@/lib/i18n/set-locale";
import type { SupportedLocale } from "@/i18n/request";
import { LanguageSelector } from "./language-selector";

/**
 * Client container wiring the presentational language selector to the cookie-based
 * next-intl locale (FR-004 / SC-004): persists the pick via the `setLocale` server
 * action, then refreshes so all Server Components re-render in the new language.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleLocaleChange(code: string) {
    if (code === locale) return;
    startTransition(async () => {
      await setLocale(code as SupportedLocale);
      router.refresh();
    });
  }

  return <LanguageSelector locale={locale} onLocaleChange={handleLocaleChange} />;
}
