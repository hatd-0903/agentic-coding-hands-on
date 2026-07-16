/**
 * SVG seven-segment ("LED") digit for the prelaunch countdown (MoMorph
 * 8PJQswPZmU). The design renders each digit as a segmented LED glyph — lit
 * segments bright, the remaining segments faintly visible as a "ghost 8"
 * backing — which a plain numeric font cannot reproduce, so it is drawn here
 * as seven beveled segment polygons.
 *
 * `currentColor` drives the lit segments (the cell sets the text color); unlit
 * segments reuse the same color at low opacity for the ghost effect.
 */
export interface SevenSegmentDigitProps {
  /** A single character "0"–"9". Anything else renders all segments unlit. */
  digit: string;
  className?: string;
}

// Segment polygons on a 48×88 viewBox: a/g/d horizontal, f/b/e/c vertical.
const SEGMENTS: Record<string, string> = {
  a: "10,8 15,3 33,3 38,8 33,13 15,13",
  b: "40,10 45,15 45,37 40,42 35,37 35,15",
  c: "40,46 45,51 45,73 40,78 35,73 35,51",
  d: "10,80 15,75 33,75 38,80 33,85 15,85",
  e: "8,46 13,51 13,73 8,78 3,73 3,51",
  f: "8,10 13,15 13,37 8,42 3,37 3,15",
  g: "10,44 15,39 33,39 38,44 33,49 15,49",
};

// Which segments are lit for each digit.
const DIGIT_SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

export function SevenSegmentDigit({ digit, className }: SevenSegmentDigitProps) {
  const lit = DIGIT_SEGMENTS[digit] ?? "";

  return (
    <svg viewBox="0 0 48 88" className={className} aria-hidden="true" role="presentation">
      {Object.entries(SEGMENTS).map(([key, points]) => {
        const isOn = lit.includes(key);
        return (
          <polygon
            key={key}
            points={points}
            fill="currentColor"
            opacity={isOn ? 0.95 : 0.08}
            style={isOn ? { filter: "drop-shadow(0 0 3px currentColor)" } : undefined}
          />
        );
      })}
    </svg>
  );
}
