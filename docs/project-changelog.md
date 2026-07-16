# Project Changelog

Running record of significant changes, features, and fixes.

## 2026-07-16 — Login feature (SAA 2025 Google OAuth)

**Feature spec:** [docs/features/F001_Login](./features/F001_Login/technical-spec.md)

### Added
- `/login` page — client-only Google OAuth sign-in via Supabase Auth (PKCE flow, browser
  client), dark hero UI, "LOGIN With Google" button.
- `/auth/callback` client page — exchanges the OAuth code (`detectSessionInUrl`), then redirects
  to `/todo` on success or back to `/login` with an error state on failure/cancel.
- `/todo` — placeholder authenticated landing page.
- Client-side auth guard (`lib/auth/use-auth-guard.ts`) — redirects an authenticated user away
  from `/login` to `/todo`, and an unauthenticated user away from `/todo` to `/login`.
- VN/EN language switcher via next-intl, cookie-based (`NEXT_LOCALE`), default Vietnamese.

### Deviations from the original draft spec
- **Client-only auth**: implemented entirely in the browser (Supabase browser client, PKCE,
  session in `localStorage`) instead of the originally drafted `@supabase/ssr` + middleware
  approach — there is no `proxy.ts`/middleware in this app. Route gating is UX-level, not a
  server-enforced security boundary (see `docs/system/permissions.md`).
- **Wave background is a CSS approximation**: no MoMorph wave art asset was available for the
  hero background, so it is recreated with CSS rather than the exact design asset.
- **Live Google OAuth round-trip deferred**: exercising the real OAuth flow needs Docker plus
  real `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` credentials, unavailable in this environment —
  not verified end-to-end.

### Verification
- Build: pass. Lint: pass. Tests: 65/65 passing. Review score: 7.5/10.
