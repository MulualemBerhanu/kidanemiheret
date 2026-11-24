"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HeroMedia } from "@/components/layout/HeroMedia";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SacredEyebrow } from "@/components/ui/SacredEyebrow";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { GalleryImage } from "@/data/gallery";

interface GalleryPageHeroProps {
  images: GalleryImage[];
  title: string;
  subtitle: string;
  eyebrow: string;
  /** Preferred cover image for the hero (shown first) */
  coverSrc?: string;
  count?: number;
}

export function GalleryPageHero({
  images,
  title,
  subtitle,
  eyebrow,
  coverSrc,
  count = 6,
}: GalleryPageHeroProps) {
  const t = useTranslations("gallery");
  const reduced = usePrefersReducedMotion();
  const featured: GalleryImage[] = [
    ...(coverSrc
      ? [
          {
            id: "cover",
            src: coverSrc,
            altKey: "cover",
            width: 1600,
            height: 900,
            categoryKey: "Worship",
          },
        ]
      : []),
    ...images.slice(0, count),
  ];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = featured[index];

  const go = useCallback(
    (next: number) => setIndex((next + featured.length) % featured.length),
    [featured.length]
  );

  useEffect(() => {
    if (reduced || paused || featured.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % featured.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [reduced, paused, featured.length]);

  if (!active) return null;

  return (
    <section
      className="relative flex min-h-[48svh] items-end overflow-hidden bg-[#1a1510] pt-28 pb-12 sm:min-h-[55svh] sm:pt-32 sm:pb-16 md:min-h-[62vh] md:pb-20 lg:min-h-[68vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0" aria-hidden>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <HeroMedia src={active.src} priority={index === 0} quality={90} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent xl:top-[var(--site-nav-h)] md:from-black/35 md:via-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#100d0b] via-[#100d0b]/50 to-transparent sm:h-44"
        aria-hidden
      />

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={t("previous")}
        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-[#f7f3ea]/80 text-lg text-[#1a1510] backdrop-blur-sm transition-all hover:bg-[#f7f3ea] sm:left-5 sm:h-10 sm:w-10 md:left-8"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={t("next")}
        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/30 bg-[#f7f3ea]/80 text-lg text-[#1a1510] backdrop-blur-sm transition-all hover:bg-[#f7f3ea] sm:right-5 sm:h-10 sm:w-10 md:right-8"
      >
        ›
      </button>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-8">
        <SectionReveal>
          <div className="relative max-w-2xl">
            <div
              className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.94)_0%,rgba(247,243,234,0.78)_45%,transparent_78%)] sm:-inset-x-8 sm:-inset-y-8"
              aria-hidden
            />
            <SacredEyebrow tone="dark" className="mb-3 sm:mb-4">
              {eyebrow}
            </SacredEyebrow>
            <h1 className="font-display text-[clamp(2rem,6.5vw,3.6rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-xl text-[14px] font-light leading-relaxed text-[#2a241c]/85 sm:mt-5 sm:text-base md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
