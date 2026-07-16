# F002 Prelaunch Countdown — Edge Cases

| # | Case | Handling |
|---|------|----------|
| 1 | Unmount mid-countdown | `useCountdown` clears its `setInterval` in the effect cleanup, so the tick callback cannot run — and cannot redirect — after the component unmounts (BR-002). |
| 2 | Redirect double-fire (React StrictMode) | `countdown-timer` guards the redirect with a `useRef` flag; the effect firing twice in dev navigates only once (BR-001). |
| 3 | Value reaches / passes zero | Both the pure helpers (`secondsToUnits`, `pad2`) and the interval updater clamp at 0 — the display never shows a negative value, and the interval self-clears at zero so it stops ticking. |
| 4 | Page refresh | The countdown is stateless and fixed-duration, so a refresh simply restarts the 60-second countdown (BR-003). |
| 5 | Hydration | `useState` is seeded synchronously from the fixed constant (60), so the server render and first client render agree — no hydration mismatch (NFR-001). |
| 6 | Mounted at zero | If `useCountdown(0)` is ever used, `isComplete` is true immediately and the interval is never started; the redirect fires on the first effect. |
| 7 | Screen-reader output | Each unit exposes a combined `aria-label` ("01 MINUTES") and marks the split digit cells `aria-hidden`, so AT reads the value as one token rather than "0", "1". |
