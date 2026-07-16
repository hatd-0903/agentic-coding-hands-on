"use client";

/**
 * Awards Information page ("Hệ thống giải thưởng SAA 2025", MoMorph
 * zFYDgyj_pD) — protected the same way as `app/homepage/page.tsx`
 * (`useRequireAuth`): no session redirects to `/login`, with a loading
 * placeholder shown while the check is in flight (avoids a flash of gated
 * content).
 *
 * Section order matches the design top -> bottom: header -> hero -> two-col
 * body (sticky category nav + the 6 award detail cards, alternating image
 * side per the design) -> Sun* Kudos -> footer. Deep-links from the
 * homepage's award cards (`/awards#<slug>`, see
 * `components/home/awards-section.tsx`) land here — on mount, a matching
 * `#hash` is scrolled into view; an unknown/absent hash is a no-op, no crash
 * (FR-A3, test ID-13).
 */
import { useEffect } from "react";

import { useRequireAuth } from "@/lib/auth/use-auth-guard";
import { AWARDS_CATALOG } from "@/lib/awards/awards-catalog";
import { AwardCategoryNav } from "@/components/awards/award-category-nav";
import { AwardDetailCard } from "@/components/awards/award-detail-card";
import { AwardHeroBanner } from "@/components/awards/award-hero-banner";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { KudosSection } from "@/components/home/kudos-section";

const KNOWN_SLUGS = new Set(AWARDS_CATALOG.map((award) => award.slug));

export default function AwardsPage() {
  const { checking } = useRequireAuth();

  useEffect(() => {
    if (checking) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash || !KNOWN_SLUGS.has(hash)) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [checking]);

  if (checking) {
    return <div className="min-h-screen bg-[#00101A]" aria-hidden="true" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#00101A]">
      <HomeHeader activeKey="awards" />
      <main className="flex flex-1 flex-col">
        <AwardHeroBanner />

        <section className="w-full px-6 py-16 sm:px-12 lg:px-36">
          <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-16 lg:flex-row">
            <AwardCategoryNav />

            <div className="flex flex-1 flex-col gap-16">
              {AWARDS_CATALOG.map((award, index) => (
                <AwardDetailCard key={award.slug} award={award} imageSide={index % 2 === 0 ? "left" : "right"} />
              ))}
            </div>
          </div>
        </section>

        <KudosSection />
      </main>
      <HomeFooter />
    </div>
  );
}
