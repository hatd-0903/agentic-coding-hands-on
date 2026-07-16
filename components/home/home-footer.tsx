"use client";

/**
 * Homepage footer (MoMorph mms_7_Footer, node 5001:14800): brand mark + nav
 * links (About / Awards / Kudos / Standards) on the left, copyright on the
 * right. Unlike the login screen's footer, this one flows in the page (not
 * `fixed`) — it sits at the end of a long scroll, not pinned to the viewport.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { FOOTER_NAV_LINKS, HomeNavLink } from "./nav-links";

export function HomeFooter() {
  const t = useTranslations("home");

  return (
    <footer className="flex w-full flex-col items-center gap-6 border-t border-[#2E3940] px-6 py-10 sm:flex-row sm:justify-between sm:px-10 lg:px-[90px]">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10 lg:gap-20">
        <Image
          src="/assets/login/sun-annual-awards-logo.png"
          alt="Sun* Annual Awards 2025"
          width={52}
          height={48}
          className="h-12 w-auto"
        />

        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12">
          {FOOTER_NAV_LINKS.map((item) => (
            <HomeNavLink key={item.key} item={item} />
          ))}
        </nav>
      </div>

      <p className="text-xs font-bold tracking-wide text-white sm:text-sm">{t("footer.copyright")}</p>
    </footer>
  );
}
