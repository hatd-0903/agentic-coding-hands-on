# Phase 05 — OAuth callback (client) + /todo placeholder

**Track:** B · **Priority:** P1 · **Status:** complete · **Depends on:** Phase 1 · **Effort:** 1h

> **Revised (client-only auth):** callback is a **client page** (browser client auto-exchanges the
> PKCE `?code=` via `detectSessionInUrl`), not a server route handler. `/todo` is guarded client-side
> (Phase 3). No `@supabase/ssr`, no `route.ts`, no server `exchangeCodeForSession`.

## Context Links
- Architecture: `spec/system/architecture.md` (client-only callback → session → /todo)
- Spec: `spec/login/technical-spec.md` (FR-001 success path, INT-001)
- Uses: `lib/supabase/browser-client.ts` (Phase 1), `lib/auth/use-auth-guard.ts` (Phase 3)

## Overview
A client callback page at `app/auth/callback/page.tsx` that lets the browser Supabase client finish
the PKCE exchange (auto via `detectSessionInUrl`), then redirects to `/todo` on success or
`/login?error=oauth` on failure/cancel. Plus a minimal `/todo` client page gated by `useRequireAuth`.

## Key Insights
- With `flowType: 'pkce'` + `detectSessionInUrl: true`, the browser client auto-exchanges the `?code=`
  on load. The callback page waits for `getSession()` / `onAuthStateChange(SIGNED_IN)` then redirects.
- Google may return `?error=...` (denied/cancelled) instead of `?code=` → redirect `/login?error=oauth`
  so Phase 6 surfaces BR-005. Also time-box the wait (e.g. a few seconds) → treat as error.
- `redirectTo` for `signInWithOAuth` (set in Phase 6) MUST be `${origin}/auth/callback`, and that
  origin must be in Supabase `additional_redirect_urls` (config.toml already allows `http://localhost:3000`).
- `/todo` is a placeholder — render "Todo — coming soon"; the client guard handles the unauthed case.

## Requirements
- FR-001 success: land authed user on `/todo`. INT-001 failure handling → `/login?error=oauth`.

## Related Code Files
**Create:**
- `app/auth/callback/page.tsx` — `'use client'`; wait for session (or `?error`), then
  `router.replace('/todo')` or `router.replace('/login?error=oauth')`. Minimal loading UI while waiting.
- `app/todo/page.tsx` — `'use client'`; `useRequireAuth()` gate + placeholder content.

## Data Flow
```
Google → /auth/callback?code=…  (browser client auto-exchanges via detectSessionInUrl)
  ├ session appears → router.replace('/todo')
  └ ?error / timeout → router.replace('/login?error=oauth')
/todo (client) → useRequireAuth() → no session ? replace('/login') : render placeholder
```

## Implementation Steps
1. Implement `app/auth/callback/page.tsx`: on mount read `searchParams` for `error`; otherwise
   subscribe to `onAuthStateChange` + call `getSession()`; on session → `/todo`, on error/timeout →
   `/login?error=oauth`. Clean up subscription.
2. Implement `app/todo/page.tsx`: `useRequireAuth()`; render placeholder ("Todo — coming soon") when
   authed, loading state while `checking`.
3. Confirm `additional_redirect_urls` in config.toml covers the callback origin.

## Todo
- [x] `app/auth/callback/page.tsx` (client) redirects /todo on session, /login?error=oauth on error/timeout
- [x] `app/todo/page.tsx` (client) gated by useRequireAuth, placeholder content
- [x] `npm run build` compiles
- [ ] Live OAuth round-trip E2E (deferred — requires Docker Supabase + real Google creds; see `reports/tester-260716-1314-login-tests.md` manual checklist)

## Success Criteria
- With a valid session established client-side, callback lands on `/todo` (SC-001 client half).
- Unauthed visit to `/todo` redirects `/login` (client guard).

## Risk Assessment
- **MED — live exchange unverifiable** until real Google creds supplied. Countermove: unit-test the
  callback branch logic (Phase 7) with a mocked session/error; manual E2E checklist post-creds.
- **MED — PKCE auto-exchange timing.** Countermove: rely on `onAuthStateChange` + a timeout fallback.

## Rollback
Remove `app/auth/` and `app/todo/` → login has no landing target; no cascade. Safe.

## Security Considerations
- Do not echo raw provider error text to the user (BR-005 = generic localized message).
- Client-only: session/tokens live in the browser (localStorage) per the chosen approach.

## Next Steps
Phase 6 sets the login button's `redirectTo` to `/auth/callback` and maps `?error=oauth` → BR-005 copy.
