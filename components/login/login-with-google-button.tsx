"use client";

import Image from "next/image";

export interface LoginWithGoogleButtonProps {
  /** Button label (localized). Defaults to the VN copy for standalone/preview use. */
  label?: string;
  /** Invoked on click; wired to signInWithOAuth by LoginAction. */
  onClick?: () => void;
  /** True while the OAuth request is in flight — disables the button and shows a spinner. */
  submitting?: boolean;
  /** Inline error text shown below the button (e.g. after a cancelled/failed OAuth attempt). */
  errorMessage?: string;
}

/**
 * The screen's single call to action: pale-yellow pill button with the
 * Google mark. Presentational — label, idle/loading/error are driven entirely
 * by props so LoginAction can plug in real OAuth state and localized copy.
 */
export function LoginWithGoogleButton({
  label = "LOGIN With Google",
  onClick,
  submitting = false,
  errorMessage,
}: LoginWithGoogleButtonProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={submitting}
        aria-busy={submitting}
        className="flex cursor-pointer items-center gap-3 rounded-md bg-[#F6E9A4] px-6 py-3 text-base font-bold text-[#1a1a1a] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-md"
      >
        {submitting ? (
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a]"
          />
        ) : (
          <Image src="/assets/login/google-icon.svg" alt="" width={20} height={20} />
        )}
        <span>{label}</span>
      </button>

      {errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
