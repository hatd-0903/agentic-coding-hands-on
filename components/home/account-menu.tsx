"use client";

/**
 * Header avatar → dropdown menu (mms_A1.8_Button-IC + design's user-profile
 * icon; no profile-picture asset in the design, so the default user icon is
 * used as the trigger). Per clarifications.md ("Presentational + essentials"):
 * - Profile: stub link (out of scope — no /profile page built here).
 * - Sign out: real behavior (FR-H4) — Supabase `signOut()` then redirect to
 *   `/login`. Wrapped in try/catch: a failed sign-out is non-fatal for UX
 *   (session simply stays active so the user can retry); there is no
 *   error-surface spec at this stub level.
 * - Admin Dashboard: always rendered per spec, but disabled/no-op (out of
 *   scope — no admin role in this task).
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { UserIcon } from "./home-icons";

const MENU_ITEM_CLASS = "block w-full px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/10";

export function AccountMenu() {
  const t = useTranslations("home");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
    } catch {
      setSigningOut(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("account.menuLabel")}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-[#998C5F] text-white transition-colors hover:bg-white/10"
      >
        <UserIcon className="h-6 w-6" />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-md bg-[#0f1a2b] py-1 shadow-lg ring-1 ring-white/10"
        >
          <li role="none">
            <a role="menuitem" href="/profile" className={MENU_ITEM_CLASS}>
              {t("account.profile")}
            </a>
          </li>
          <li role="none">
            <button role="menuitem" type="button" onClick={handleSignOut} disabled={signingOut} className={MENU_ITEM_CLASS}>
              {t("account.signOut")}
            </button>
          </li>
          <li role="none">
            <button
              role="menuitem"
              type="button"
              disabled
              aria-disabled="true"
              title={t("account.adminDashboard")}
              className={`${MENU_ITEM_CLASS} cursor-not-allowed opacity-50 hover:bg-transparent`}
            >
              {t("account.adminDashboard")}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
