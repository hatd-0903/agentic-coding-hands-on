"use client";

import Image from "next/image";
import { useState } from "react";

/** One selectable language entry shown in the dropdown. */
interface LocaleOption {
  code: string;
  label: string;
  /** Flag icon path; null when no flag asset is available (e.g. EN). */
  flag: string | null;
}

// Only a VN flag asset was provided in this design pass; EN renders label-only.
const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "vi", label: "VN", flag: "/assets/login/flag-vn.svg" },
  { code: "en", label: "EN", flag: null },
];

export interface LanguageSelectorProps {
  /** Currently active locale code (e.g. "vi"). */
  locale: string;
  /** Called with the picked locale code; wiring the cookie/i18n swap is Phase 6's job. */
  onLocaleChange?: (code: string) => void;
}

/**
 * Header language picker: flag + code + chevron, opens a small dropdown of
 * VN/EN on click. Presentational only — selection state is local; the parent
 * (Phase 6) supplies `onLocaleChange` to persist the real choice.
 */
export function LanguageSelector({ locale, onLocaleChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(locale);

  const current = LOCALE_OPTIONS.find((option) => option.code === selected) ?? LOCALE_OPTIONS[0];

  function handleSelect(code: string) {
    setSelected(code);
    setOpen(false);
    onLocaleChange?.(code);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
      >
        {current.flag && (
          <Image src={current.flag} alt="" width={20} height={15} className="rounded-[2px]" />
        )}
        <span>{current.label}</span>
        <Image
          src="/assets/login/chevron-down.svg"
          alt=""
          width={14}
          height={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-40 mt-2 w-28 overflow-hidden rounded-md bg-[#0f1a2b] shadow-lg ring-1 ring-white/10"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={option.code === selected}
                onClick={() => handleSelect(option.code)}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
              >
                {option.flag && <Image src={option.flag} alt="" width={18} height={13} />}
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
