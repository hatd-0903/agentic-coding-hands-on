# SAA 2025 Login Page — Supabase OAuth & Middleware Reckoning

**Date**: 2026-07-16 17:00  
**Severity**: Medium (deferments, no critical production block)  
**Component**: Authentication, /login screen, next-intl locale routing  
**Status**: Resolved with planned deferrals

## What Happened

Built the SAA 2025 login page (/login) from MoMorph screen GzbNeVGJHz with Supabase Google OAuth (client-only PKCE flow), cookie-based next-intl locale switching (VN/EN, default VN), and auth guards routing between /login and /todo. Six conventional commits landed on `feat/login-page-supabase-oauth`. Build passed: 65/65 vitest tests, 0 lint violations, reviewer green with ship-ready sign-off (7.5/10 after fixes). Live OAuth round-trip and wave asset deferred to next session.

## The Brutal Truth

The session was clean on the surface but sat on real constraints underneath. Three hours burned on an MCP auth header that was stored as a literal shell string instead of expanding when registered — not a code bug, but an environment setup problem that punches hard when you can't just restart the session. Worked around it with curl-based MCP-over-HTTP, which is fine for one-off data pulls but feels brittle for a real workflow. User pivoted the whole auth architecture post-blueprint (SSR+proxy → client-only), which meant rewriting the spec drafts to match the actual design before shipping docs. The host environment lacks Python and Docker, so the spec→docs pipeline (`rebuild-spec`, `promote`, `gen-gate`) couldn't run — fell back to manual file copy and a "SKIPPED" marker. And the wave hero asset from the design turned out not to exist in the exports, so CSS gradients became the stand-in. None of this killed the work, but each one was a small sting.

## Technical Details

**MoMorph MCP Auth Failure:**  
- Error: `Unauthorized (401)` on `get_frame()` call, mid-session
- Root: MCP header stored the literal string `$(gh auth token)` instead of the expanded token value
- Debugging chain: checked gh auth status (✓ logged in), checked stored MCP header (caught the literal), re-registered with proper token expansion
- Live session had cached the bad connection, so created a workaround: direct HTTP POST to MCP server at `http://localhost:3000/tools/call` with proper headers to fetch frame metadata, specs (CSV), test cases (CSV), node tree, and image/media assets
- Lesson: MCP header command substitution happens at registration time in the shell that runs `claude mcp add`. Verify the stored value in `~/.claude/mcp.json`, not just that the upstream tool (gh) is logged in. For future: document the expanded header in a safe place or use an env var for sensitive values.

**Next.js 16 Middleware → Proxy Breaking Change:**  
- Discovered via `AGENTS.md` mandate (read bundled docs before coding)
- Old pattern: `middleware.ts` with `export middleware`; returns `NextResponse.redirect()`, boots on every request
- New pattern: `proxy.ts` with `export function proxy` — routing/auth happens upstream in Node, not browser
- Didn't end up using it (client-only auth), but the standard Supabase + Next.js SSR guide still shows the old Middleware pattern; would silently no-op on Next.js 16+
- Lesson: `AGENTS.md` exists for exactly this. Check it first, not last.

**User Pivoted Auth Architecture:**  
- Blueprint approved: SSR + `@supabase/ssr` + Proxy middleware pattern
- User clarification (mid-session): "Actually, let's do client-only PKCE — simpler, no SSR coupling"
- Impact: architecture.md, permissions.md, technical-spec.md all became wrong mid-stream
- Response: rewrote those docs to match the actual (client-only) design, flagged the pivot in the plan commit message
- Lesson: Architecture changes are architecture changes. Don't ship misleading docs because the code pivoted. Catch it early and make the record true.

**Runtime Validation Surfaced Real Bugs:**  
1. `lib/i18n/set-locale.ts` marked `"use server"` but exported a string constant (`DEFAULT_LOCALE`). Re-exported in client component → `500 Internal Server Error` at build time. Build system was silent; Playwright test caught the actual runtime break.
2. `supabase/config.toml`: `additional_redirect_urls` was missing the `/auth/callback` path. Would work locally (Supabase fake server accepts any callback), but live Google OAuth would reject it. Reviewer caught it in code review.
3. Lesson: Test the actual error paths. The build can hide server-side serialization breaks. Lint won't catch permission violations. Real validation (tests + human review) earns its place.

**Environment Constraints — No Python, No Docker:**  
- Host has no Python interpreter, no Docker daemon running
- Impact: `rebuild-spec` (Python script), `promote` (Python script), `gen-gate` (Docker container with Supabase CLI + gen-gate binary) all fail
- Response: Promoted specs manually (copied `schema/screens/GzbNeVGJHz.md` → `docs/features/login-page.md`, flipped frontmatter from `draft: true` to `status: active`, merged clarifications inline). Marked `gen-gate` as SKIPPED with reason in the evidence gate. Live E2E OAuth testing deferred to next session (needs Docker + real Google OAuth credentials).
- Lesson: The pipeline assumes a standard dev environment. Broken assumption on an atypical host → adapt with manual steps and flag what's deferred. Don't pretend the gate passed when it didn't.

**Wave Hero Asset Missing:**  
- MoMorph export labeled "hero" as media, but it was actually the ROOT FURTHER logotype (text, not a wave)
- No wave SVG or image exists in the design
- Response: approximated with CSS `linear-gradient` + `radial-gradient` (blue→teal→white). Visually close enough for ship, flagged for design review
- Lesson: Design-to-code export isn't always literal. Verify media assets exist before assuming them.

