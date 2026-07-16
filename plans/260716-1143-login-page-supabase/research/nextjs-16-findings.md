# Next.js 16.2.10 — Breaking-Change Findings (for planner + implementer)

Source: bundled docs at `node_modules/next/dist/docs/` (AGENTS.md mandates reading these before coding).
Stack: Next 16.2.10, React 19.2.4, Tailwind v4, TypeScript 5, App Router, `@/*` → project root.

## ⚠ CRITICAL: Middleware is now "Proxy"
- Doc: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` + `.../03-api-reference/03-file-conventions/proxy.md`
- Quote: *"Starting with Next.js 16, Middleware is now called Proxy... The functionality remains the same."*
- Convention: single **`proxy.ts`** file at project root (same level as `app/`), exports `export function proxy(request: NextRequest)` (may be async) OR default export. `export const config = { matcher: [...] }`.
- Caveat: docs say Proxy is for *optimistic* auth checks, NOT full session management/authorization. The `@supabase/ssr` cookie-refresh pattern still lives here, but real authorization must ALSO be enforced in Server Components / route handlers (never rely on proxy alone).
- IMPACT: The standard Supabase Next.js guide uses `middleware.ts`. Here it MUST be `proxy.ts` with the `proxy` export. Same NextRequest/NextResponse cookie-plumbing applies.

## Key App-Router doc paths to consult during forge
- Auth guide: `01-app/02-guides/authentication.md` (incl. "optimistic-checks-with-proxy")
- Route handlers (OAuth callback): `01-app/01-getting-started/15-route-handlers.md` + `03-api-reference/03-file-conventions/route.md`
- cookies() (async since Next 15 — `await cookies()`): `01-app/03-api-reference/04-functions/cookies.md`
- layout/page/metadata: `03-api-reference/03-file-conventions/layout.md`, `page.md`; `04-functions/generate-metadata.md`
- server/client components: `01-app/01-getting-started/05-server-and-client-components.md`
- dynamic routes / params (async params in Next 15+): `03-api-reference/03-file-conventions/dynamic-routes.md`, `04-functions/generate-static-params.md`
- upgrading / breaking changes: `01-app/01-getting-started/18-upgrading.md`

## Known Next 15/16 async-API gotchas to verify in-code
- `cookies()`, `headers()`, `draftMode()` are async → `await`.
- Dynamic route `params`/`searchParams` are Promises → `await params`.
- These affect the Supabase server client (reads/writes cookies) and any `[locale]` dynamic segment.

## i18n note
- `app/layout.tsx` currently hardcodes `<html lang="en">` — must become locale-aware (NEXT_LOCALE cookie, default VN). Decide next-intl approach: cookie-based (no `[locale]` route segment) keeps `/login` and `/todo` paths clean and matches the spec (cookie NEXT_LOCALE, no locale in URL). Prefer next-intl's "without i18n routing" (cookie) setup — confirm against next-intl docs at forge time via tkm:search-docs.

## Confidence
- EXTRACTED (from bundled docs): Proxy rename, file convention, async cookies. HIGH.
- INFERRED: cookie-based next-intl over path-based routing (fits spec's NEXT_LOCALE-cookie requirement). MEDIUM — implementer to confirm.
