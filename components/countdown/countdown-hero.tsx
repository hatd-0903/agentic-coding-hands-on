import Image from "next/image";

/**
 * Presentational hero shell for the prelaunch countdown screen (MoMorph 8PJQswPZmU).
 *
 * The design is a full-bleed dark navy background with the colorful organic "root"
 * pattern art spanning the viewport, plus a semi-transparent dark overlay so the
 * centered countdown stays legible. The root art was exported into this build as
 * `/assets/home/keyvisual-bg.png` (shared with the homepage/awards hero), so it is
 * used directly here rather than the earlier CSS-gradient approximation.
 */
export function CountdownHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#00101A]">
      <Image
        src="/assets/home/keyvisual-bg.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover"
      />
      {/* Design "Cover" overlay — darkens the left/center so the countdown reads clearly over the art. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,#00101A_0%,rgba(0,16,26,0.75)_45%,rgba(0,16,26,0.15)_100%)]"
      />
      <div className="relative z-10 px-6 py-24 sm:px-12">{children}</div>
    </section>
  );
}
