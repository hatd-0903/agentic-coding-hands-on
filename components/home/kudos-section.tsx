"use client";

/**
 * Sun* Kudos section (MoMorph mms_D1_Sunkudos, node 3390:10349): label +
 * title + VN description + "Chi tiết" CTA on the left, the KUDOS
 * icon/wordmark visual on the right, over the design's kudos background art.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import { PillButton } from "./pill-button";

const DESCRIPTION_HEADING = "ĐIỂM MỚI CỦA SAA 2025";
const DESCRIPTION_BODY =
  "Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.";

export function KudosSection() {
  const t = useTranslations("home");

  return (
    <section className="w-full bg-[#00101A] px-6 py-16 sm:px-12 lg:px-36">
      <div className="relative mx-auto flex w-full max-w-[1224px] flex-col items-start gap-10 overflow-hidden rounded-2xl bg-[#0F0F0F] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
        <Image src="/assets/home/kudos-background.png" alt="" fill className="object-cover opacity-60" />

        <div className="relative z-10 flex max-w-md flex-col items-start gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-bold text-white">{t("kudos.label")}</p>
            <h2 className="text-4xl font-bold text-[#FFEA9E] sm:text-5xl">{t("kudos.title")}</h2>
            <p className="text-sm leading-relaxed text-white sm:text-base">
              <span className="font-bold">{DESCRIPTION_HEADING}</span>
              <br />
              {DESCRIPTION_BODY}
            </p>
          </div>

          <PillButton href="/kudos" variant="filled" size="sm">
            {t("kudos.detail")}
          </PillButton>
        </div>

        <Image
          src="/assets/home/kudos-logo.svg"
          alt="KUDOS"
          width={364}
          height={72}
          className="relative z-10 h-auto w-48 sm:w-64 lg:w-80"
        />
      </div>
    </section>
  );
}
