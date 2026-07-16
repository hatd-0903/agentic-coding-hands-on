/**
 * Pure, framework-free countdown helpers (F002 — Prelaunch Countdown).
 * Kept separate from the React hook so the math is unit-testable in isolation.
 */

export interface CountdownUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Left-pad a non-negative integer to a 2-digit string (0 → "00", 5 → "05"). */
export function pad2(n: number): string {
  const safe = Math.max(0, Math.trunc(n));
  return safe.toString().padStart(2, "0");
}

/**
 * Break a remaining-seconds total into day/hour/minute/second units.
 * A negative total clamps to zero (BR-001) so the display never goes negative.
 */
export function secondsToUnits(totalSeconds: number): CountdownUnits {
  const total = Math.max(0, Math.trunc(totalSeconds));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
