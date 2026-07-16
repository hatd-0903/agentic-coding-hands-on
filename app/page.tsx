import { CountdownHero } from "@/components/countdown/countdown-hero";
import { CountdownTimer } from "@/components/countdown/countdown-timer";

/**
 * Landing route (`/`) — SAA 2025 prelaunch gate (F002). Shows a fixed 60s countdown
 * over the event hero art and auto-redirects to `/login` once it reaches zero.
 * See docs/features/F002_Prelaunch/technical-spec.md.
 */
export default function Home() {
  return (
    <CountdownHero>
      <CountdownTimer />
    </CountdownHero>
  );
}
