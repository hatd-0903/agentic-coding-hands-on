/**
 * Presentational LED-style countdown unit (F002): two glass digit cells plus an
 * uppercase label beneath. Purely presentational — the container pre-pads `value`.
 *
 * The two digits are split into separate cells to match the MoMorph LED look and
 * are marked aria-hidden; a combined `aria-label` on the group ("01 MINUTES")
 * keeps the unit legible to assistive tech instead of reading "0", "1" as nodes.
 */
interface CountdownUnitProps {
  /** Two-digit, zero-padded value (e.g. "05"). */
  value: string;
  /** Localized, uppercase label (e.g. "DAYS"). */
  label: string;
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
  const padded = value.padStart(2, "0").slice(0, 2);
  const digits = [padded[0], padded[1]];

  return (
    <div className="flex flex-col items-center gap-3" aria-label={`${padded} ${label}`}>
      <div className="flex gap-1.5" aria-hidden="true">
        {digits.map((digit, index) => (
          <span
            key={index}
            className="flex h-16 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-4xl font-bold tabular-nums text-white shadow-inner sm:h-20 sm:w-16 sm:text-5xl"
          >
            {digit}
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold uppercase tracking-widest text-white">{label}</span>
    </div>
  );
}
