/**
 * Shared pill-shaped CTA/link button for the Homepage SAA screen: the hero's
 * "ABOUT AWARDS" / "ABOUT KUDOS" CTAs (mms_B3) and the smaller Kudos-section
 * "Chi tiết" button (mms_D2.1) share the same filled/outline visual language,
 * just at two sizes. The award-card "Chi tiết" is a plain text link (no pill
 * background) — that's `variant="link"`.
 */
import Link from "next/link";
import { ArrowUpIcon } from "./home-icons";

export type PillButtonVariant = "filled" | "outline" | "link";
export type PillButtonSize = "lg" | "sm";

export interface PillButtonProps {
  href: string;
  variant: PillButtonVariant;
  size?: PillButtonSize;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<PillButtonVariant, string> = {
  filled: "bg-[#FFEA9E] text-[#00101A] hover:bg-[#fff0b8]",
  outline: "border border-[#998C5F] bg-[#FFEA9E]/10 text-white hover:bg-[#FFEA9E]/20",
  link: "text-white hover:text-[#FFEA9E]",
};

const SIZE_CLASSES: Record<PillButtonSize, string> = {
  lg: "px-6 py-4 text-lg sm:text-xl",
  sm: "px-4 py-3 text-sm sm:text-base",
};

export function PillButton({ href, variant, size = "lg", children }: PillButtonProps) {
  const shape = variant === "link" ? "" : "rounded-lg";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-bold transition-colors ${shape} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`}
    >
      <span>{children}</span>
      <ArrowUpIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
    </Link>
  );
}
