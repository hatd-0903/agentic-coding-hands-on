---
status: draft
authored_by: takumi
created: 2026-07-16
lang: en
---

# Permissions

> Forward-drafted because the Login feature introduces the app's first auth/route-guard layer.
> Curated, plain-language view — no PERM### codes (none are allocated yet; raw matrix generation
> happens post-implementation). Rationale belongs in an ADR, not here.

## Authorization System Type

**System Type**: `other` — a binary authenticated/unauthenticated gate, not role-based. There are
no roles, permission levels, or ownership rules at this stage — just "has a valid Supabase session
or not."

**Identified Roles**:
- Unauthenticated visitor
- Authenticated user (any Google account — no domain restriction, no role tiers)

## Curated View

- **Unauthenticated visitor** can access `/login` and complete Google OAuth sign-in. Cannot access
  `/todo` — any attempt redirects to `/login`.
- **Authenticated user** can access `/todo`. Cannot access `/login` while a session is valid — any
  attempt redirects to `/todo`.
- There is no distinction between authenticated users — every Google account that completes OAuth
  is treated identically (TBD (draft) whether future stages introduce roles/tiers).

## Access Boundaries

The only boundary is session presence, enforced **client-side** (`lib/auth/use-auth-guard.ts`)
reading the Supabase browser-client session. There is no ownership model, no admin/user split, and
no per-resource permission — the app currently has exactly two routes (`/login`, `/todo`) gated
against each other. **Note:** client-only gating is UX-level, not a server-enforced security
boundary (per the client-only decision) — flagged for future hardening.

## Special Conditions

- No domain allowlist: any verified Google account is accepted (explicit product decision, see
  `technical-spec.md` BR-001).
- Locale selection (`NEXT_LOCALE` cookie) does not affect access — it only changes displayed
  language, never route availability.
- No special conditions beyond the binary auth gate identified.
