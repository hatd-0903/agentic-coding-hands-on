---
title: "SAA 2025 Login Page (Supabase + Google OAuth + VN/EN i18n)"
description: "Dark-hero Google-OAuth login gate on Next.js 16 with Supabase SSR guard and cookie-based next-intl."
status: complete
priority: P1
effort: 13h
branch: main
tags: [login, supabase, oauth, i18n, nextjs16]
created: 2026-07-16
completed: 2026-07-16
spec_draft: plans/260716-1143-login-page-supabase/spec/login/
system_draft:
  - plans/260716-1143-login-page-supabase/spec/system/architecture.md
  - plans/260716-1143-login-page-supabase/spec/system/permissions.md
findings: plans/260716-1143-login-page-supabase/research/nextjs-16-findings.md
clarifications: plans/260716-1143-login-page-supabase/clarifications.md
---

# SAA 2025 Login Page — Implementation Plan

Single-screen Google-OAuth login gate for the "ROOT FURTHER" app. Unauthed → `/login`,
authed → `/todo`, enforced by a **client-side auth guard** (client-only Supabase — browser client,
PKCE, no `proxy.ts`, no SSR server client). VN/EN switch via cookie-based `next-intl` (default VN,
NO locale in URL).

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- Clarifications: plans/260716-1143-login-page-supabase/clarifications.md

## Auth approach: CLIENT-ONLY (revised per clarifications.md)
- Browser Supabase client only (`@supabase/supabase-js`, PKCE, `detectSessionInUrl`); session in
  localStorage. NO `@supabase/ssr`, NO server client, NO `proxy.ts`/middleware.
- Route guard is **client-side** (`lib/auth/use-auth-guard.ts`): authed↔`/login`, unauthed↔`/todo`.
- OAuth callback is a **client page** (`app/auth/callback/page.tsx`) — auto-exchange then redirect.
- Trade-off: UX-level gating, not a security boundary. Accepted for this stage; noted for hardening.

## Two-Track Shape (MoMorph)
- **Track A (UI):** Phase 4 — Login screen, presentational only, hardcoded VN copy as mock.
- **Track B (backend/logic):** Phases 1, 2, 3, 5 — deps/env, i18n infra, client guard, callback+todo.
- Track A and Track B are independently runnable — NO cross-track `blocks`/`blockedBy`.
- **Phase 6** is the only cross-track merge (wire OAuth + i18n + states into the UI).

## Global Rules (enforced in every code phase)
- ⚠ Next 16: if middleware were ever needed it is **`proxy.ts`** (renamed) — but client-only auth
  uses NO middleware/proxy at all.
- `cookies()`/`headers()` are **async** (`await`); dynamic `params` are Promises (relevant to next-intl only).
- Each code phase MUST read the cited `node_modules/next/dist/docs/` page BEFORE coding.
- Code files < 200 lines; kebab-case filenames; edit files in place (no "-v2" copies).
- Confirm latest `@supabase/supabase-js`, `next-intl` compatible with Next 16 at install (NO `@supabase/ssr`).

## Phases

| # | Phase | Track | Status | Depends On | Effort |
|---|-------|-------|--------|------------|--------|
| 1 | [Setup: deps, env, config, Supabase browser client](phase-01-setup-deps-env-supabase-clients.md) | B | complete | — | 1h |
| 2 | [i18n infra: next-intl cookie + locale-aware layout](phase-02-i18n-infrastructure.md) | B | complete | 1 | 2h |
| 3 | [Client-side auth guard (session redirects)](phase-03-proxy-session-guard.md) | B | complete | 1 | 1h |
| 4 | [Login UI screen (presentational)](phase-04-login-ui-screen.md) | A | complete | — | 3h |
| 5 | [OAuth callback (client) + /todo placeholder](phase-05-oauth-callback-todo.md) | B | complete | 1 | 1h |
| 6 | [Integration: OAuth + i18n + states wiring](phase-06-integration-wiring.md) | A+B | complete | 2,3,4,5 | 2h |
| 7 | [Tests (unit/component + guard)](phase-07-tests.md) | — | complete | 6 | 2h |

## Dependency Graph
```
1 ─┬─► 2 ─┐
   ├─► 3 ─┤
   └─► 5 ─┼─► 6 ─► 7
4 ────────┘   (4 = Track A, independent, joins at 6)
```

## Key Risks (detail per phase)
- **MED** — next-intl "without i18n routing" (cookie) + Next 16 plugin. Mitigation: tkm:search-docs at forge.
- **MED** — local Google OAuth needs user creds + `skip_nonce_check=true`; live round-trip unverifiable now.
- **MED** — Supabase local must be running (`npx supabase start`) for any auth path (needs Docker — absent here).
- **MED** — client-side guard flash-of-content + not a security boundary. Mitigation: `checking` gate; noted for hardening.
- **LOW** — PKCE auto-exchange timing on callback. Mitigation: onAuthStateChange + timeout fallback.

## Success (observable)
Verifies SC-001..SC-004 (technical-spec). Build + lint clean; guard redirects both ways;
VN default + EN switch persists via `NEXT_LOCALE`; button loading/error states per SM-001/BR-005.

## Completion Summary (Delivered 2026-07-16)

**Feature Shipped:** SAA 2025 Login Page (/login) — client-only Supabase Google OAuth + cookie-based next-intl VN/EN + client auth guard + /todo placeholder + client OAuth callback on Next.js 16, React 19, Tailwind v4.

**Verification Results:**
- Build: clean. Lint: 0 errors/0 warnings.
- Tests: 65/65 passing (Vitest + React Testing Library).
- Reviewer (7.5/10): ship-ready; all actionable findings fixed (config.toml redirect allow-list, callback 10s timeout, secure cookie, tautological tests removed).
- Runtime: /login renders pixel-close to design; client guard redirects (/todo→/login when unauthed); VN default + EN switch persists via `NEXT_LOCALE` cookie.

**Deviations (accepted per clarifications.md & user sign-off):**
1. Client-only auth (not SSR/proxy) — UX-level gating, not a security boundary. Acceptable for this stage; noted for future hardening.
2. Wave background: CSS approximation (no wave asset in MoMorph exports).
3. Live Google OAuth round-trip: deferred pending Docker + real `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`. Manual E2E checklist in `reports/tester-260716-1314-login-tests.md`.

**Next:** Live OAuth E2E once real creds + Docker Supabase available.
