import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useCountdown } from "./use-countdown";

describe("lib/countdown/use-countdown", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts at the given total (60s → 00:00:01:00)", () => {
    const { result } = renderHook(() => useCountdown(60));
    expect(result.current).toMatchObject({
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 0,
      isComplete: false,
    });
  });

  it("ticks down one second per interval", () => {
    const { result } = renderHook(() => useCountdown(60));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toMatchObject({ minutes: 0, seconds: 59, isComplete: false });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(57);
  });

  it("reaches isComplete at zero", () => {
    const { result } = renderHook(() => useCountdown(3));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toMatchObject({ seconds: 0, isComplete: true });
  });

  it("clamps at zero and never goes negative", () => {
    const { result } = renderHook(() => useCountdown(2));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current.seconds).toBe(0);
    expect(result.current.isComplete).toBe(true);
  });

  it("treats a zero total as immediately complete", () => {
    const { result } = renderHook(() => useCountdown(0));
    expect(result.current.isComplete).toBe(true);
  });

  it("clears the interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = renderHook(() => useCountdown(60));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
