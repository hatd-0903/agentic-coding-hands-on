"use client";

/**
 * Countdown tiles (MoMorph mms_B1.3_Countdown, node 2167:9037): DAYS / HOURS /
 * MINUTES, each rendered as per-digit "glass" boxes (design's "Group 5"/"Group
 * 4" instances — gradient-glass rectangle + large digit).
 *
 * Consumes `useCountdown` directly (FR-H2) rather than taking values as props,
 * per the integration contract. Digits render as seven-segment LED glyphs via
 * the shared `SevenSegmentDigit` (same component as the `/` prelaunch page), so
 * the countdown style matches across screens.
 *
 * `!ready` (server render / first client paint) shows blank (unlit) cells to
 * avoid a hydration mismatch, since "now" can only be computed client-side.
 */
import { useCountdown } from "@/lib/home/use-countdown";
import { useTranslations } from "next-intl";

import { SevenSegmentDigit } from "@/components/countdown/seven-segment-digit";

function DigitBox({ children }: { children: string }) {
  return (
    <div className="flex h-[62px] w-10 items-center justify-center rounded-lg border border-[#FFEA9E]/50 bg-gradient-to-b from-white/60 to-white/10 text-white backdrop-blur-md sm:h-[72px] sm:w-[46px] lg:h-[82px] lg:w-[51px]">
      <SevenSegmentDigit digit={children} className="h-9 w-auto sm:h-11 lg:h-12" />
    </div>
  );
}

function CountdownTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex gap-2.5 sm:gap-3">
        {value.split("").map((digit, index) => (
          <DigitBox key={index}>{digit}</DigitBox>
        ))}
      </div>
      <span className="text-lg font-bold text-white sm:text-xl lg:text-2xl">{label}</span>
    </div>
  );
}

export function HomeCountdown() {
  const t = useTranslations("home");
  const { days, hours, minutes, ready } = useCountdown();

  const format = (value: number) => (ready ? value.toString().padStart(2, "0") : "--");

  return (
    <div role="timer" aria-live="polite" className="flex flex-row gap-8 sm:gap-10 lg:gap-10">
      <CountdownTile value={format(days)} label={t("countdown.days")} />
      <CountdownTile value={format(hours)} label={t("countdown.hours")} />
      <CountdownTile value={format(minutes)} label={t("countdown.minutes")} />
    </div>
  );
}
