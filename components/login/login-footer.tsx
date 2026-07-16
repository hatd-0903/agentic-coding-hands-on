import { getTranslations } from "next-intl/server";

/**
 * Fixed-bottom footer for the login screen: centered copyright line on a
 * dark bar. Static, presentational — copy localized via next-intl (server).
 */
export async function LoginFooter() {
  const t = await getTranslations("login");

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex h-11 items-center justify-center bg-[#04060d] px-4">
      <p className="text-xs font-medium text-white/80 sm:text-sm">{t("footer")}</p>
    </footer>
  );
}
