"use client";

import { useRedirectIfAuthed } from "@/lib/auth/use-auth-guard";

/**
 * Client wrapper enforcing the /login side of the auth gate (FR-002/BR-002):
 * an already-authenticated visitor is redirected to /todo. Renders a loading
 * state while the session check is in flight to avoid a flash of the login UI.
 * Children are server components passed through untouched (server→client children
 * pattern), so the login screen markup stays server-rendered.
 */
export function LoginGuard({ children }: { children: React.ReactNode }) {
  const { checking } = useRedirectIfAuthed();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050a16]">
        <span
          role="status"
          aria-label="Loading"
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"
        />
      </div>
    );
  }

  return <>{children}</>;
}
