"use client";

import { useEffect, useState } from "react";

import { secondsToUnits, type CountdownUnits } from "./format-countdown";

export interface CountdownState extends CountdownUnits {
  isComplete: boolean;
}

/**
 * Ticks a fixed-duration countdown once per second (FR-002).
 *
 * - Seeded synchronously via a lazy `useState` initializer so the server render
 *   and first client render agree — no hydration mismatch (NFR-001).
 * - Clamps at zero and self-clears the interval once complete (BR-001).
 * - Clears the interval on unmount, so the tick callback can never run — and
 *   thus never redirect — after the component is gone (BR-002).
 */
export function useCountdown(totalSeconds: number): CountdownState {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.trunc(totalSeconds)));

  useEffect(() => {
    // `remaining` here is the mount-time seed; nothing to run if it starts at zero.
    if (remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fixed-duration timer set up once per mount; the interval self-manages via the functional update.
  }, []);

  return { ...secondsToUnits(remaining), isComplete: remaining <= 0 };
}
