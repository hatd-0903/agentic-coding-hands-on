"use client";

/**
 * One award detail block (MoMorph mms_D.1..D.6, e.g. node 313:8467): a
 * 336x336 glowing award image beside a title/description/quantity/prize
 * column, separated by dividers exactly as laid out in the design (icon +
 * label rows, with the value/note stacked below for the prize block).
 * Sides alternate per award (image left on odd positions, right on even),
 * controlled by the `imageSide` prop the caller (`app/awards/page.tsx`)
 * derives from the card's index in `AWARDS_CATALOG`.
 */
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { AwardCatalogEntry } from "@/lib/awards/awards-catalog";

/** Small bullet icon before the award title (MM_MEDIA_Target — same icon reused in `award-category-nav.tsx`). */
function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.84 21.79 9.69 21.39 8.61L19.79 10.21C19.93 10.8 20 11.4 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C12.6 4 13.2 4.07 13.79 4.21L15.4 2.6C14.31 2.21 13.16 2 12 2ZM19 2L15 6V7.5L12.45 10.05C12.3 10 12.15 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.85 14 11.7 13.95 11.55L16.5 9H18L22 5H19V2ZM12 6C10.4087 6 8.88258 6.63214 7.75736 7.75736C6.63214 8.88258 6 10.4087 6 12C6 13.5913 6.63214 15.1174 7.75736 16.2426C8.88258 17.3679 10.4087 18 12 18C13.5913 18 15.1174 17.3679 16.2426 16.2426C17.3679 15.1174 18 13.5913 18 12H16C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12C8 10.9391 8.42143 9.92172 9.17157 9.17157C9.92172 8.42143 10.9391 8 12 8V6Z"
        fill="white"
      />
    </svg>
  );
}

/** Icon before the quantity row (MM_MEDIA_Diamond). */
function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 9H19L14 16M10 9H14L12 17M5 9H8L10 16M15 4H17L19 7H16M11 4H13L14 7H10M7 4H9L8 7H5M6 2L2 8L12 22L22 8L18 2H6Z"
        fill="white"
      />
    </svg>
  );
}

/** Icon before each prize row (MM_MEDIA_License). */
function LicenseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M9.00011 10C9.01047 9.20761 9.32986 8.45055 9.89024 7.89017C10.4506 7.32979 11.2077 7.0104 12.0001 7.00004C12.7925 7.0104 13.5496 7.32979 14.11 7.89017C14.6704 8.45055 14.9897 9.20761 15.0001 10C14.9897 10.7925 14.6704 11.5495 14.11 12.1099C13.5496 12.6703 12.7925 12.9897 12.0001 13C11.2077 12.9897 10.4506 12.6703 9.89024 12.1099C9.32986 11.5495 9.01047 10.7925 9.00011 10ZM12.0001 19L16.0001 20V16.92C14.7938 17.6465 13.4081 18.0206 12.0001 18C10.5921 18.0206 9.20643 17.6465 8.00011 16.92V20M12.0001 4.00004C11.2121 3.98566 10.4294 4.1326 9.70027 4.43183C8.97112 4.73106 8.31087 5.17625 7.76011 5.74004C7.19022 6.2914 6.73988 6.95414 6.4371 7.68701C6.13431 8.41988 5.98557 9.20722 6.00011 10C5.98969 10.7878 6.14044 11.5695 6.4431 12.2969C6.74576 13.0243 7.19394 13.6821 7.76011 14.23C8.3083 14.7993 8.9674 15.25 9.69668 15.5544C10.426 15.8589 11.2099 16.0105 12.0001 16C12.7903 16.0105 13.5743 15.8589 14.3035 15.5544C15.0328 15.25 15.6919 14.7993 16.2401 14.23C16.8063 13.6821 17.2545 13.0243 17.5571 12.2969C17.8598 11.5695 18.0105 10.7878 18.0001 10C18.0146 9.20722 17.8659 8.41988 17.5631 7.68701C17.2603 6.95414 16.81 6.2914 16.2401 5.74004C15.6893 5.17625 15.0291 4.73106 14.2999 4.43183C13.5708 4.1326 12.7881 3.98566 12.0001 4.00004ZM20.0001 10C19.9788 10.9599 19.7858 11.9082 19.4301 12.8C19.1097 13.7075 18.6249 14.5481 18.0001 15.28V23L12.0001 21L6.00011 23V15.28C4.7058 13.8265 3.99361 11.9463 4.00011 10C3.98248 8.95062 4.18014 7.90873 4.58089 6.93868C4.98163 5.96864 5.57696 5.09103 6.33011 4.36004C7.06381 3.60013 7.94547 2.99867 8.92067 2.59277C9.89587 2.18686 10.9439 1.98514 12.0001 2.00004C13.0563 1.98514 14.1043 2.18686 15.0795 2.59277C16.0547 2.99867 16.9364 3.60013 17.6701 4.36004C18.4233 5.09103 19.0186 5.96864 19.4193 6.93868C19.8201 7.90873 20.0177 8.95062 20.0001 10Z"
        fill="white"
      />
    </svg>
  );
}

