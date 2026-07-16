# Phase 04 — Login UI screen (presentational, Track A)

**Track:** A (UI) · **Priority:** P1 · **Status:** complete · **Depends on:** — · **Effort:** 3h

> Track A is independent — NO blocks/blockedBy on Track B. Build presentational UI with hardcoded
> VN copy as mock; Phase 6 wires i18n + OAuth + states. Owns `app/login/*`, `components/login/*`,
> `public/assets/login/*` only — does NOT touch `app/layout.tsx` (Phase 2) or the auth guard (Phase 3).

## MoMorph refs
- Login: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz (node 662:14387)
- Clarifications: plans/260716-1143-login-page-supabase/clarifications.md
- Design: `spec/login-design.png`, `spec/login-specs.csv`, `spec/login-nodetree.json`

## Goal
Pixel-close static Login screen matching `login-design.png`: fixed dark-navy header (Sun* logo left,
VN selector right), full-bleed wave hero + left intro block (huge cream "ROOT FURTHER", subtitle,
tagline, yellow "LOGIN With Google" button), fixed centered footer.

## Assets (orchestrator fetches at forge → `public/assets/login/`)
`hero-visual.png`, `sun-annual-awards-logo.png` (from MoMorph); `flag-vn.svg`, `chevron-down.svg`,
`google-icon.svg` (inline SVG). Use exact MoMorph visual values — do NOT guess colors/spacing.

## Files to Create
- `app/login/page.tsx` — assembles the screen (server component shell)
- `components/login/login-header.tsx` — logo + language-selector slot
- `components/login/language-selector.tsx` — flag + code + chevron + dropdown (VN/EN), presentational
- `components/login/login-hero.tsx` — wave visual + intro block (title/subtitle/tagline)
- `components/login/login-with-google-button.tsx` — yellow button, icon, idle/loading/disabled props
- `components/login/login-footer.tsx` — centered copyright

## Out of Scope (Phase 6 wires these)
- Real `signInWithOAuth` call, actual loading/error state logic, next-intl `useTranslations`,
  cookie write on locale change. Expose props/callbacks (`onLogin`, `isSubmitting`, `errorMessage`,
  `locale`, `onLocaleChange`) so Phase 6 plugs logic in without restructuring.

## Todo
- [x] All 6 files created, each <200 lines, kebab-case
- [x] Matches design: dark navy, fixed header/footer, cream title, yellow button, wave hero
- [x] Button exposes idle/loading/disabled visual states via props
- [x] Language selector dropdown opens/closes (local UI state), hover + pointer affordance
- [x] Assets referenced from `public/assets/login/`
- [x] Visual validation loop vs `login-design.png`; `npm run build` compiles

## Success Criteria
- Screen renders standalone at `/login` with hardcoded VN copy, visually matching the design
  (covers GUI test cases: header layout, footer fixed, hero artwork, button position, selector).

## Security Considerations
- Presentational only — no secrets, no network calls in this phase.
