/**
 * Presentational hero shell for the prelaunch countdown screen (MoMorph 8PJQswPZmU).
 *
 * The MoMorph screen ships a full-bleed root-pattern background asset, but no asset
 * was re-exported into this build; as with `components/login/login-hero.tsx` the art
 * is approximated with layered blurred gradients over the design's dark navy base
 * (#00101A), plus the design's "Cover" overlay so centered content stays legible.
 * Swap in the real asset if/when one is exported from Figma.
 */
const WAVE_BLOBS = [
  "absolute -top-16 right-[-8%] h-[440px] w-[620px] rotate-[16deg] rounded-[50%] bg-[#caa156] blur-3xl opacity-70",
  "absolute top-[6%] right-[2%] h-[380px] w-[540px] rotate-[8deg] rounded-[50%] bg-[#d9823f] blur-3xl opacity-60",
  "absolute top-[38%] right-[14%] h-[300px] w-[460px] rotate-[-6deg] rounded-[50%] bg-[#2f8a63] blur-3xl opacity-50",
  "absolute bottom-[-12%] right-[-4%] h-[380px] w-[440px] rotate-[10deg] rounded-[50%] bg-[#33397a] blur-3xl opacity-60",
];

export function CountdownHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#00101A]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[20%] right-0 overflow-hidden"
      >
        {WAVE_BLOBS.map((className) => (
          <div key={className} className={className} />
        ))}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(0,16,26,0.4)_0px,rgba(0,16,26,0.4)_2px,transparent_2px,transparent_14px)] mix-blend-multiply" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(18deg,#00101A_15%,rgba(0,18,29,0.55)_52%,rgba(0,19,32,0)_66%)]"
      />
      <div className="relative z-10 px-6 py-24 sm:px-12">{children}</div>
    </section>
  );
}
