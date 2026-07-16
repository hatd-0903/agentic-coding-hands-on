import { describe, it, expect, vi, beforeEach } from "vitest";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "./request";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("i18n/request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SUPPORTED_LOCALES", () => {
    it("should include vi and en", () => {
      expect(SUPPORTED_LOCALES).toEqual(["vi", "en"]);
    });
  });

  describe("DEFAULT_LOCALE", () => {
    it("should default to vi", () => {
      expect(DEFAULT_LOCALE).toBe("vi");
    });
  });

  describe("LOCALE_COOKIE_NAME", () => {
    it("should be NEXT_LOCALE", () => {
      expect(LOCALE_COOKIE_NAME).toBe("NEXT_LOCALE");
    });
  });

  // Note: Testing the getRequestConfig function requires a more complex setup
  // since it's a server action that calls next/headers and imports message files.
  // The core logic is validated through integration tests and the component tests.
  // The locale resolution logic (isSupportedLocale + fallback) is implicitly tested
  // by the language-selector and login-action component tests.
});
