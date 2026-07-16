# Review — SAA 2025 Login Feature (client-only Supabase auth)

**Scope:** app/login, app/todo, app/auth/callback, app/layout.tsx, components/login/*, lib/supabase/browser-client.ts, lib/auth/use-auth-guard.ts, lib/i18n/*, i18n/request.ts, messages/*.json, next.config.ts, eslint.config.mjs, supabase/config.toml, .env.example.
**LOC:** ~1243 (incl. tests), all files well under the 200-line cap.
**Build/lint/types:** `tsc --noEmit` clean, ESLint config sane, 66/66 vitest tests pass (verified: build/lint per environment note, tsc re-verified directly).

## Overall Assessment

Clean, well-commented, small-file implementation that maps closely to the spec (FR-001..004, BR-001..006, SM-001). Client-only auth is exactly as documented in clarifications.md/architecture.md — not re-litigated here. The one real bug found is a **local Supabase redirect-URL allow-list misconfiguration** that will break the actual OAuth round-trip (the file's own comment says "exact URLs" — the configured list doesn't include the app's `/auth/callback` path). Rest of the findings are edge-case polish and minor test/dead-config hygiene.

## Critical Issues
None. No secrets in `.env.example` (placeholders only), only `NEXT_PUBLIC_*` keys exposed to the browser, no raw provider errors surfaced (BR-005 always renders localized copy), `redirectTo` is hardcoded off `window.location.origin` (no open-redirect vector).

## High Priority

1. **OAuth redirect URL not in Supabase's allow-list — will break the login round-trip.**
   `supabase/config.toml:149-150`:
   ```
   # A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
   additional_redirect_urls = ["http://localhost:3000", "https://127.0.0.1:3000"]
   ```
   `components/login/login-action.tsx:37` sends `redirectTo: ${window.location.origin}/auth/callback`. The allow-list comment explicitly says *exact* URL matching — `http://localhost:3000` does not match `http://localhost:3000/auth/callback`. When GoTrue can't validate the requested `redirect_to`, it falls back to `site_url` (`http://localhost:3000` → app's `/` route). That route is still the **unmodified create-next-app boilerplate** (`app/page.tsx`, confirmed — no Supabase import), so `detectSessionInUrl` never fires there, the `?code=` param is never exchanged, and the user is stranded on the default Next.js starter page with no session. This silently breaks US001/SC-001 the first time someone wires real Google credentials and clicks the button — exactly the round-trip the spec's Assumptions section flags as unverified.
   **Fix:** add the exact callback path(s) to `additional_redirect_urls`, e.g.
   ```
   additional_redirect_urls = ["http://localhost:3000", "http://localhost:3000/auth/callback", "https://127.0.0.1:3000", "https://127.0.0.1:3000/auth/callback"]
   ```
   (or a wildcard `http://localhost:3000/**` if the project's Supabase version supports glob allow-list entries). Verify against a live round-trip once real `GOOGLE_CLIENT_ID`/`SECRET` are available — this is the one thing in the whole feature that can't be caught by the current test suite (it's a GoTrue-side validation, not exercised by mocks).

## Medium Priority

2. **Timeout can produce a false "sign-in failed" flash on slow networks.**
   `app/auth/callback/page.tsx:18,66` — `SESSION_WAIT_TIMEOUT_MS = 5000` hardcoded. If the PKCE code exchange takes longer than 5s (slow network / cold Supabase instance), the callback fires `settle(false)` → redirects to `/login?error=oauth` even though the exchange may complete moments later (the exchange itself isn't cancelled — `detectSessionInUrl`'s listener is global, independent of this component). Net effect: user sees BR-005's failure message, then `LoginGuard`'s own session check on `/login` picks up the now-completed session and silently redirects to `/todo` seconds later — a confusing false-negative flash. Not spec'd as an edge case (edge-case table only covers explicit cancel/provider error, not slow-completion). Consider either a longer timeout or re-checking session state once more before finalizing failure.

3. **Tautological/no-op test assertions weaken the "66/66 pass" signal.**
   Three tests assert `expect(true).toBe(true)` inside conditional branches instead of asserting real behavior:
   - `app/todo/page.test.tsx:40-55` ("should show loading state while checking auth") — passes whether or not the loading state actually renders.
   - `components/login/login-with-google-button.test.tsx:93-102` ("should not render Google icon when submitting") — same pattern.
   - `components/login/language-selector.test.tsx:166-178` ("should not call onLocaleChange if not provided") — asserts nothing about `onLocaleChange` not being called; just checks the click didn't throw.
   These give false confidence — a regression in any of these three behaviors would not fail CI. Rewrite with deterministic assertions (e.g. `await waitFor(() => expect(screen.getByLabelText("Loading")).toBeInTheDocument())` for #1, drop the `if/else` and just assert `queryByAltText("")` is null for #2, remove the `onLocaleChange` case entirely or assert a spy wasn't called for #3 — but #3's spy IS provided in the test, so this one's just dead code (see #4).

## Low Priority

4. **Dead/unused config and translation keys** (minor DRY violations, not bugs):
   - `.env.example:4-6` — `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` are never read by any code (`lib/supabase/browser-client.ts` only reads the `NEXT_PUBLIC_*` variants). Leftover from before the client-only pivot; risks a future dev wiring a server client against a `SECRET_KEY` that's actually unused/unwired. Either wire them (if a server client is ever added) or drop them.
   - `messages/vi.json:12-15` / `messages/en.json:12-15` — `login.lang.vn` / `login.lang.en` keys are never consumed via `t()`; `components/login/language-selector.tsx:16-18` hardcodes `"VN"`/`"EN"` literals instead. Harmless today (labels are locale codes, not translated words) but redundant — either use `t()` for the labels or drop the unused keys.
   - `components/login/language-selector.test.tsx:166-178` — the "should not call onLocaleChange if not provided" test doesn't actually assert `onLocaleChange` wasn't called (see Medium #3); should be removed or fixed.

5. **`NEXT_LOCALE` cookie missing `secure` attribute.** `lib/i18n/set-locale.ts:27-31` sets `path`, `sameSite: "lax"`, `maxAge` but no `secure`. Non-sensitive preference cookie so this is cosmetic, but for a prod HTTPS deploy, add `secure: process.env.NODE_ENV === "production"` for defense-in-depth.

6. **Root `/` route is still create-next-app boilerplate** (`app/page.tsx`). Out of this login spec's scope, but worth flagging: an unauthenticated visitor landing on `/` (vs `/login`) sees the default Next.js starter page, not a redirect into the app. Low priority since not part of US001-003, but ties into Finding #1's failure mode (GoTrue's fallback lands users here).

7. **`skip_nonce_check = true`** (`supabase/config.toml:310`) — correctly commented as required for local Google sign-in; this is local-only config (prod config lives in the Supabase dashion), so no action needed here, just confirm it isn't ever mirrored into a hosted project's config.

## Edge Cases Found (scouting)

- Double-click prevention (BR-004): correctly guarded via `disabled={submitting}` in `login-with-google-button.tsx:32`; verified in tests.
- Both auth-guard directions (FR-002/003) fail-safe correctly on `getSession()` error: `/login` guard treats error as "no session" (stays on login, safe); `/todo` guard treats error as "no session" (redirects to login, safe) — asymmetric by design and correct, confirmed in `use-auth-guard.ts:44-49` and tests.
- `useSearchParams` under `<Suspense>`: both call sites (`login-hero.tsx:59` wrapping `LoginAction`, `app/auth/callback/page.tsx:86-90` wrapping `CallbackContent`) correctly satisfy the Next.js requirement.
- `cookies()` async API (Next 16): correctly awaited in `i18n/request.ts:25` and `lib/i18n/set-locale.ts:26`, with try/catch fallback to default locale in the request-config path.
- No server/SSR Supabase client anywhere — `getSupabaseBrowserClient` usages confirmed limited to `"use client"` files only (`login-action.tsx`, `use-auth-guard.ts`, `app/auth/callback/page.tsx`); the module-level singleton is safe (browser-only bundle, no cross-request state leakage risk).
- Transient double-state glitch: retrying login while `?error=oauth` is still in the URL briefly shows both the spinner (`submitting=true`) and the stale error text simultaneously until the browser navigates away to Google. Cosmetic, sub-second, not worth a fix given the page unloads almost immediately — noted, not scored.
- `LoginGuard`'s "no flash" pattern means the actual login screen markup is absent from the initial SSR HTML (client component renders the spinner branch during SSR too, since `checking` starts `true` on both server and client) — deliberate trade-off given client-only session state can't be known server-side; acceptable, but means no-JS/very-slow-JS users never see the login screen. Noted as an accepted trade-off of the client-only decision, not flagged as a defect per task instructions.

## Positive Observations

- Consistent, accurate JSDoc-style comments tying code directly back to FR/BR/SM codes — makes spec traceability easy.
- Fail-safe direction on both auth guards is correct and deliberately asymmetric (restrictive route wins on error).
- BR-005 error copy is never leaked with raw provider error text — always routed through `t("oauthError")`.
- Clean 'use client' boundaries; server components (`LoginHero`, `LoginFooter`, `LoginHeader`) stay server-rendered with only leaf interactivity hydrated.
- All files comfortably under the 200-line cap; kebab-case naming throughout; no dead "enhanced" duplicate files.
- `.env.example` has zero real secrets — only placeholders and a well-known local demo key, correctly commented as such.

## Recommended Actions (priority order)

1. Fix `supabase/config.toml` `additional_redirect_urls` to include the exact `/auth/callback` path (High #1) — do this before attempting any live OAuth test with real Google credentials.
2. Decide on and implement a policy for the callback timeout race (Medium #2) — at minimum, re-check `getSession()` once more right before finalizing `settle(false)`.
3. Fix or delete the three tautological tests (Medium #3).
4. Clean up dead `.env.example` vars and unused `login.lang.*` message keys (Low #4).
5. Optional hardening: `secure` cookie flag (Low #5).

## Metrics
- Type Coverage: no `any` in production code paths (test files use `as any` for mocks — acceptable, test-only).
- Test Coverage: 66/66 passing per environment note; ~3 of those assertions are tautological (see Medium #3), so effective coverage is slightly lower than the raw pass count implies.
- Linting Issues: 0 (per environment note; config itself is sane, standard `eslint-config-next` core-web-vitals + typescript presets).

## Unresolved Questions
- Has the live Google OAuth round-trip ever been exercised end-to-end against the local Supabase instance? Per `clarifications.md`/spec Assumptions, this was deferred pending real credentials — Finding #1 (High) is exactly the kind of bug that only surfaces on that first live attempt.
- Is a wildcard allow-list pattern (`http://localhost:3000/**`) supported by the Supabase CLI version pinned in this project, or does it require the exact-path form? Confirm against the installed Supabase CLI's config schema before choosing the fix format for Finding #1.

**Status:** DONE_WITH_CONCERNS
**Summary:** Implementation is clean, spec-accurate, and well within style/size limits; one High-severity config bug (`supabase/config.toml` redirect allow-list doesn't include `/auth/callback`, contradicting its own "exact URLs" comment) will break the real OAuth round-trip and should be fixed before live-credential testing. Remaining findings are Medium/Low polish (timeout race, 3 tautological tests, dead config/i18n keys).
**Concerns/Blockers:** High #1 blocks a successful live OAuth test but does not block merging the current client-only-auth milestone otherwise — recommend fixing before anyone wires real `GOOGLE_CLIENT_ID`/`SECRET` and attempts the round-trip.
