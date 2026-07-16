import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LoginAction } from "./login-action";
import { LoginWithGoogleButton } from "./login-with-google-button";

/**
 * Full-bleed hero section: left-aligned intro block (title logotype, subtitle,
 * tagline, Google login button) over the global root-art background (see
 * app/layout.tsx). Server component — only the button leaf is interactive.
 */
export async function LoginHero() {
  const t = await getTranslations("login");

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden pt-16 pb-11">
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
