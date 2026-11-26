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
    <section className="relative overflow-hidden bg-[#f7f3ea]">
      <Navbar transparent />

      <div
        className="w-full shrink-0 bg-[#f7f3ea]"
        style={{ height: "var(--site-nav-clearance, 5.5rem)" }}
        aria-hidden
      />

      <div
        className="relative flex w-full aspect-[4/5] items-end overflow-hidden sm:aspect-[5/4] md:aspect-[3/2] lg:aspect-[2/1]"
        style={{ backgroundColor: "var(--hero-frame, #4a3420)" }}
      >
        <HeroMedia
          src={editorialImages.hero}
          alt={tHero("imageAlt")}
          priority
          quality={92}
          fit="cover"
          position="top"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent md:from-black/28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#100d0b]/70 via-[#100d0b]/25 to-transparent sm:h-44 lg:h-40"
          aria-hidden
        />

        {/* Mobile/tablet: title only on the image (same as About/Ministries) */}
        <div className="absolute inset-0 z-10 flex items-end lg:hidden">
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 sm:px-6 sm:pb-10">
            <motion.div
              className="relative max-w-xl"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.95)_0%,rgba(247,243,234,0.8)_45%,transparent_78%)]"
                aria-hidden
              />
              <SacredEyebrow tone="dark" className="mb-3">
                {t("denomination")}
              </SacredEyebrow>
              <h1 className="font-display text-[clamp(1.85rem,7vw,2.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
                {t("tagline")}
              </h1>
              <p className="mt-3 max-w-md text-[14px] font-light leading-relaxed text-[#2a241c]/90">
                {t("subtitle")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Desktop: full copy + CTAs + upcoming on the image */}
        <div className="absolute inset-0 z-10 hidden items-end lg:flex">
          <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-8 pb-12">
            <motion.div
              className="relative max-w-[34rem]"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="pointer-events-none absolute -inset-x-12 -inset-y-14 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.95)_0%,rgba(247,243,234,0.82)_42%,transparent_78%)]"
                aria-hidden
              />

              <div className="mb-5 flex items-center gap-4">
                <MeskelCross size={44} priority className="shrink-0 opacity-95" />
                <SacredEyebrow tone="dark">{t("denomination")}</SacredEyebrow>
              </div>

              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
                {t("tagline")}
              </h1>

              <div className="mt-5 flex items-center gap-3" aria-hidden>
                <span className="h-px w-14 bg-gradient-to-r from-[#b68a3e] to-transparent" />
                <span className="h-1 w-1 rotate-45 bg-[#b68a3e]" />
              </div>

              <p className="mt-4 max-w-md text-base font-light leading-[1.7] text-[#2a241c]/90">
                {t("subtitle")}
              </p>

              <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
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

            {upcomingEvent && (
              <motion.aside
                className="pointer-events-auto w-72 shrink-0 xl:w-80"
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
          </div>
        </div>
      </div>

      {/* Mobile/tablet actions — tight band under the image, same hero unit */}
      <div className="border-t border-[#b68a3e]/15 bg-[#f7f3ea] px-5 py-5 sm:px-6 sm:py-6 lg:hidden">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          <div className="flex gap-2.5">
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center bg-gradient-to-r from-[#8a6a2e] via-[#b68a3e] to-[#c9a227] px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7f3ea] shadow-[0_8px_24px_rgba(138,106,46,0.24)]"
            >
              {tButtons("visitUs")}
            </Link>
            <Link
              href="/contact?subject=prayer"
              className="inline-flex flex-1 items-center justify-center border border-[#1a1510]/20 bg-white/60 px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1a1510]"
            >
              {tButtons("prayerRequest")}
            </Link>
          </div>

          {upcomingEvent && (
            <Link
              href="/events"
              className="flex items-center justify-between gap-3 border border-[#b68a3e]/20 bg-white/70 px-3.5 py-3"
              aria-label={tHero("upcomingAria")}
            >
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#5c4524]">
                  {tCommon("upcoming")}
                </p>
                <p className="mt-0.5 truncate font-display text-[1.05rem] font-light text-[#1a1510]">
                  {upcomingEvent.title}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#2a241c]/75">
                  {upcomingEvent.startTime}
                  {upcomingEvent.endTime ? ` – ${upcomingEvent.endTime}` : ""}
                  {" · "}
                  {upcomingEvent.location}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.24em] text-[#8a6a2e]">
                {tCommon("details")}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