## What We Tried

1. **MCP auth workaround**: Direct HTTP POST to localhost MCP server → worked for one-off calls, but not sustainable
   - Alternative (not tried): Re-register the MCP connection in a fresh shell and reload the session
   - Alternative (not tried): Extract the token offline and hardcode it (not security-minded)
   - Chose: Curl workaround for now, document the shell-expansion lesson for next time

2. **Middleware pattern conflict**: Verified Next.js 16 docs in `node_modules/next/dist/docs/` → confirmed Proxy is the new standard
   - Didn't need it for client-only flow, so sidestepped it
   - If SSR had stayed: would have switched to Proxy pattern per docs

3. **Auth architecture pivot**: Rewrote spec docs instead of shipping old ones
   - Considered: keeping SSR plan as "Phase 2 optimization"
   - Rejected: lying about the current design defeats the purpose of docs
   - Chose: Update docs to match implementation, add a note about SSR as future work

4. **Missing test coverage on server components**: Added `"use server"` guard to `set-locale.ts`, then tested with Playwright
   - Alternative (not tried): ESLint plugin to auto-detect server/client serialization violations
   - Chose: runtime validation + code review

5. **gen-gate environment failure**: Marked gate as SKIPPED instead of failing the whole build
   - Alternative (not tried): Install Docker and Python, extend the session
   - Chose: Defer and flag. Evidence gate still sealed (hard), just with a reason note.

## Root Cause Analysis

| Issue | Immediate Cause | Underlying Root |
|-------|-----------------|-----------------|
| MCP auth 401 | Literal `$(gh auth token)` in stored header | No feedback loop at MCP registration time; shell expansion silent at config write |
| Next.js Middleware missed | Didn't re-read docs before coding | Assumption that old patterns still work; AGENTS.md mandate exists for this |
| Auth architecture drift | User changed mind mid-session | Blueprint was strict, but real-time clarification is honest (better than shipping wrong code) |
| Server component serialization 500 | `"use server"` marking + client re-export | Type system doesn't enforce this; linters don't catch it; only runtime sees it |
| Wave asset gap | Design export mislabeled | Design tool export incomplete or designer habit of using placeholder shapes |
| gen-gate skipped | No Python/Docker on host | Deployment target has different constraints than dev machine |

The galling part: none of these are "bugs" in the traditional sense. They're all _context mismatches_ — between what the tools assume and what the environment provides, between the blueprint and the real conversation, between the type system and the runtime. The lesson isn't "we made a mistake." It's "these gaps surface in the cracks between layers, and you have to look there."

## Lessons Learned

1. **MCP header registration is shell-dependent.** Command substitution in MCP headers happens at `claude mcp add` time, in that shell's context. Verify the stored header in `~/.claude/mcp.json` — not the upstream tool's auth status. For next time: document the expanded token or use an environment variable.

2. **Next.js 16 is a breaking version.** Old Middleware patterns silently no-op. Read `AGENTS.md` and the bundled docs (in `node_modules/next/dist/docs/`) before coding, especially on a major version jump. Don't assume forward compatibility.

3. **Architecture clarifications mid-stream are OK, but docs must follow.** User pivots are real and often right. The crime is shipping misleading docs because the code changed. Update the record when the design changes. Flag the pivot in commit messages.

4. **Runtime validation catches what linters miss.** Server/client serialization breaks, missing OAuth callback paths, edge-case permission violations — tests + review catch these. The build is not the final word.

5. **Environment constraints force honest deferrals.** No Python, no Docker — the pipeline can't run. Don't fake the gate. Mark it SKIPPED with reason. Better to surface the blocker than to ship a false pass.

6. **Design exports aren't always complete.** Media assets vanish, placeholders get exported as if real. Verify before assuming. Flag design gaps back to the designer.

7. **The value of the plan isn't correctness at day 1 — it's updating correctness when reality changes.** Specs, architecture, permissions all drifted as the user's intent clarified. The plan's job was to stay in sync, not to predict perfectly.

## Next Steps

1. **Live Google OAuth E2E** (Manual, blocker on Docker + real credentials)
   - Spin up local Supabase (`supabase start` in project root)
   - Register OAuth app in Google Cloud Console (dev tenant)
   - Set callback URL to `http://localhost:3000/auth/callback`
   - Test sign-in flow: /login → Google consent → callback → /todo redirect
   - Owner: DevOps/QA (credentials setup), or assign post-Docker availability

2. **Wave hero asset design review** (Designer sign-off, next session)
   - Share screenshot of current CSS-gradient wave approximation
   - Request: final wave SVG or guidance on asset location
   - If no wave needed: remove the hero section and simplify the layout

3. **Middleware/SSR as Phase 2 optimization** (Future, not this cycle)
   - If session handling or performance needs improvement, revisit Proxy + SSR
   - Add to tech debt / nice-to-have in roadmap

4. **Python + Docker on host** (Infrastructure, nice-to-have)
   - If other projects need `gen-gate` / `rebuild-spec`, set up the host environment
   - Until then: manual promote steps work fine for one-off features

**Status**: RESOLVED. Code ships, docs true, deferments clear.
