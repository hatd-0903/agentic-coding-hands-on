import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { CountdownTimer } from "./countdown-timer";

// Mock next/navigation — capture router.replace calls.
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// Mock next-intl — return the countdown namespace strings.
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      title: "Sự kiện sẽ bắt đầu sau",
      days: "NGÀY",
      hours: "GIỜ",
      minutes: "PHÚT",
      seconds: "GIÂY",
    };
    return messages[key] ?? key;
  },
}));

describe("components/countdown/countdown-timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReplace.mockClear();
  });
  afterEach(() => vi.useRealTimers());

  it("renders the localized title and three unit labels (no seconds)", () => {
    render(<CountdownTimer />);
    expect(screen.getByText("Sự kiện sẽ bắt đầu sau")).toBeInTheDocument();
    for (const label of ["NGÀY", "GIỜ", "PHÚT"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    // SECONDS unit dropped to match the design.
    expect(screen.queryByText("GIÂY")).not.toBeInTheDocument();
  });

  it("does not redirect before the countdown completes", () => {
    render(<CountdownTimer />);
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to /login exactly once when the countdown hits zero", () => {
    render(<CountdownTimer />);
    act(() => {
      vi.advanceTimersByTime(61000);
    });
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("does not redirect after unmount", () => {
    const { unmount } = render(<CountdownTimer />);
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
