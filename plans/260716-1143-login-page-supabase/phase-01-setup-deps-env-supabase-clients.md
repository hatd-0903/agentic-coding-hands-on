# Phase 01 — Setup: deps, env, config, Supabase browser client

**Track:** B (backend/logic) · **Priority:** P1 · **Status:** complete · **Depends on:** — · **Effort:** 1h

> **Revised (client-only auth):** dropped `@supabase/ssr`, the server client, and the proxy-session
> helper. Auth is browser-only (`@supabase/supabase-js`, PKCE, session in localStorage).

## Context Links
- Findings: `research/nextjs-16-findings.md`
- Architecture: `spec/system/architecture.md` (client-only auth)
- Clarifications: `clarifications.md` (env-wired Google creds)
- Existing: `supabase/config.toml`, `.env.example`, `package.json`, `tsconfig.json` (`@/*` → root)

## Overview
Install auth + i18n deps, wire the `NEXT_PUBLIC_` Supabase env vars, fix the local Google OAuth
config, and create ONE browser Supabase client (PKCE, `detectSessionInUrl`). Prereq for phases 2, 3, 5.
Does NOT touch UI (Track A) or `app/layout.tsx` (Phase 2 owns it).

## Key Insights
- ⚠ `supabase/config.toml` **already has** `[auth.external.google]` (enabled, `env(GOOGLE_CLIENT_ID)`/
  `env(GOOGLE_CLIENT_SECRET)`). Only change needed: set `skip_nonce_check = true` — the config
  comment itself states this is "Required for local sign in with Google auth."
- The browser client needs `NEXT_PUBLIC_`-prefixed vars — add them to `.env.example`.
- **Client-only:** no server client, no `await cookies()`, no proxy helper. Session lives in the
  browser (localStorage), auto-refreshed by supabase-js. PKCE flow + `detectSessionInUrl: true` lets
  the client auto-exchange the OAuth `?code=` on the callback page (Phase 5).

## Requirements
- FR-001 (OAuth via Supabase) — foundation only. No secrets committed; `.env.example` placeholders only.

## Related Code Files
**Create:**
- `lib/supabase/browser-client.ts` — singleton `createClient(url, anonKey, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } })` reading `NEXT_PUBLIC_` vars.

**Modify:**
- `package.json` — add `@supabase/supabase-js`, `next-intl` (deps). (NO `@supabase/ssr`.)
- `.env.example` — add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `supabase/config.toml` — `[auth.external.google].skip_nonce_check = true`

## Implementation Steps
1. Confirm latest Next-16-compatible versions via `tkm:search-docs`, then
   `npm install @supabase/supabase-js next-intl`.
2. `.env.example`: add `NEXT_PUBLIC_SUPABASE_URL` (local `http://127.0.0.1:54321`) and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (local anon/publishable key). Keep existing server keys.
3. `config.toml`: set `skip_nonce_check = true` under `[auth.external.google]`.
4. Create `lib/supabase/browser-client.ts` — export a memoized singleton browser client. Throw a
   clear error if the `NEXT_PUBLIC_` vars are missing.

## Todo
- [x] Deps installed (`@supabase/supabase-js`, `next-intl`), `package.json` + lockfile updated
- [x] `.env.example` has NEXT_PUBLIC_ Supabase vars
- [x] `config.toml` `skip_nonce_check = true`
- [x] `browser-client.ts` created (<200 lines), singleton, PKCE + detectSessionInUrl
- [x] `npm run build` compiles

## Success Criteria
- `npm install` clean; `npm run build` compiles; browser client importable in a client component.
- No real secrets in `.env.example`; only placeholders/local defaults.

## Security Considerations
- Only the publishable/anon key is `NEXT_PUBLIC_`. `SUPABASE_SECRET_KEY` / `GOOGLE_CLIENT_SECRET`
  stay server-only, never `NEXT_PUBLIC_`, never committed with real values.
- `skip_nonce_check=true` is **local-only** dev convenience — production must revisit.
- ⚠ Client-only guarding is not a security boundary — it prevents casual access, not a determined
  user. Acceptable per the client-only decision (`clarifications.md`); note for future hardening.

## Next Steps
Unblocks Phases 2, 3, 5.
