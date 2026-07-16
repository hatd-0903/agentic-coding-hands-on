# Development Roadmap

Living record of the project's phases, milestones, and progress.

## Phase: Authentication & App Entry (Login)

**Status:** Complete — 2026-07-16
**Spec:** [docs/features/F001_Login](./features/F001_Login/technical-spec.md)

Shipped: Google OAuth login via Supabase (client-only, PKCE), VN/EN i18n switcher (cookie-based,
default VN), client-side route guard between `/login` and `/todo`, and a `/todo` placeholder
landing page.

**Deferred / not yet verified:**
- Live Google OAuth round-trip (needs Docker + real Google OAuth credentials — not available in
  this environment).
- Server-enforced auth boundary — current gating is client-side/UX-level only (flagged in
  `docs/system/permissions.md` for future hardening).

## Next

- `/todo` real feature scope — not yet planned; currently a placeholder authenticated page.
