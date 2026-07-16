import { describe, it, expect } from "vitest";

import { pad2, secondsToUnits } from "./format-countdown";

describe("lib/countdown/format-countdown", () => {
  describe("pad2", () => {
    it.each([
      [0, "00"],
      [5, "05"],
      [9, "09"],
      [10, "10"],
      [59, "59"],
      [99, "99"],
    ])("pads %i → %s", (n, expected) => {
      expect(pad2(n)).toBe(expected);
    });

    it("clamps a negative value to 00", () => {
      expect(pad2(-1)).toBe("00");
    });

    it("truncates a float before padding", () => {
      expect(pad2(5.9)).toBe("05");
    });
  });

  describe("secondsToUnits", () => {
    it.each([
      [60, { days: 0, hours: 0, minutes: 1, seconds: 0 }],
      [59, { days: 0, hours: 0, minutes: 0, seconds: 59 }],
      [0, { days: 0, hours: 0, minutes: 0, seconds: 0 }],
      [3661, { days: 0, hours: 1, minutes: 1, seconds: 1 }],
      [90061, { days: 1, hours: 1, minutes: 1, seconds: 1 }],
    ])("converts %i seconds", (total, expected) => {
      expect(secondsToUnits(total)).toEqual(expected);
    });

    it("clamps a negative total to zero units", () => {
      expect(secondsToUnits(-100)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });
  });
});
