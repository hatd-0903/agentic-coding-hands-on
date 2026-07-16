"use client";

/**
 * Shared nav-link config + presentational link for the Homepage SAA header
 * (mms_A1) and footer (mms_7) — both render the same "About SAA 2025 / Awards
 * Information / Sun* Kudos" set; the footer adds a 4th "Tiêu chuẩn chung"
 * entry. Hrefs are stubs (FR-H5): `/awards` and `/kudos` are placeholder
 * routes not built in this task; "standards" has no route at all in the
 * design, so it stubs to a same-page hash anchor.
 */
import Link from "next/link";
import { useTranslations } from "next-intl";

export type NavKey = "about" | "awards" | "kudos" | "standards";

export interface NavLinkItem {
  key: NavKey;
  href: string;
}

export const HEADER_NAV_LINKS: NavLinkItem[] = [
  { key: "about", href: "/homepage" },
  { key: "awards", href: "/awards" },
  { key: "kudos", href: "/kudos" },
];

export const FOOTER_NAV_LINKS: NavLinkItem[] = [...HEADER_NAV_LINKS, { key: "standards", href: "#standards" }];

export interface HomeNavLinkProps {
  item: NavLinkItem;
  /** Highlights the link as the current page (design's "Button-Selected state"). */
  active?: boolean;
}

/**
 * A single nav entry. The active link gets the design's gold underline + glow
 * text-shadow (mms_A1.2_Button-Selected state); others render as plain white
 * text with a hover tint (mms_A1.3/A1.5 hover/normal states collapsed into a
 * single CSS `:hover`, since a static page can't show both states at once).
 */
export function HomeNavLink({ item, active = false }: HomeNavLinkProps) {
  const t = useTranslations("home");

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "border-b border-[#FFEA9E] pb-1 text-sm font-bold text-[#FFEA9E] [text-shadow:0_0_6px_#FAE287] transition-colors sm:text-base"
          : "pb-1 text-sm font-bold text-white transition-colors hover:text-[#FFEA9E] sm:text-base"
      }
    >
      {t(`nav.${item.key}`)}
    </Link>
  );
}
