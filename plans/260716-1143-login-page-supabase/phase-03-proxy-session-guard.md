# Phase 03 — Client-side auth guard (session-based redirects)

**Track:** B · **Priority:** P1 · **Status:** complete · **Depends on:** Phase 1 · **Effort:** 1h

> **Revised (client-only auth):** replaces the Next 16 `proxy.ts` guard with a **client-side** guard.
> No `proxy.ts`, no middleware. Per the client-only decision (`clarifications.md`).

## Context Links
- Spec: `spec/login/technical-spec.md` (FR-002/003, BR-002/003, SC-002, US002)
- Permissions: `spec/system/permissions.md` (binary auth gate — client-enforced)
- Uses: `lib/supabase/browser-client.ts` (from Phase 1)

## Overview
A reusable client-side guard that enforces the binary gate in the browser: authed on `/login` →
`/todo`; unauthed on `/todo` → `/login`. Implemented as client hooks/components that read
`supabase.auth.getSession()` and subscribe to `onAuthStateChange`, redirecting via the router.

## Key Insights
- Client-only: the guard runs after hydration. Show a lightweight loading state until the session
  check resolves to avoid a flash of gated content.
- Subscribe to `onAuthStateChange` so a login/logout in another tab (or after the callback) re-runs
  the redirect logic; unsubscribe on unmount.
- This is UX-level gating, NOT a security boundary (client-only decision). Document that clearly.

## Requirements
- FR-002: authed on `/login` → redirect `/todo`. FR-003: unauthed on `/todo` → redirect `/login`.
- BR-002/BR-003 (behavior identical; enforcement moved client-side).

## Related Code Files
**Create:**
- `lib/auth/use-auth-guard.ts` — two hooks: `useRedirectIfAuthed(to = '/todo')` (for `/login`) and
  `useRequireAuth(to = '/login')` (for `/todo`). Each returns `{ checking: boolean }` for the caller
  to render a loading state. Uses the browser client + `onAuthStateChange`.

## Data Flow
```
mount → getSession()
  /login: session ? router.replace('/todo') : render children
  /todo : session ? render children : router.replace('/login')
onAuthStateChange(SIGNED_IN|SIGNED_OUT) → re-evaluate + redirect
```

## Implementation Steps
1. Implement `lib/auth/use-auth-guard.ts` with `useRedirectIfAuthed` and `useRequireAuth`
   (both `'use client'`), using `router.replace` (not push) so back-button doesn't loop.
2. Return `{ checking }` so `/login` (Phase 4/6) and `/todo` (Phase 5) can render a spinner/blank
   until resolved, preventing content flash.
3. Ensure the `onAuthStateChange` subscription is cleaned up on unmount.

## Todo
- [x] `lib/auth/use-auth-guard.ts` with both hooks (<200 lines), `'use client'`
- [x] `router.replace` used; subscription cleaned up on unmount
- [x] loading/`checking` state exposed to avoid flash-of-gated-content
- [x] `npm run build` compiles

## Success Criteria (SC-002)
- Authed session on `/login` → redirected to `/todo`; no session on `/todo` → redirected to `/login`.
- Verified with a running local Supabase + a real session (manual until creds supplied).

## Risk Assessment
- **MED — flash of gated content** before the client check resolves. Countermove: `checking` gate + loading UI.
- **LOW — not a security boundary.** Accepted per client-only decision; noted for future SSR hardening.

## Rollback
Delete `lib/auth/use-auth-guard.ts` and its usages → routes become ungated; no cascade. Safe.

## Security Considerations
- Client-side gating only — a determined user can reach `/todo` markup without a session (it has no
  sensitive data as a placeholder). Flagged for future server-side hardening if `/todo` gains data.

## Next Steps
Consumed by Phase 4/6 (`/login`) and Phase 5 (`/todo`).
