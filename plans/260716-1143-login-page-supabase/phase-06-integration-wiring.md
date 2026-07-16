# Phase 06 — Integration: OAuth + i18n + states wiring (cross-track merge)

**Track:** A+B (merge) · **Priority:** P1 · **Status:** complete · **Depends on:** Phases 2,3,4,5 · **Effort:** 2h

## Context Links
- Spec: `spec/login/technical-spec.md` (SM-001 states, BR-004/005, FR-004)
- All prior phase files; `clarifications.md`

## Overview
The single cross-track merge point. Replace the Track-A UI's mock copy and stub callbacks with:
next-intl translations (Phase 2), real Google OAuth via the browser client (Phase 1), the SM-001
loading/error state machine, and the locale-change cookie write. No new components — wire existing ones.

## Key Insights
- Login button + language selector become client components (`'use client'`) here; the page shell
  stays a server component passing initial locale down, wrapping content in the client guard
  (`useRedirectIfAuthed` from Phase 3) so an authed visitor is bounced to `/todo`.
- OAuth trigger: `supabase.browser.auth.signInWithOAuth({ provider: 'google', options: { redirectTo:
  <origin>/auth/callback } })`. On the returned promise starting the redirect, keep button in `submitting`.
- Error surfacing: read `?error=oauth` from URL (set by Phase 5) on mount → show BR-005 localized
  message and reset button to idle. Also handle a rejected `signInWithOAuth` locally.
- Locale change: selector calls Phase 2's `setLocale` server action (writes `NEXT_LOCALE`), then
  refreshes so all copy re-renders (SC-004).

## Requirements
- SM-001: idle → submitting (disable + spinner) → error (BR-005) / navigate-away. BR-004 double-click no-op.
- FR-004/SC-004: selecting language re-renders all copy and persists cookie.
- All visible copy sourced from `messages/*` via `useTranslations` (no hardcoded strings remain).

## Related Code Files
**Modify (Track A components, now wired):**
- `app/login/page.tsx` — pass initial locale; read `error` searchParam
- `components/login/login-with-google-button.tsx` — real onClick OAuth + submitting/disabled + spinner
- `components/login/language-selector.tsx` — call `setLocale`, refresh
- `components/login/login-header.tsx`, `login-hero.tsx`, `login-footer.tsx` — swap mock copy for `useTranslations`

## Data Flow
```
click Login → setState(submitting) → signInWithOAuth(google, redirectTo=/auth/callback)
  → Google → /auth/callback → /todo            (success)
  → /login?error=oauth → show BR-005, setState(idle)   (fail/cancel)
select locale → setLocale(cookie) → refresh → next-intl re-renders all copy
```

## Todo
- [x] Button triggers real OAuth with correct redirectTo; disabled+spinner while submitting (BR-004)
- [x] `?error=oauth` → localized BR-005 message, button back to idle (BR-005, SM-001)
- [x] Language selector writes NEXT_LOCALE and re-renders all copy (SC-004)
- [x] Zero hardcoded UI strings — all via useTranslations
- [x] `npm run build` + `npm run lint` clean

## Success Criteria (SC-001, SC-003, SC-004 end-to-end)
- Click → OAuth redirect (button loading); fail/cancel → BR-005 + idle; language switch persists & re-renders.
- Full gate works with Phases 3+5: authed↔/login, unauthed↔/todo.

## Risk Assessment
- **MED — server/client boundary.** Making children client components can break the server page.
  Countermove: keep page shell server-side, isolate `'use client'` to interactive leaves.
- **MED — live OAuth needs creds.** Countermove: verify redirect *initiates* + error path now;
  full round-trip on the post-creds manual checklist.

## Rollback
Revert wired components to Phase-4 presentational state; backend phases keep working independently.

## Security Considerations
- `redirectTo` pinned to same-origin `/auth/callback` (must be in Supabase allow-list) — no open redirect.
- Generic localized error only; never surface raw provider errors.

## Next Steps
Hand simplified, wired code to Phase 7 (tester).
