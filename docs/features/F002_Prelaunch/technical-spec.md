---
feature: F002_Prelaunch
title: Prelaunch Countdown Page
lang: en
status: implemented
source: momorph screen 8PJQswPZmU (Countdown - Prelaunch page)
route: /
---

# F002 — Prelaunch Countdown Page

## Summary
The app landing route (`/`) is a prelaunch gate: a full-bleed dark hero (SAA "ROOT FURTHER"
root-pattern art) showing a **fixed 1-minute** countdown. When the countdown reaches zero the
page **auto-redirects to `/login`**. Reuses the existing next-intl setup (default VN).

## Deviations from MoMorph design (per clarifications)
- Design specs a target-datetime-from-API countdown (D/H/M). Per user instruction the countdown is
  a **hard-coded 60 seconds from page load** — no API endpoint is built.
- A **SECONDS** unit is added to the design's DAYS/HOURS/MINUTES so a 1-minute countdown visibly
  ticks (MM:SS: 01:00 → 00:00). All four units keep the design's LED-box style.
- No global "navigation lock"; the page simply auto-redirects to `/login` at zero.
- Background art is a CSS gradient approximation (no wave asset exported), consistent with the login hero.

## Functional Requirements
- FR-001 — `/` renders the countdown screen: dark background + root/wave art, centered localized
  title, four LED-style 2-digit unit boxes (DAYS, HOURS, MINUTES, SECONDS) with uppercase labels.
- FR-002 — Countdown starts at 60 seconds on mount and decrements once per second.
- FR-003 — Each unit renders **2-digit zero-padded** (days 00–99, hours 00–23, minutes 00–59,
  seconds 00–59). For 60s: DAYS 00 / HOURS 00 / MINUTES 01→00 / SECONDS 59→00.
- FR-004 — On reaching zero, all units show `00` and the page redirects to `/login` (once).
- FR-005 — Title + labels localized via next-intl (`countdown` namespace); locale from the existing
  `NEXT_LOCALE` cookie (default VN). No language switcher on this screen.

## Business Rules
- BR-001 — Countdown value is clamped at zero (never negative); redirect fires exactly once.
- BR-002 — Timer interval is cleared on unmount; no redirect after unmount.
- BR-003 — Refreshing the page restarts the 60-second countdown (fixed-duration, stateless).

## Non-Functional
- NFR-001 — Client component; no hydration mismatch (initial paint = 00:00:01:00).
- NFR-002 — Files < 200 lines, kebab-case, reuse existing Tailwind v4 + next-intl conventions.

## Success Criteria
- SC-001 — `/` shows the countdown UI, close to the MoMorph design.
- SC-002 — Countdown ticks down each second from 01:00 (M:S).
- SC-003 — At zero the browser lands on `/login`.
- SC-004 — VN default; EN when `NEXT_LOCALE=en`; title + labels localized.
- SC-005 — Build clean, lint clean, unit tests for format/redirect logic pass.

## Out of Scope
- Target-datetime API endpoint; global navigation lock; per-user event schedules.
