import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { computeRemaining, useCountdown, DEFAULT_EVENT_DATETIME } from "./use-countdown";

describe("computeRemaining", () => {
  const now = Date.parse("2025-12-20T10:00:00+07:00");

  it("computes whole days/hours/minutes remaining (floored)", () => {
    // target is 6 days, 8 hours, 30 minutes after `now`
    const target = "2025-12-26T18:30:00+07:00";
    expect(computeRemaining(target, now)).toEqual({
      days: 6,
      hours: 8,
      minutes: 30,
      ended: false,
    });
  });

  it("floors seconds down to the current minute", () => {
    const target = "2025-12-20T10:05:59+07:00"; // 5m59s away
    expect(computeRemaining(target, now)).toEqual({ days: 0, hours: 0, minutes: 5, ended: false });
  });

  it("returns ended state at the target instant", () => {
    expect(computeRemaining("2025-12-20T10:00:00+07:00", now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      ended: true,
    });
  });

  it("returns ended state for a past target", () => {
    expect(computeRemaining("2020-01-01T00:00:00+07:00", now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      ended: true,
    });
  });

  it("returns ended fallback for an unparseable datetime (no crash) — test ID-60", () => {
    expect(computeRemaining("not-a-date", now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      ended: true,
    });
  });

  it("exposes a sane default event datetime", () => {
    expect(Number.isNaN(Date.parse(DEFAULT_EVENT_DATETIME))).toBe(false);
  });
});

describe("useCountdown", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("is not ready before mount effect resolves, then computes on mount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2025-12-20T10:00:00+07:00"));

    const { result } = renderHook(() => useCountdown("2025-12-26T18:30:00+07:00"));

    // After mount effect runs, ready flips true with computed values.
    expect(result.current.ready).toBe(true);
    expect(result.current).toMatchObject({ days: 6, hours: 8, minutes: 30, ended: false });
  });

  it("re-computes on each one-minute tick", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2025-12-20T10:00:00+07:00"));

    const { result } = renderHook(() => useCountdown("2025-12-20T10:03:00+07:00"));
    expect(result.current.minutes).toBe(3);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.minutes).toBe(2);
  });

  it("falls back to ended for an invalid target without throwing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2025-12-20T10:00:00+07:00"));

    const { result } = renderHook(() => useCountdown("invalid-format"));
    expect(result.current).toMatchObject({ days: 0, hours: 0, minutes: 0, ended: true, ready: true });
  });
});
