"use client";

/**
 * Awards page hero (MoMorph "Bìa" → KV + mms_A_Title, node 313:8449 /
 * 313:8453): a shorter ROOT FURTHER keyvisual than the homepage hero (no
 * countdown/event-info/CTAs) capped by the caption + divider + gold page
 * title block — the same caption/divider/title recipe as the homepage's
 * `AwardsSection` header, reused here via the `awardsPage` i18n namespace.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

export function AwardHeroBanner() {
  const t = useTranslations("awardsPage");

  return (
    <section className="relative flex w-full flex-col items-start overflow-hidden bg-[#00101A] px-6 py-16 sm:px-12 sm:py-20 lg:px-36 lg:py-24">
      <Image src="/assets/home/keyvisual-bg.png" alt="" fill priority aria-hidden="true" className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(12deg,#00101A_23.7%,rgba(0,18,29,0.46)_38.34%,rgba(0,19,32,0)_48.92%)]"
      />

      <div className="relative z-10 flex w-full max-w-[1152px] flex-col items-start gap-10">
        <Image
          src="/assets/login/hero-visual.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          priority
          className="h-auto w-[160px] sm:w-[220px] lg:w-[280px]"
        />

        <div className="flex w-full flex-col gap-4">
          <p className="text-base font-bold text-white sm:text-lg">{t("caption")}</p>
          <div className="h-px w-full bg-[#2E3940]" />
          <h1 className="text-3xl font-bold text-[#FFEA9E] sm:text-4xl lg:text-[57px]">{t("title")}</h1>
        </div>
      </div>
    </section>
  );
}
