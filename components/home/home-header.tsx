"use client";

/**
 * Sticky homepage header (MoMorph mms_A1_Header, node 2167:9091): brand mark +
 * nav on the left, notification bell / language switcher / account avatar on
 * the right. Semi-transparent dark bar over the hero art per the design
 * (`rgba(16,20,23,0.8)`).
 *
 * "About SAA 2025" is always rendered as the active nav link — this screen IS
 * that destination, matching the design's "Button-Selected state" snapshot.
 * The notification bell is presentational only (no panel wired — out of
 * scope per clarifications.md); the red dot mirrors the design's static
 * "has unread" badge.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/login/language-switcher";
import { AccountMenu } from "./account-menu";
import { BellIcon } from "./home-icons";
import { HEADER_NAV_LINKS, HomeNavLink, type NavKey } from "./nav-links";

/**
 * @param activeKey which nav item renders in the selected state. Defaults to
 *   "about" (the homepage IS the "About SAA 2025" destination); the awards page
 *   passes "awards", etc. — lets the same header serve every SAA page (DRY).
 */
export function HomeHeader({ activeKey = "about" }: { activeKey?: NavKey } = {}) {
  const t = useTranslations("home");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 bg-[rgba(16,20,23,0.8)] px-6 backdrop-blur-sm sm:px-10 lg:px-36">
      <div className="flex items-center gap-6 sm:gap-10 lg:gap-16">
        <Image
          src="/assets/login/sun-annual-awards-logo.png"
          alt="Sun* Annual Awards 2025"
          width={52}
          height={48}
          priority
          className="h-9 w-auto sm:h-10"
        />

        <nav className="hidden items-center gap-6 sm:flex lg:gap-8">
          {HEADER_NAV_LINKS.map((item) => (
            <HomeNavLink key={item.key} item={item} active={item.key === activeKey} />
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher />

        <button
          type="button"
          aria-label={t("notifications.label")}
          className="relative flex h-10 w-10 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
        >
          <BellIcon className="h-6 w-6" />
          <span aria-hidden="true" className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D4271D]" />
        </button>

        <AccountMenu />
      </div>
    </header>
  );
}
