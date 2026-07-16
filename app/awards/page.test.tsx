import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AwardsPage from "./page";
import { AWARDS_CATALOG } from "@/lib/awards/awards-catalog";

// Mock next-intl — only the `awardsPage` namespace reaches real markup here
// because the shared chrome (header/footer/kudos) is mocked away below.
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      caption: "Sun* annual awards 2025",
      title: "Hệ thống giải thưởng SAA 2025",
      quantityLabel: "Số lượng giải thưởng:",
      prizeLabel: "Giá trị giải thưởng:",
    };
    return messages[key] ?? key;
  },
}));

// Mock the shared chrome — already implemented/tested elsewhere; stubbing
// keeps this test focused on the awards page's own guard + composition logic.
vi.mock("@/components/home/home-header", () => ({
  HomeHeader: () => <div data-testid="home-header" />,
}));
vi.mock("@/components/home/home-footer", () => ({
  HomeFooter: () => <div data-testid="home-footer" />,
}));
vi.mock("@/components/home/kudos-section", () => ({
  KudosSection: () => <div data-testid="kudos-section" />,
}));

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

function mockAuthenticatedSession() {
  const mockSession = { user: { id: "test-user-id" } };
  mockGetSession.mockResolvedValueOnce({ data: { session: mockSession }, error: null });
  mockOnAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
    setTimeout(() => callback("SIGNED_IN", mockSession), 0);
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
}

describe("app/awards/page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
    window.location.hash = "";
  });

  it("shows a loading placeholder while the auth check is in flight", () => {
    mockGetSession.mockReturnValueOnce(new Promise(() => {}));
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    render(<AwardsPage />);

    expect(screen.queryByTestId("home-header")).not.toBeInTheDocument();
  });

  it("redirects to /login when unauthenticated", async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
      setTimeout(() => callback("SIGNED_OUT", null), 0);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(<AwardsPage />);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("renders the header/footer/kudos chrome and all 6 award cards once authenticated", async () => {
    mockAuthenticatedSession();

    render(<AwardsPage />);

    await screen.findByTestId("home-header");
    expect(screen.getByTestId("home-footer")).toBeInTheDocument();
    expect(screen.getByTestId("kudos-section")).toBeInTheDocument();

    for (const award of AWARDS_CATALOG) {
      expect(screen.getByRole("heading", { name: award.title, level: 3 })).toBeInTheDocument();
    }
  });

  it("does not throw and leaves the page rendered when the URL hash is unknown", async () => {
    window.location.hash = "#not-a-real-award";
    mockAuthenticatedSession();

    render(<AwardsPage />);

    await screen.findByTestId("home-header");

    expect(screen.getByRole("heading", { name: AWARDS_CATALOG[0].title, level: 3 })).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
