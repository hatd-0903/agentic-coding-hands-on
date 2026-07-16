import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers FIRST, before importing the module
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { setLocale } from "./set-locale";
import { cookies } from "next/headers";

describe("lib/i18n/set-locale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept vi locale and set cookie", async () => {
    const mockCookieSet = vi.fn();
    vi.mocked(cookies).mockResolvedValueOnce({
      set: mockCookieSet,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    await setLocale("vi");

    expect(mockCookieSet).toHaveBeenCalledWith("NEXT_LOCALE", "vi",
      expect.objectContaining({
        path: "/",
        sameSite: "lax",
        secure: false,
        maxAge: expect.any(Number),
      })
    );
  });

  it("should accept en locale and set cookie", async () => {
    const mockCookieSet = vi.fn();
    vi.mocked(cookies).mockResolvedValueOnce({
      set: mockCookieSet,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    await setLocale("en");

    expect(mockCookieSet).toHaveBeenCalledWith("NEXT_LOCALE", "en",
      expect.objectContaining({
        path: "/",
        sameSite: "lax",
        secure: false,
        maxAge: expect.any(Number),
      })
    );
  });

  it("should throw error for unsupported locale", async () => {
    vi.mocked(cookies).mockResolvedValueOnce({
      set: vi.fn(),
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing invalid input
    await expect(setLocale("fr" as any)).rejects.toThrow("Unsupported locale: fr");
  });

  // Note: maxAge verification is covered by the "should accept vi/en locale..." tests above via expect.objectContaining.
  // Testing error handling from cookies() is complex due to Next.js async context mocking.
  // The error handling path is exercised in integration tests.
});