export interface AwardDetailCardProps {
  award: AwardCatalogEntry;
  imageSide?: "left" | "right";
}

export function AwardDetailCard({ award, imageSide = "left" }: AwardDetailCardProps) {
  const t = useTranslations("awardsPage");
  const [quantityNumber, ...quantityUnitParts] = award.quantity.split(" ");
  const quantityUnit = quantityUnitParts.join(" ");

  return (
    <article
      id={award.slug}
      className={`flex w-full scroll-mt-24 flex-col gap-8 border-b border-[#2E3940] pb-16 last:border-b-0 lg:gap-10 ${
        imageSide === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="relative aspect-square w-full max-w-[336px] shrink-0 overflow-hidden rounded-3xl border border-[#FFEA9E]/70 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]">
        <Image src="/assets/home/award-bg.png" alt="" fill className="object-cover" />
        <Image
          src={award.nameImgSrc}
          alt={award.nameImgAlt}
          width={award.nameImgWidth}
          height={award.nameImgHeight}
          className="absolute left-1/2 top-1/2 h-auto w-[62%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-3">
          <TargetIcon className="h-6 w-6 shrink-0" />
          <h3 className="text-xl font-bold text-[#FFEA9E] sm:text-2xl">{award.title}</h3>
        </div>
        <p className="text-justify text-sm leading-relaxed text-white sm:text-base">{award.description}</p>

        <div className="h-px w-full bg-[#2E3940]" />

        <div className="flex flex-wrap items-center gap-3">
          <DiamondIcon className="h-6 w-6 shrink-0" />
          <span className="text-lg font-bold text-[#FFEA9E] sm:text-xl">{t("quantityLabel")}</span>
          <span className="text-2xl font-bold text-white sm:text-3xl">{quantityNumber}</span>
          {quantityUnit && <span className="text-sm font-bold text-white">{quantityUnit}</span>}
        </div>

        <div className="h-px w-full bg-[#2E3940]" />

        <div className="flex flex-col gap-4">
          {award.prizes.map((prize, index) => (
            <div key={`${award.slug}-prize-${index}`} className="flex flex-col gap-2">
              {index > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <span className="text-sm font-bold text-[#2E3940]">Hoặc</span>
                  <div className="h-px flex-1 bg-[#2E3940]" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <LicenseIcon className="h-6 w-6 shrink-0" />
                <span className="text-lg font-bold text-[#FFEA9E] sm:text-xl">{t("prizeLabel")}</span>
              </div>
              <p className="text-2xl font-bold text-white sm:text-3xl">{prize.value}</p>
              {prize.note && <p className="text-sm font-bold text-white">{prize.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
