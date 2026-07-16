"use client";

/**
 * Floating quick-action widget (MoMorph mms_6_Widget Button, node 5022:15169):
 * a yellow pill with a pen icon and the Kudos mark. No-op per
 * clarifications.md ("widget quick-action menu ... no-op/stubbed" — out of
 * scope for this task).
 *
 * Design deviation: the Figma node sits at a fixed canvas offset within the
 * hero's coordinate space, but a quick-action widget is conventionally a
 * viewport-fixed floating action button on a real scrolling page — rendered
 * here as `fixed bottom-6 right-6` instead of matching the raw canvas
 * position, which would place it mid-hero and scroll away with the content.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { PenIcon } from "./home-icons";

export function WidgetButton() {
  const t = useTranslations("home");

  return (
    <button
      type="button"
      aria-label={t("widget.label")}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#FFEA9E] px-4 py-4 text-[#00101A] shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287] transition-transform hover:scale-105"
    >
      <PenIcon className="h-6 w-6" />
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        /
      </span>
      <Image src="/assets/home/kudos-icon-small.svg" alt="" width={20} height={18} className="h-[18px] w-5" />
    </button>
  );
}
