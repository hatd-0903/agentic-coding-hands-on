"use client";

/**
 * Awards system section (MoMorph "Hệ thống giải thưởng", node 2167:9068):
 * caption + title + subtitle header, then a 6-card grid — 3 columns desktop,
 * 2 columns tablet/mobile per test cases ID-15/16.
 *
 * Card copy (titles + descriptions) is taken verbatim from the design. Note:
 * the source design itself repeats the same description text for Best
 * Manager / Signature 2025 - Creator / MVP (nodes I2167:9079/9080/9081) —
 * that repetition is preserved here rather than inventing distinct copy, per
 * the "no invented data" mock-data rule in clarifications.md.
 */
import { useTranslations } from "next-intl";

import { AwardCard, type AwardCardData } from "./award-card";

const AWARDS: AwardCardData[] = [
  {
    nameImgSrc: "/assets/home/award-name-top-talent.png",
    nameImgAlt: "Top Talent",
    nameImgWidth: 221,
    nameImgHeight: 35,
    title: "Top Talent",
    description: "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
    href: "/awards#top-talent",
  },
  {
    nameImgSrc: "/assets/home/award-name-top-project.png",
    nameImgAlt: "Top Project",
    nameImgWidth: 232,
    nameImgHeight: 35,
    title: "Top Project",
    description: "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
    href: "/awards#top-project",
  },
  {
    nameImgSrc: "/assets/home/award-name-top-project-leader.png",
    nameImgAlt: "Top Project Leader",
    nameImgWidth: 232,
    nameImgHeight: 64,
    title: "Top Project Leader",
    description: "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá,",
    href: "/awards#top-project-leader",
  },
  {
    nameImgSrc: "/assets/home/award-name-best-manager.png",
    nameImgAlt: "Best Manager",
    nameImgWidth: 232,
    nameImgHeight: 30,
    title: "Best Manager",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    href: "/awards#best-manager",
  },
  {
    nameImgSrc: "/assets/home/award-name-signature-creator.png",
    nameImgAlt: "Signature 2025 - Creator",
    nameImgWidth: 232,
    nameImgHeight: 54,
    title: "Signature 2025 - Creator",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    href: "/awards#signature-creator",
  },
  {
    nameImgSrc: "/assets/home/award-name-mvp.png",
    nameImgAlt: "MVP",
    nameImgWidth: 116,
    nameImgHeight: 52,
    title: "MVP (Most Valuable Person)",
    description: "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
    href: "/awards#mvp",
  },
];

export function AwardsSection() {
  const t = useTranslations("home");

  return (
    <section className="flex w-full flex-col gap-16 bg-[#00101A] px-6 py-20 sm:px-12 lg:px-36">
      <div className="flex flex-col gap-4">
        <p className="text-base font-bold text-white">{t("awards.caption")}</p>
        <div className="h-px w-full bg-[#2E3940]" />
        <h2 className="text-4xl font-bold text-[#FFEA9E] sm:text-5xl lg:text-[57px]">{t("awards.title")}</h2>
        <p className="max-w-2xl text-sm text-white/80 sm:text-base">{t("awards.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-3 lg:gap-x-20">
        {AWARDS.map((award) => (
          <AwardCard key={award.title} {...award} />
        ))}
      </div>
    </section>
  );
}
