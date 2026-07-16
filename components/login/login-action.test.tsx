import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginAction } from "./login-action";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      "login.loginButton": "LOGIN With Google",
      "login.oauthError": "Đăng nhập không thành công. Vui lòng thử lại.",
    };
    return messages[`login.${key}`] || key;
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn((param: string) => {
      if (param === "error") return null;
      return null;
    }),
  }),
}));

// Mock supabase client
const mockSignInWithOAuth = vi.fn();
vi.mock("@/lib/supabase/browser-client", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

describe("components/login/login-action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithOAuth.mockResolvedValue({ error: null });
  });

  it("should render login button", () => {
    render(<LoginAction />);
    expect(screen.getByRole("button", { name: /LOGIN With Google/i })).toBeInTheDocument();
  });

  it("should call signInWithOAuth with google provider on click", async () => {
    const user = userEvent.setup();
    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: expect.stringMatching(/^http.*\/auth\/callback$/),
      },
    });
  });

  it("should set button to submitting state on click", async () => {
    const user = userEvent.setup();
    mockSignInWithOAuth.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ error: null }), 1000);
        })
    );

    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("should show error message when OAuth fails", async () => {
    const user = userEvent.setup();
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: new Error("OAuth failed"),
    });

    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Đăng nhập không thành công. Vui lòng thử lại."
      );
    });
  });

  it("should re-enable button after OAuth failure", async () => {
    const user = userEvent.setup();
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: new Error("OAuth failed"),
    });

    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("should show error message on exception during OAuth", async () => {
    const user = userEvent.setup();
    mockSignInWithOAuth.mockRejectedValueOnce(new Error("Network error"));

    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Đăng nhập không thành công. Vui lòng thử lại."
      );
    });
  });

  it("should use localized button label", () => {
    render(<LoginAction />);
    expect(screen.getByRole("button", { name: /LOGIN With Google/i })).toBeInTheDocument();
  });

  it("should clear error when retrying after failure", async () => {
    const user = userEvent.setup();
    // First attempt fails
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: new Error("OAuth failed"),
    });

    render(<LoginAction />);

    let button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    // Second attempt succeeds (no error returned)
    mockSignInWithOAuth.mockResolvedValueOnce({ error: null });

    button = screen.getByRole("button");
    await user.click(button);

    // Wait for error to be cleared
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should include origin in redirectTo", async () => {
    const user = userEvent.setup();
    render(<LoginAction />);

    const button = screen.getByRole("button");
    await user.click(button);

    const call = mockSignInWithOAuth.mock.calls[0][0];
    expect(call.options.redirectTo).toContain(window.location.origin);
    expect(call.options.redirectTo).toContain("/auth/callback");
  });
});
