import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSelector } from "./language-selector";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src as string} alt={alt as string} {...(props as Record<string, unknown>)} />;
  },
}));

describe("components/login/language-selector", () => {
  it("should render button with current locale label", () => {
    render(<LanguageSelector locale="vi" />);
    expect(screen.getByRole("button", { name: /VN/i })).toBeInTheDocument();
  });

  it("should display VN flag when locale is vi", () => {
    render(<LanguageSelector locale="vi" />);
    const button = screen.getByRole("button");
    const allImages = within(button).getAllByAltText("") as HTMLImageElement[];
    const flagImg = allImages.find(img => img.src.includes("flag"));
    expect(flagImg?.src).toContain("flag-vn");
  });

  it("should display EN label when locale is en", () => {
    render(<LanguageSelector locale="en" />);
    expect(screen.getByRole("button", { name: /EN/i })).toBeInTheDocument();
  });

  it("should have aria-haspopup when rendering", () => {
    render(<LanguageSelector locale="vi" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("should open dropdown on button click", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Dropdown should be visible with listbox role
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should set aria-expanded to true when dropdown is open", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("should set aria-expanded to false when dropdown is closed", () => {
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should show all locale options in dropdown when open", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");
    await user.click(button);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("VN");
    expect(options[1]).toHaveTextContent("EN");
  });

  it("should call onLocaleChange when selecting a locale", async () => {
    const user = userEvent.setup();
    const handleLocaleChange = vi.fn();

    render(<LanguageSelector locale="vi" onLocaleChange={handleLocaleChange} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const enOption = screen.getByRole("option", { name: /EN/i });
    await user.click(enOption);

    expect(handleLocaleChange).toHaveBeenCalledWith("en");
  });

  it("should close dropdown after selecting a locale", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" onLocaleChange={vi.fn()} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const enOption = screen.getByRole("option", { name: /EN/i });
    await user.click(enOption);

    // Dropdown should now be closed (aria-expanded should be false)
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should update button label after selecting a locale", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" onLocaleChange={vi.fn()} />);

    // Initially shows VN
    const button = screen.getByRole("button");
    expect(within(button).getByText("VN")).toBeInTheDocument();

    // Click to open
    await user.click(button);

    // Select EN
    const enOption = screen.getByRole("option", { name: /EN/i });
    await user.click(enOption);

    // Button should now show EN
    expect(within(button).getByText("EN")).toBeInTheDocument();
  });

  it("should toggle dropdown on multiple clicks", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");

    // First click opens
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Press escape or click outside to close
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should mark current locale as selected", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    const button = screen.getByRole("button");
    await user.click(button);

    const vnOption = screen.getByRole("option", { name: /VN/i });
    expect(vnOption).toHaveAttribute("aria-selected", "true");

    const enOption = screen.getByRole("option", { name: /EN/i });
    expect(enOption).toHaveAttribute("aria-selected", "false");
  });

  it("should display chevron in button", () => {
    render(<LanguageSelector locale="vi" />);
    const button = screen.getByRole("button");
    const allImages = within(button).getAllByAltText("") as HTMLImageElement[];
    expect(allImages.some(img => img.src.includes("chevron"))).toBe(true);
  });

  it("updates local selection and closes the dropdown when onLocaleChange is not provided", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector locale="vi" />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: /EN/i }));

    // No callback provided → no throw; local selection updates and the dropdown closes.
    expect(screen.getByRole("button")).toHaveTextContent("EN");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
});
