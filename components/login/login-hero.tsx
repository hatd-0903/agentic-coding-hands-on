import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LoginAction } from "./login-action";
import { LoginWithGoogleButton } from "./login-with-google-button";

// NOTE (design deviation): the only art asset provided for this screen is
// `hero-visual.png`, which turned out — on inspection — to be the "ROOT
// FURTHER" logotype itself (with its signature overlapping O/O), not the
// colorful wave background behind it. No wave-art asset was supplied, so
// the diagonal multi-color wave is approximated below with layered blurred
// gradients + a repeating diagonal line texture, sampling the palette
// (amber/orange/green/indigo) visible in `login-design.png`. Swap this for
// the real asset if/when one is exported from Figma.
const WAVE_BLOBS = [
  "absolute -top-16 right-[-8%] h-[440px] w-[620px] rotate-[16deg] rounded-[50%] bg-[#caa156] blur-3xl opacity-80",
  "absolute top-[6%] right-[2%] h-[380px] w-[540px] rotate-[8deg] rounded-[50%] bg-[#d9823f] blur-3xl opacity-70",
  "absolute top-[38%] right-[14%] h-[300px] w-[460px] rotate-[-6deg] rounded-[50%] bg-[#2f8a63] blur-3xl opacity-60",
  "absolute bottom-[-12%] right-[-4%] h-[380px] w-[440px] rotate-[10deg] rounded-[50%] bg-[#33397a] blur-3xl opacity-70",
];

/**
 * Full-bleed hero section: decorative wave visual on the right, left-aligned
 * intro block (title logotype, subtitle, tagline, Google login button) on
 * top. Server component — only the button leaf is interactive.
 */
export async function LoginHero() {
  const t = await getTranslations("login");

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#050a16] via-[#0b1626] to-[#0f2036] pt-16 pb-11">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[28%] right-0 overflow-hidden"
      >
        {WAVE_BLOBS.map((className) => (
          <div key={className} className={className} />
        ))}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(6,10,18,0.35)_0px,rgba(6,10,18,0.35)_2px,transparent_2px,transparent_14px)] mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-start gap-6 px-6 sm:px-12 lg:px-20">
        <h1>
          <Image
            src="/assets/login/hero-visual.png"
            alt="ROOT FURTHER"
            width={451}
            height={200}
            priority
            className="h-auto w-[260px] sm:w-[340px] lg:w-[400px]"
          />
        </h1>

        <div className="flex flex-col gap-2 text-lg font-semibold text-white sm:text-xl">
          <p>{t("subtitle")}</p>
          <p>{t("tagline")}</p>
        </div>

        <Suspense fallback={<LoginWithGoogleButton label={t("loginButton")} />}>
          <LoginAction />
        </Suspense>
      </div>
    </section>
  );
}
