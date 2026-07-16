"use client";

/**
 * Hero section (MoMorph "Bìa" / mms_3.5_Keyvisual + Frame 487, node 2167:9030):
 * full-bleed keyvisual background, "ROOT FURTHER" logotype (reusing the login
 * screen's `hero-visual.png` — same asset, confirmed by matching 451x200
 * dimensions against the design's "MM_MEDIA_Root Further Logo" node), the
 * "Coming soon" subtitle + live countdown, event info block, and the two CTAs.
 *
 * "Coming soon" hides once the countdown reaches its target (FR-H2) — this
 * component runs its own `useCountdown` instance (cheap: a single per-minute
 * interval) purely to read `ended`, independently of `HomeCountdown` doing the
 * same for its own digit rendering.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useCountdown } from "@/lib/home/use-countdown";
import { HomeCountdown } from "./home-countdown";
import { PillButton } from "./pill-button";

export function HomeHero() {
  const t = useTranslations("home");
  const { ended, ready } = useCountdown();
  const showComingSoon = !ready || !ended;

  return (
    <section className="relative flex w-full flex-col items-start overflow-hidden bg-[#00101A] px-6 py-24 sm:px-12 sm:py-32 lg:px-36 lg:py-40">
      <Image
        src="/assets/home/keyvisual-bg.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(12deg,#00101A_23.7%,rgba(0,18,29,0.46)_38.34%,rgba(0,19,32,0)_48.92%)]"
      />

      <div className="relative z-10 flex w-full max-w-[1224px] flex-col items-start gap-10">
        <Image
          src="/assets/login/hero-visual.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          priority
          className="h-auto w-[220px] sm:w-[320px] lg:w-[400px]"
        />

        <div className="flex flex-col items-start gap-6">
          {showComingSoon && (
            <p className="text-xl font-bold text-white sm:text-2xl">{t("hero.comingSoon")}</p>
          )}
          <HomeCountdown />
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-14">
            <p className="text-sm font-bold text-white sm:text-base">
              {t("hero.timeLabel")} <span className="text-[#FFEA9E] sm:text-xl">26/12/2025</span>
            </p>
            <p className="text-sm font-bold text-white sm:text-base">
              {t("hero.placeLabel")} <span className="text-[#FFEA9E] sm:text-xl">Âu Cơ Art Center</span>
            </p>
          </div>
          <p className="text-sm font-bold text-white">{t("hero.livestreamNote")}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
          <PillButton href="/awards" variant="filled">
            {t("cta.aboutAwards")}
          </PillButton>
          <PillButton href="/kudos" variant="outline">
            {t("cta.aboutKudos")}
          </PillButton>
        </div>
      </div>
    </section>
  );
}
