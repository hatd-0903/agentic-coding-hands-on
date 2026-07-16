import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRedirectIfAuthed, useRequireAuth } from "./use-auth-guard";
import type { Session } from "@supabase/supabase-js";

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock supabase client
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
vi.mock("@/lib/supabase/browser-client", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

describe("use-auth-guard", () => {
  const mockSession: Session = {
    user: {
      id: "test-user-id",
      aud: "authenticated",
      role: "authenticated",
      email: "test@example.com",
      email_confirmed_at: new Date().toISOString(),
      phone: "",
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    access_token: "test-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    refresh_token: "test-refresh",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("useRedirectIfAuthed", () => {
    it("should return { checking: true } initially", () => {
      const { result } = renderHook(() => useRedirectIfAuthed());
      expect(result.current.checking).toBe(true);
    });

    it("should redirect to /homepage when session exists", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_IN", mockSession), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderHook(() => useRedirectIfAuthed());

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockReplace).toHaveBeenCalledWith("/homepage");
    });

    it("should redirect to custom destination when provided", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_IN", mockSession), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderHook(() => useRedirectIfAuthed("/custom"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockReplace).toHaveBeenCalledWith("/custom");
    });

    it("should set checking to false when no session", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_OUT", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useRedirectIfAuthed());

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.checking).toBe(false);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should handle getSession error gracefully", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: new Error("Auth error") });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_OUT", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useRedirectIfAuthed());

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.checking).toBe(false);
    });
  });

  describe("useRequireAuth", () => {
    it("should return { checking: true } initially", () => {
      const { result } = renderHook(() => useRequireAuth());
      expect(result.current.checking).toBe(true);
    });

    it("should redirect to /login when no session", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_OUT", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderHook(() => useRequireAuth());

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockReplace).toHaveBeenCalledWith("/login");
    });

    it("should redirect to custom destination when provided", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_OUT", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderHook(() => useRequireAuth("/custom-login"));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockReplace).toHaveBeenCalledWith("/custom-login");
    });

    it("should set checking to false when session exists", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_IN", mockSession), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      const { result } = renderHook(() => useRequireAuth());

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.checking).toBe(false);
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should handle getSession error gracefully", async () => {
      mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: new Error("Auth error") });
      mockOnAuthStateChange.mockImplementation((callback) => {
        setTimeout(() => callback("SIGNED_OUT", null), 0);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      renderHook(() => useRequireAuth());

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });
});
