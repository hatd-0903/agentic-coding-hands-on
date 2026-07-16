import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { CountdownUnit } from "./countdown-unit";

describe("components/countdown/countdown-unit", () => {
  it("renders the uppercase label", () => {
    render(<CountdownUnit value="05" label="DAYS" />);
    expect(screen.getByText("DAYS")).toBeInTheDocument();
  });

  it("splits the two digits into separate cells", () => {
    render(<CountdownUnit value="09" label="HOURS" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("exposes a combined accessible label for the unit group", () => {
    render(<CountdownUnit value="42" label="MINUTES" />);
    expect(screen.getByLabelText("42 MINUTES")).toBeInTheDocument();
  });

  it("defensively pads a single-digit value to two cells", () => {
    render(<CountdownUnit value="7" label="SECONDS" />);
    expect(screen.getByLabelText("07 SECONDS")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
