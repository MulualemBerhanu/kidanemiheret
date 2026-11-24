"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { editorialImages } from "@/data/images";
import type { ChurchEvent } from "@/data/events";
import { HeroMedia } from "@/components/layout/HeroMedia";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "@/i18n/navigation";
import { MeskelCross } from "@/components/effects/MeskelCross";
import { SacredEyebrow } from "@/components/ui/SacredEyebrow";
import { usePrefersReducedMotion } from "@/lib/motion";

interface HeroSectionClientProps {
  upcomingEvent?: ChurchEvent;
}

export function HeroSectionClient({ upcomingEvent }: HeroSectionClientProps) {
  const t = useTranslations("site");
  const tButtons = useTranslations("buttons");
  const tCommon = useTranslations("common");
  const tHero = useTranslations("hero");
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#1a1510]">
      <Navbar transparent />

      <div className="absolute inset-0">
        <HeroMedia
          src={editorialImages.hero}
          alt={tHero("imageAlt")}
          priority
          quality={92}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent md:from-black/35 md:via-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#100d0b] via-[#100d0b]/45 to-transparent sm:h-48"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgba(255,236,180,0.1),transparent_50%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-5 sm:pb-24 sm:pt-32 md:justify-center md:px-8 md:pb-20 md:pt-28">
        <motion.div
          className="relative w-full max-w-xl md:max-w-[34rem]"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute -inset-x-5 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.95)_0%,rgba(247,243,234,0.82)_42%,transparent_78%)] sm:-inset-x-8 sm:-inset-y-10 md:-inset-x-12 md:-inset-y-14"
            aria-hidden
          />

          <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
            <MeskelCross size={44} priority className="shrink-0 opacity-95" />
            <SacredEyebrow tone="dark">{t("denomination")}</SacredEyebrow>
          </div>

          <h1 className="font-display text-[clamp(2rem,7.5vw,3.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
            {t("tagline")}
          </h1>

          <div className="mt-4 flex items-center gap-3 sm:mt-5" aria-hidden>
            <span className="h-px w-12 bg-gradient-to-r from-[#b68a3e] to-transparent sm:w-14" />
            <span className="h-1 w-1 rotate-45 bg-[#b68a3e]" />
          </div>

          <p className="mt-4 max-w-md text-[14px] font-light leading-[1.7] text-[#2a241c]/90 sm:mt-5 sm:text-[15px] md:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#8a6a2e] via-[#b68a3e] to-[#c9a227] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f7f3ea] shadow-[0_8px_28px_rgba(138,106,46,0.28)] transition-all duration-300 hover:brightness-110"
            >
              {tButtons("visitUs")}
            </Link>
            <Link
              href="/contact?subject=prayer"
              className="inline-flex items-center justify-center border border-[#1a1510]/30 bg-[#f7f3ea]/70 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1a1510] backdrop-blur-sm transition-all duration-300 hover:border-[#b68a3e] hover:bg-[#f7f3ea]/95"
            >
              {tButtons("prayerRequest")}
            </Link>
          </div>
        </motion.div>

        {/* Tablet upcoming strip (desktop uses floating card) */}
        {upcomingEvent && (
          <motion.div
            className="mt-8 w-full max-w-xl border border-white/35 bg-[#f7f3ea]/90 p-4 backdrop-blur-md lg:hidden"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#5c4524]">
              {tCommon("upcoming")}
            </p>
            <p className="mt-1.5 font-display text-lg font-light text-[#1a1510]">
              {upcomingEvent.title}
            </p>
            <p className="mt-1 text-sm text-[#2a241c]/75">
              {upcomingEvent.startTime}
              {upcomingEvent.endTime ? ` – ${upcomingEvent.endTime}` : ""}
              {" · "}
              {upcomingEvent.location}
            </p>
          </motion.div>
        )}
      </div>

      {upcomingEvent && (
        <motion.aside
          className="absolute bottom-10 right-6 z-20 hidden w-72 lg:block xl:right-12 xl:w-80"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label={tHero("upcomingAria")}
        >
          <div className="overflow-hidden rounded-[2px] border border-white/40 bg-[#f7f3ea]/92 shadow-[0_24px_60px_rgba(16,13,11,0.2)] backdrop-blur-xl">
            <div className="border-b border-[#b68a3e]/20 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#5c4524]">
                {tCommon("upcoming")}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="font-display text-xl font-light leading-snug text-[#1a1510]">
                {upcomingEvent.title}
              </p>
              <p className="mt-2 text-sm text-[#2a241c]/75">
                {upcomingEvent.startTime}
                {upcomingEvent.endTime ? ` – ${upcomingEvent.endTime}` : ""}
              </p>
              <p className="mt-1 text-sm text-[#5c4524]">{upcomingEvent.location}</p>
              <Link
                href="/events"
                className="mt-4 inline-flex text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a6a2e] transition-colors hover:text-[#1a1510]"
              >
                {tCommon("details")}
              </Link>
            </div>
          </div>
        </motion.aside>
      )}

      <motion.div
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex md:left-10 md:translate-x-0"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-white/80">
          {tCommon("scroll")}
        </span>
        <span className="block h-10 w-px bg-gradient-to-b from-[#e9d5a7] to-transparent" aria-hidden />
      </motion.div>
    </section>
  );
}
