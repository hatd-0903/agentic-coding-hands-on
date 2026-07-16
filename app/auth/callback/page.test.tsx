import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import type { Session } from "@supabase/supabase-js";

// Mock modules at top level
vi.mock("next/navigation");
vi.mock("@/lib/supabase/browser-client");

import AuthCallbackPage from "./page";
import * as nextNav from "next/navigation";
import * as supabaseClient from "@/lib/supabase/browser-client";

describe("app/auth/callback/page", () => {
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

  let mockReplace: ReturnType<typeof vi.fn>;
  let mockGetSession: ReturnType<typeof vi.fn>;
  let mockOnAuthStateChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReplace = vi.fn();
    mockGetSession = vi.fn().mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange = vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    vi.mocked(nextNav.useRouter).mockReturnValue({
      replace: mockReplace,
    } as unknown as ReturnType<typeof nextNav.useRouter>);

    vi.mocked(nextNav.useSearchParams).mockReturnValue({
      get: vi.fn((param: string) => {
        if (param === "error") return null;
        return null;
      }),
    } as unknown as ReturnType<typeof nextNav.useSearchParams>);

    vi.mocked(supabaseClient.getSupabaseBrowserClient).mockReturnValue({
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
      },
    } as unknown as ReturnType<typeof supabaseClient.getSupabaseBrowserClient>);
  });

  it("should render loading text initially", () => {
    render(
      <Suspense fallback={<div>Loading</div>}>
        <AuthCallbackPage />
      </Suspense>
    );

    expect(screen.getByText(/Signing you in/i)).toBeInTheDocument();
  });

  it("should redirect to /homepage when session is obtained via getSession", async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });

    render(
      <Suspense fallback={<div>Loading</div>}>
        <AuthCallbackPage />
      </Suspense>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/homepage");
    });
  });

  it("should redirect to /homepage when SIGNED_IN event is triggered", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing internal callback type
    mockOnAuthStateChange.mockImplementation((callback: any) => {
      setTimeout(() => callback("SIGNED_IN", mockSession), 0);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(
      <Suspense fallback={<div>Loading</div>}>
        <AuthCallbackPage />
      </Suspense>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/homepage");
    });
  });

  it("should redirect to /login?error=oauth when OAuth error is in query params", async () => {
    vi.mocked(nextNav.useSearchParams).mockReturnValue({
      get: (param: string) => {
        if (param === "error") return "access_denied";
        return null;
      },
    } as unknown as ReturnType<typeof nextNav.useSearchParams>);

    render(
      <Suspense fallback={<div>Loading</div>}>
        <AuthCallbackPage />
      </Suspense>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login?error=oauth");
    });
  });

  it("should redirect to /login?error=oauth on timeout", async () => {
    vi.useFakeTimers();
    try {
      render(
        <Suspense fallback={<div>Loading</div>}>
          <AuthCallbackPage />
        </Suspense>
      );

      // Use fake timers to deterministically test the 10s timeout
      await vi.advanceTimersByTimeAsync(10000);

      expect(mockReplace).toHaveBeenCalledWith("/login?error=oauth");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should cleanup subscription on unmount", async () => {
    const mockUnsubscribe = vi.fn();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = render(
      <Suspense fallback={<div>Loading</div>}>
        <AuthCallbackPage />
      </Suspense>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
