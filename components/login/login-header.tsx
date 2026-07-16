import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Fixed-top navigation bar for the login screen: brand mark on the left,
 * language selector on the right. Server component — the only interactive
 * leaf inside it (LanguageSelector) is its own client component.
 */
export function LoginHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-[#04060d] px-6 sm:px-10">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/login/sun-annual-awards-logo.png"
          alt="Sun* Annual Awards 2025"
          width={52}
          height={48}
          priority
          className="h-8 w-auto sm:h-9"
        />
        <div className="flex flex-col leading-[1.05] text-white">
          <span className="text-xs font-bold sm:text-sm">Sun*</span>
          <span className="text-[8px] font-medium uppercase tracking-wide text-white/70 sm:text-[9px]">
            Annual
          </span>
          <span className="text-[8px] font-medium uppercase tracking-wide text-white/70 sm:text-[9px]">
            Awards
          </span>
          <span className="text-[8px] font-medium uppercase tracking-wide text-white/70 sm:text-[9px]">
            2025
          </span>
        </div>
      </div>

      <LanguageSwitcher />
    </header>
  );
}
