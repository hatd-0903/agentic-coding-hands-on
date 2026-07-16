# Phase 07 — Tests (unit/component + guard logic)

**Track:** — · **Priority:** P1 · **Status:** complete · **Depends on:** Phase 6 · **Effort:** 2h

> Runs against the FINAL simplified code. No test framework is installed yet — Step 1 adds one.
> Tester agent executes; no faking/mocking to force a green build. Live Google round-trip stays a
> manual checklist item until real creds are supplied.

## Context Links
- Spec verification: `spec/login/technical-spec.md` (SC-001..SC-004, SM-001)
- Test cases: `spec/login-testcases.csv` (GUI + FUNCTION rows)

## Overview
Prove behavior at three levels — unit (pure logic), component (React), and a scoped integration of
the guard + callback branch logic. Defer only the live OAuth network round-trip.

## Test Matrix
| Layer | Target | Asserts | Spec |
|-------|--------|---------|------|
| unit | `i18n/request.ts` | no cookie → `vi`; `NEXT_LOCALE=en` → `en` | BR-006, SC-004 |
| unit | `use-auth-guard` hooks | authed+/login→replace('/todo'); unauthed+/todo→replace('/login'); else render | BR-002/003, SC-002 |
| unit | callback page logic | session→replace('/todo'); error/timeout→replace('/login?error=oauth') | FR-001, INT-001 |
| unit | `/todo` guard | no session → redirect /login (client guard) | permissions |
| component | `login-with-google-button` | idle/submitting(disabled+spinner)/error visuals; double-click no-op | SM-001, BR-004 |
| component | `language-selector` | dropdown open/close; select → onLocaleChange fired | SC-004, US003 |
| component | login screen | renders title/subtitle/tagline/footer copy from catalog | GUI test rows |
| manual (E2E) | full OAuth | real Google login → /todo (post-creds) | SC-001 |

## Related Code Files
**Create:**
- test files colocated or under `__tests__/` mirroring targets (kebab-case, `*.test.ts(x)`)
- test setup/config as the chosen runner requires

## Implementation Steps
1. Confirm Next-16-compatible test runner via `tkm:search-docs` (Vitest + React Testing Library
   recommended for RSC-era; confirm). Install as devDeps; add `test` script to `package.json`.
2. Write unit tests for i18n default, client auth-guard branches, callback page branches, /todo
   redirect (mock the Supabase browser client boundary only — never the code under test).
3. Write component tests for button states, selector, and copy rendering.
4. Document the manual E2E OAuth checklist (needs `npx supabase start` + real creds).

## Todo
- [x] Test runner installed + `test` script added
- [x] Unit: i18n default, client auth-guard (both directions + render), callback branches, /todo redirect
- [x] Component: button 3 states + double-click, selector, copy rendering
- [x] Manual E2E OAuth checklist documented
- [x] All tests pass; none skipped/faked to go green (65/65 passing, Vitest + React Testing Library)
- [ ] Live OAuth round-trip E2E (deferred — requires Docker Supabase + real creds; see `reports/tester-260716-1314-login-tests.md`)

## Success Criteria
- SC-001 (button-initiates + callback logic), SC-002 (guard both ways), SC-003 (error state),
  SC-004 (locale default + switch) covered by passing automated tests; live OAuth on manual checklist.

## Risk Assessment
- **MED — RSC/async-cookies testability.** Server components + `await cookies()` are awkward to unit
  test. Countermove: extract branch logic into plain functions the tests call directly; keep RSC
  wrappers thin.

## Security Considerations
- Tests use fixtures/local anon key only — no real secrets, no committed `.env`.
