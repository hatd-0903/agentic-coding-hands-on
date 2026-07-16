import { describe, it, expect } from "vitest";
import { AWARDS_CATALOG } from "./awards-catalog";

const EXPECTED_SLUGS = ["top-talent", "top-project", "top-project-leader", "best-manager", "signature-creator", "mvp"];

describe("lib/awards/awards-catalog", () => {
  it("has exactly 6 award entries", () => {
    expect(AWARDS_CATALOG).toHaveLength(6);
  });

  it("has the exact slugs required by the homepage deep-links, in order", () => {
    expect(AWARDS_CATALOG.map((award) => award.slug)).toEqual(EXPECTED_SLUGS);
  });

  it("gives every entry a non-empty title, description, quantity, and image", () => {
    for (const award of AWARDS_CATALOG) {
      expect(award.title.length).toBeGreaterThan(0);
      expect(award.description.length).toBeGreaterThan(0);
      expect(award.quantity.length).toBeGreaterThan(0);
      expect(award.nameImgSrc.length).toBeGreaterThan(0);
      expect(award.nameImgAlt.length).toBeGreaterThan(0);
    }
  });

  it("gives every entry at least one prize with a non-empty value", () => {
    for (const award of AWARDS_CATALOG) {
      expect(award.prizes.length).toBeGreaterThan(0);
      for (const prize of award.prizes) {
        expect(prize.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("gives signature-creator two prizes (cá nhân + tập thể) per the design", () => {
    const signature = AWARDS_CATALOG.find((award) => award.slug === "signature-creator");
    expect(signature?.prizes).toHaveLength(2);
    expect(signature?.prizes[0].note).toBe("cho giải cá nhân");
    expect(signature?.prizes[1].note).toBe("cho giải tập thể");
  });

  it("has no duplicate slugs", () => {
    const slugs = AWARDS_CATALOG.map((award) => award.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
