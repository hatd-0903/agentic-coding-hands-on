"use client";

/**
 * One award category card (MoMorph mms_C2.1..C2.6, e.g. node 2167:9075): a
 * glowing square "Picture-Award" thumbnail (shared `award-bg.png` ring
 * graphic + a per-award stylized name image), a title, a short VN
 * description, and a "Chi tiết" text link (FR-H5 stub href).
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { ArrowUpIcon } from "./home-icons";

export interface AwardCardData {
  nameImgSrc: string;
  nameImgAlt: string;
  nameImgWidth: number;
  nameImgHeight: number;
  title: string;
  description: string;
  href: string;
}

export function AwardCard({ nameImgSrc, nameImgAlt, nameImgWidth, nameImgHeight, title, description, href }: AwardCardData) {
  const t = useTranslations("home");

  return (
    <div className="flex w-full max-w-[336px] flex-col items-start gap-6">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-[#FFEA9E]/70 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]">
        <Image src="/assets/home/award-bg.png" alt="" fill className="object-cover" />
        <Image
          src={nameImgSrc}
          alt={nameImgAlt}
          width={nameImgWidth}
          height={nameImgHeight}
          className="relative z-10 h-auto w-[62%]"
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        <h3 className="text-xl font-normal text-[#FFEA9E] sm:text-2xl">{title}</h3>
        <p className="text-sm text-white sm:text-base">{description}</p>
        <a href={href} className="mt-2 inline-flex items-center gap-1 text-white transition-colors hover:text-[#FFEA9E]">
          <span className="text-sm font-bold sm:text-base">{t("awards.detail")}</span>
          <ArrowUpIcon className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
