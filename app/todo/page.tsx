"use client";

/**
 * Placeholder authenticated landing page. Gated client-side by `useRequireAuth`
 * (redirects to `/login` when no session — FR-003, BR-003). Actual feature scope for
 * `/todo` is out of scope for the login spec.
 */
import { useTranslations } from "next-intl";

import { useRequireAuth } from "@/lib/auth/use-auth-guard";

export default function TodoPage() {
  const { checking } = useRequireAuth();
  const t = useTranslations("todo");

  if (checking) {
    return <div className="flex-1 flex items-center justify-center" aria-hidden="true" />;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <p>{t("placeholder")}</p>
    </div>
  );
}
