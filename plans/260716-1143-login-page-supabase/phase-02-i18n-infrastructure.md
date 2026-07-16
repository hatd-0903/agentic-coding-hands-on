# Phase 02 — i18n infrastructure (next-intl, cookie-based)

**Track:** B · **Priority:** P1 · **Status:** complete · **Depends on:** Phase 1 · **Effort:** 2h

## Context Links
- Findings: `research/nextjs-16-findings.md` (i18n note — cookie, no `[locale]` segment)
- Spec: `spec/login/technical-spec.md` (FR-004, BR-006, SC-004, US003)
- Existing: `app/layout.tsx` (hardcodes `<html lang="en">`), `next.config.ts` (bare)

## Overview
Stand up `next-intl` in **"without i18n routing"** (cookie) mode so `/login` and `/todo` stay clean
(no `/vi`, `/en` path prefix). Default locale VN. Locale read from `NEXT_LOCALE` cookie server-side.
Make the root layout locale-aware and provide messages to client components.

## Key Insights
- Cookie mode (no i18n routing) matches the spec exactly: `NEXT_LOCALE` cookie, no URL locale.
  Confirm the exact `next-intl` API for this mode via `tkm:search-docs` — it differs from the
  path-routing quickstart most examples show.
- Locale resolution lives HERE (next-intl request config), NOT in `proxy.ts` — keeps Phase 2 and 3
  decoupled (KISS). Architecture.md's "middleware resolves locale" note is superseded by this.
- `<html lang>` must reflect the active locale; layout reads locale via next-intl's server helper.

## Requirements
- FR-004: persist + apply VN/EN via `NEXT_LOCALE` cookie. BR-006: default VN when cookie absent.
- Both catalogs cover ALL login-screen copy (title, subtitle, tagline, button, error, selector).

## Related Code Files
**Create:**
- `i18n/request.ts` — next-intl request config: read `NEXT_LOCALE` cookie (`await cookies()`), default `vi`
- `i18n/locale.ts` — server action `setLocale(locale)` writes `NEXT_LOCALE` cookie; `getLocale()` reader
- `messages/vi.json` — VN login catalog
- `messages/en.json` — EN login catalog

**Modify:**
- `next.config.ts` — wrap with `createNextIntlPlugin('./i18n/request.ts')`
- `app/layout.tsx` — locale-aware `<html lang={locale}>`, wrap children in `NextIntlClientProvider`,
  keep existing Geist fonts + body classes

## Message Catalog (from design + spec)
| key | vi | en |
|-----|----|----|
| `title.line1` | ROOT | ROOT |
| `title.line2` | FURTHER | FURTHER |
| `subtitle` | Bắt đầu hành trình của bạn cùng SAA 2025. | Start your journey with SAA 2025. |
| `tagline` | Đăng nhập để khám phá! | Log in to explore! |
| `loginButton` | LOGIN With Google | LOGIN With Google |
| `oauthError` | Đăng nhập không thành công. Vui lòng thử lại. | Sign-in failed. Please try again. |
| `footer` | Bản quyền thuộc về Sun* © 2025 | Copyright Sun* © 2025 |
| `lang.vn` / `lang.en` | VN / EN | VN / EN |

(EN strings are drafts — confirm final EN copy with product before Phase 6 wiring.)

## Implementation Steps
1. Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` +
   `.../04-functions/cookies.md`.
2. `tkm:search-docs` next-intl "without i18n routing" (App Router, cookie) — confirm request.ts shape.
3. Create `messages/vi.json` + `messages/en.json` per table above.
4. Create `i18n/request.ts` (cookie read, default `vi`) and `i18n/locale.ts` (server action set/get).
5. Wrap `next.config.ts` with the next-intl plugin pointing at `i18n/request.ts`.
6. Make `app/layout.tsx` locale-aware + provider; preserve fonts/body classes.

## Todo
- [x] messages/vi.json + en.json cover all keys
- [x] i18n/request.ts defaults to vi, reads NEXT_LOCALE
- [x] i18n/locale.ts setLocale/getLocale
- [x] next.config.ts wrapped with plugin
- [x] layout.tsx locale-aware + NextIntlClientProvider
- [x] `npm run build` compiles; `<html lang>` reflects cookie

## Success Criteria
- No `NEXT_LOCALE` cookie → VN renders (BR-006). Setting `NEXT_LOCALE=en` → EN renders.
- Paths remain `/login`, `/todo` (no locale prefix). Covers SC-004 (infra half).

## Security Considerations
- Locale cookie is non-sensitive; `httpOnly` not required (client selector must read/write it).
  Set `sameSite=lax`, `path=/`.

## Next Steps
Provides `useTranslations` keys consumed by Phase 6 when wiring copy into the UI.
