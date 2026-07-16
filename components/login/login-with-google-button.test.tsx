import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginWithGoogleButton } from "./login-with-google-button";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src as string} alt={alt as string} {...(props as Record<string, unknown>)} />;
  },
}));

describe("components/login/login-with-google-button", () => {
  it("should render button with default label", () => {
    render(<LoginWithGoogleButton />);
    expect(screen.getByRole("button", { name: /LOGIN With Google/i })).toBeInTheDocument();
  });

  it("should render custom label", () => {
    render(<LoginWithGoogleButton label="Sign in with Google" />);
    expect(screen.getByRole("button", { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it("should call onClick when button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<LoginWithGoogleButton onClick={handleClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when submitting", () => {
    render(<LoginWithGoogleButton submitting={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should have aria-busy when submitting", () => {
    render(<LoginWithGoogleButton submitting={true} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("should show spinner when submitting", () => {
    render(<LoginWithGoogleButton submitting={true} />);
    const spinner = screen.getByRole("button").querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should not be disabled when not submitting", () => {
    render(<LoginWithGoogleButton submitting={false} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should show error message when provided", () => {
    const errorMsg = "Đăng nhập không thành công. Vui lòng thử lại.";
    render(<LoginWithGoogleButton errorMessage={errorMsg} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("should have role alert on error message", () => {
    render(<LoginWithGoogleButton errorMessage="Auth failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Auth failed");
  });

  it("should not show error message when not provided", () => {
    render(<LoginWithGoogleButton />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should prevent double-click while submitting", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<LoginWithGoogleButton onClick={handleClick} submitting={true} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render Google icon when not submitting", () => {
    render(<LoginWithGoogleButton submitting={false} />);
    const googleIcon = screen.getByAltText("") as HTMLImageElement;
    expect(googleIcon.src).toContain("google-icon");
  });

  it("should not render Google icon when submitting", () => {
    render(<LoginWithGoogleButton submitting={true} />);
    // When submitting the spinner replaces the icon — the alt="" Google image is gone.
    expect(screen.queryByAltText("")).not.toBeInTheDocument();
  });

  it("should have proper styling for hover effect", () => {
    render(<LoginWithGoogleButton />);
    const button = screen.getByRole("button");

    // Check that the button has classes for hover effect
    expect(button.className).toContain("hover:");
    expect(button.className).toContain("hover:shadow-xl");
  });

  it("should have proper styling when disabled", () => {
    render(<LoginWithGoogleButton submitting={true} />);
    const button = screen.getByRole("button");

    expect(button.className).toContain("disabled:");
    expect(button.className).toContain("disabled:cursor-not-allowed");
  });
});
