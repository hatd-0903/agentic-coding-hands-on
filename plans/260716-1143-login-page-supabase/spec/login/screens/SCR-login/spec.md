---
status: draft
authored_by: takumi
created: 2026-07-16
---

# SCR-login — Screen Spec

**Screen**: SCR-login (TBD (draft) — SCR### allocated at promote)
**Feature**: login (TBD (draft) — F### allocated at promote)
**Type**: composite
**Route**: `/login`
**Generated**: 2026-07-16

## Purpose

Lets any Google-account holder sign in to the SAA 2025 "ROOT FURTHER" app in one click; it is the
first and only screen an unauthenticated visitor sees.

## Screen Layout

Three stacked regions: a fixed-top header (logo left, language selector right), a full-bleed hero
main section (decorative wave art background with an overlaid intro block on the left — title,
subtitle, tagline, login button), and a fixed-bottom footer (centered copyright text). No sidebar,
no scrollable content — the whole screen fits one viewport (per `login-design.png`).

### Layout Sketch

```
┌──────────────────────────────────────────────────────┐
│ R1: Header (fixed-top)                                │
│  [Sun* Annual Awards 2025 logo]      [flag VN ▾]      │
├──────────────────────────────────────────────────────┤
│ R2: Hero Main (static, full-bleed background)          │
│  ┌───────────────────────┐                             │
│  │ R2a: Intro Block (L)  │      R2b: Wave Visual        │
│  │  ROOT                 │      (decorative, behind/    │
│  │  FURTHER              │       right side, extends    │
│  │  subtitle + tagline   │       under R2a)              │
│  │  [LOGIN With Google]  │                              │
│  └───────────────────────┘                             │
├──────────────────────────────────────────────────────┤
│ R3: Footer (fixed-bottom) — "Bản quyền thuộc về Sun*   │
│      © 2025" (centered)                                │
└──────────────────────────────────────────────────────┘
```

### Layout Regions

| Region ID | Name | Position | Scrollable | Key Components | Responsive Behavior |
|-----------|------|----------|------------|-----------------|------------------------|
| R1 | Header | fixed-top | no | Brand logo, Language selector (flag + code + chevron) | always visible, logo stays left / selector stays right at all widths |
| R2 | Hero Main | static (fills viewport between header/footer) | no | Hero wave visual (background), Intro Content Block (title, subtitle, tagline, Google login button) | intro block left-aligned; wave visual scales/crops behind it |
| R2a | Intro Content Block | static, overlaid on R2, left-aligned | no | "ROOT FURTHER" title, subtitle text, tagline text, "LOGIN With Google" button | TBD (draft) — stacking behavior on narrow viewports not specified |
| R3 | Footer | fixed-bottom | no | Copyright text | always visible, centered at all widths |

## User Flow

### Happy Path

1. User lands on the Login Screen (R2) and sees the hero visual, "ROOT FURTHER" title, welcome
   copy, and the "LOGIN With Google" button in R2a; the language selector in R1 shows VN by default.
2. User clicks "LOGIN With Google" in R2a — the button shows a loading indicator and becomes
   disabled.
3. Google's OAuth consent flow completes successfully — the user leaves this screen and is taken
   to the Todo Screen (hand-off outside this screen's scope).

### Branches

| Decision point | Condition | Outcome on this screen | Source |
|-----------------|-----------|----------------------------|--------|
| Step 1 (screen load) | Visitor already has a valid Supabase session | Screen never renders — redirected to Todo Screen before paint | TBD (draft) |
| Step 2 (after click) | Google OAuth fails or is cancelled | Button returns to idle (re-enabled); inline message "Đăng nhập không thành công. Vui lòng thử lại." appears near the button | TBD (draft) |
| R1 language selector click | User picks VN or EN from the dropdown | All visible copy on this screen re-renders in the chosen language | TBD (draft) |

## UI States

| State | Trigger | Visual Behavior | User Action Available | Source |
|-------|---------|-------------------|--------------------------|--------|
| idle | initial load / after error reset | button shows label + Google icon, normal fill | click button | TBD (draft) |
| loading | OAuth request in-flight (click on button) | button disabled, shows loading indicator in place of/alongside label | none | TBD (draft) |
| error | OAuth failure or cancel | button back to idle visual; inline error message shown | retry (click button) | TBD (draft) |
| success/redirect | OAuth success | screen unmounts — user navigates to Todo Screen | none (hand-off) | TBD (draft) |
| language-dropdown-open | click on language selector in R1 | dropdown list of VN/EN appears below selector | pick a language, or click elsewhere to dismiss | TBD (draft) |

## Validation & Error Feedback

### A) Client-side

N/A — no client-side form validation detected. This screen has no input fields; the only
interactive controls are the language selector (a fixed two-option picker) and the single OAuth
button.

### B) Server-side

#### Google OAuth Sign-In

- **Endpoint:** TBD (draft) — Supabase Auth OAuth callback route; exact Next.js 16 route path/API
  to be confirmed against `node_modules/next/dist/docs/` at implementation time
- **Request:** none — this screen sends no form fields; the OAuth redirect carries no
  screen-originated payload
- **Success:** redirect to `/todo`
- **Errors:** OAuth denied/cancelled → "Đăng nhập không thành công. Vui lòng thử lại."
- **Trigger:** click "LOGIN With Google" button
- **Source:** TBD (draft)

## Accessibility

[NO_A11Y_DETECTED] — accessibility audit needed before production release. ARIA labeling for the
login button and language selector, keyboard reachability, dropdown focus management, and screen
reader behavior are all undecided at this design stage.
