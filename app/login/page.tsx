import { LoginFooter } from "@/components/login/login-footer";
import { LoginGuard } from "@/components/login/login-guard";
import { LoginHeader } from "@/components/login/login-header";
import { LoginHero } from "@/components/login/login-hero";

/**
 * SAA 2025 Login screen. Server shell composing the fixed header, full-bleed
 * hero, and fixed footer, wrapped in the client auth guard (an authenticated
 * visitor is redirected to /todo). i18n copy comes from next-intl; the login
 * button and language selector are wired to Supabase OAuth / locale cookie via
 * their client containers.
 */
export default function LoginPage() {
  return (
    <LoginGuard>
      <main className="relative min-h-screen">
        <LoginHeader />
        <LoginHero />
        <LoginFooter />
      </main>
    </LoginGuard>
  );
}
