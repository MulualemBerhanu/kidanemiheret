"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/data/gallery";
import { cn } from "@/lib/utils";

interface GalleryPreviewShowcaseProps {
  images: GalleryImage[];
}

export function GalleryPreviewShowcase({ images }: GalleryPreviewShowcaseProps) {
  const t = useTranslations("gallery");
  const reduced = useReducedMotion();
  const track = [...images, ...images];

  return (
    <div className="relative -mx-5 md:-mx-8">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-charcoal to-transparent md:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-charcoal to-transparent md:w-24"
        aria-hidden
      />

      <div className="overflow-hidden py-2">
        <div
          className={cn(
            "flex w-max gap-4 px-5 md:gap-5 md:px-8",
            !reduced && "animate-gallery-marquee hover:[animation-play-state:paused]"
          )}
        >
          {track.map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="relative w-[200px] shrink-0 sm:w-[220px] md:w-[240px]"
            >
              <div className="rounded-[3px] bg-gradient-to-br from-[#f0e8d8] via-ivory to-[#ebe3d4] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)] ring-1 ring-gold/20 md:p-2.5">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={t(`alts.${img.altKey}`)}
                    fill
                    className="object-cover"
                    sizes="240px"
                    priority={i < 4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
