"use client";

/**
 * Homepage SAA ("ROOT FURTHER") — post-login landing page (MoMorph i87tDx10uM).
 * Protected client-side by `useRequireAuth` (FR-H1), same pattern as
 * `app/todo/page.tsx`: no session → redirect to `/login`; a loading
 * placeholder is shown while the check is in flight to avoid a flash of
 * gated content.
 *
 * Section order matches the design top→bottom (test case ID-7): header →
 * hero (logotype, countdown, event info, CTAs) → Root Further marketing copy
 * → awards grid → Sun* Kudos → footer, with the quick-action widget fixed on
 * top of everything.
 */
import { useRequireAuth } from "@/lib/auth/use-auth-guard";
import { AwardsSection } from "@/components/home/awards-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { HomeHero } from "@/components/home/home-hero";
import { KudosSection } from "@/components/home/kudos-section";
import { RootFurtherContent } from "@/components/home/root-further-content";
import { WidgetButton } from "@/components/home/widget-button";

export default function HomePage() {
  const { checking } = useRequireAuth();

  if (checking) {
    return <div className="min-h-screen bg-[#00101A]" aria-hidden="true" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#00101A]">
      <HomeHeader />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <RootFurtherContent />
        <AwardsSection />
        <KudosSection />
      </main>
      <HomeFooter />
      <WidgetButton />
    </div>
  );
}
