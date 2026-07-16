"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCountdown } from "@/lib/countdown/use-countdown";
import { pad2 } from "@/lib/countdown/format-countdown";
import { CountdownUnit } from "./countdown-unit";

// Fixed prelaunch duration: 60 seconds from mount (per clarifications.md — no API).
const COUNTDOWN_SECONDS = 60;

/**
 * Client countdown container (F002): runs the fixed 60s countdown, renders the
 * localized title + the three LED units (DAYS/HOURS/MINUTES, per MoMorph
 * 8PJQswPZmU — no seconds), and redirects to /login exactly once when the
 * countdown completes (FR-004). The redirect is guarded by a ref so React
 * StrictMode's double-invoked effect (dev) navigates only once (BR-001).
 */
export function CountdownTimer() {
  const t = useTranslations("countdown");
  const router = useRouter();
  const { days, hours, minutes, isComplete } = useCountdown(COUNTDOWN_SECONDS);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isComplete && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/login");
    }
  }, [isComplete, router]);

  const units = [
    { key: "days", value: pad2(days), label: t("days") },
    { key: "hours", value: pad2(hours), label: t("hours") },
    { key: "minutes", value: pad2(minutes), label: t("minutes") },
  ];

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1 className="text-xl font-semibold text-white sm:text-2xl">{t("title")}</h1>
      <div className="flex items-start justify-center gap-4 sm:gap-8">
        {units.map((unit) => (
          <CountdownUnit key={unit.key} value={unit.value} label={unit.label} />
        ))}
      </div>
    </div>
  );
}
