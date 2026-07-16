import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AwardCategoryNav } from "./award-category-nav";
import { AWARDS_CATALOG } from "@/lib/awards/awards-catalog";

// jsdom has neither IntersectionObserver nor Element.scrollIntoView — stub
// both so the click-scroll + scroll-spy effects don't throw.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

describe("components/awards/award-category-nav", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    Element.prototype.scrollIntoView = vi.fn();

    // Render one target section per award so `document.getElementById(slug)` resolves.
    document.body.innerHTML = AWARDS_CATALOG.map((award) => `<div id="${award.slug}"></div>`).join("");
  });

  it("renders all 6 award categories", () => {
    render(<AwardCategoryNav />);
    for (const award of AWARDS_CATALOG) {
      expect(screen.getByRole("link", { name: award.title.split(" (")[0] })).toBeInTheDocument();
    }
  });

  it("marks the first category active by default", () => {
    render(<AwardCategoryNav />);
    const first = screen.getByRole("link", { name: AWARDS_CATALOG[0].title });
    expect(first).toHaveAttribute("aria-current", "true");
  });

  it("sets a clicked category as active and scrolls its section into view", () => {
    render(<AwardCategoryNav />);
    const secondAward = AWARDS_CATALOG[1];
    const link = screen.getByRole("link", { name: secondAward.title.split(" (")[0] });

    fireEvent.click(link);

    expect(link).toHaveAttribute("aria-current", "true");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    const first = screen.getByRole("link", { name: AWARDS_CATALOG[0].title });
    expect(first).not.toHaveAttribute("aria-current");
  });
});
