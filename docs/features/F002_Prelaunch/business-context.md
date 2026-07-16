# F002 Prelaunch Countdown — Business Context

## Why this screen exists
`/` is the first thing a visitor sees for SAA 2025 "ROOT FURTHER". Before the event opens, the
landing route is a **prelaunch gate**: a short countdown that builds anticipation and then hands the
visitor off to sign-in. When the countdown ends the page redirects to `/login` (the existing Google
OAuth screen, F001), which in turn routes authenticated users onward.

## User-facing behavior
- Visitor lands on `/` and sees a dark event hero with a centered title ("Sự kiện sẽ bắt đầu sau" /
  "Event starts in") and four LED-style counters: DAYS, HOURS, MINUTES, SECONDS.
- The counter ticks down every second. After one minute it reaches `00:00:00:00` and the browser
  automatically navigates to `/login`.
- Language follows the shared `NEXT_LOCALE` cookie (default Vietnamese); there is no language
  switcher on this screen.

## Design deviations & rationale (from clarifications)
- **Fixed 1-minute countdown, not an API target datetime.** The MoMorph spec marks the
  target-datetime endpoint as a TODO. The commissioned behavior is a simple 60-second gate, so the
  countdown is hard-coded and stateless — no backend dependency, and it restarts on refresh.
- **A SECONDS unit was added** to the design's DAYS/HOURS/MINUTES. A one-minute countdown would sit
  visually static on D/H/M alone; the seconds unit lets the gate visibly tick 01:00 → 00:00 while
  keeping the same LED-box styling.
- **Simple auto-redirect, no navigation lock.** The design mentions locking navigation until the
  countdown ends; the commissioned scope is only "count down, then go to /login". The existing
  login/todo guards are untouched.
