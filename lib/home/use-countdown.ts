"use client";

/**
 * Live event countdown hook (FR-H2).
 *
 * Computes the time remaining until the SAA 2025 event start, read from
 * `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601), and re-evaluates every minute.
 *
 * - Values are whole DAYS / HOURS / MINUTES remaining (floored).
 * - At or after the target → `{ days: 0, hours: 0, minutes: 0, ended: true }`.
 * - Missing / unparseable target → same "ended" fallback, no crash (test ID-60).
 * - `ready` is false on the server and the very first client render, then true
 *   after mount — callers gate on it to avoid a hydration mismatch (the server
 *   has no reliable "now", so the countdown is a client-only computation).
 */
import { useEffect, useState } from "react";

/** Fallback event datetime when the env var is unset (design shows 26/12/2025 18h30, GMT+7). */
export const DEFAULT_EVENT_DATETIME = "2025-12-26T18:30:00+07:00";

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  ended: boolean;
  /** True once the value has been computed on the client (post-mount). */
  ready: boolean;
};

const ENDED: Omit<Countdown, "ready"> = { days: 0, hours: 0, minutes: 0, ended: true };

/**
 * Pure remaining-time calculation. Exported for direct unit testing without a
 * React render. Returns the "ended" fallback for an invalid or past target.
 */
export function computeRemaining(targetIso: string, now: number): Omit<Countdown, "ready"> {
  const target = Date.parse(targetIso);
  if (Number.isNaN(target)) return ENDED;

  const diff = target - now;
  if (diff <= 0) return ENDED;

  return {
    days: Math.floor(diff / MS_PER_DAY),
    hours: Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE),
    ended: false,
  };
}

export function useCountdown(
  targetIso: string = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? DEFAULT_EVENT_DATETIME
): Countdown {
  const [state, setState] = useState<Countdown>({ ...ENDED, ended: false, ready: false });

  useEffect(() => {
    function tick() {
      setState({ ...computeRemaining(targetIso, Date.now()), ready: true });
    }
    tick(); // compute immediately on mount
    const id = setInterval(tick, MS_PER_MINUTE);
    return () => clearInterval(id);
  }, [targetIso]);

  return state;
}
