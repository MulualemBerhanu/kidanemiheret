"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navRoutes } from "@/data/nav";
import { cn } from "@/lib/utils";
import { MeskelCross } from "@/components/effects/MeskelCross";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const sync = () => setCompactNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        setProgress(Math.min(1, y / max));
        setScrolled(y > 28);

        /* Hide on scroll-down, reveal on scroll-up — mobile/tablet only */
        if (compactNav && !open) {
          const delta = y - lastY.current;
          if (y < 48) setHidden(false);
          else if (delta > 8) setHidden(true);
          else if (delta < -8) setHidden(false);
        } else {
          setHidden(false);
        }
        lastY.current = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, compactNav]);

  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  const solid = scrolled || !transparent;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      data-navbar
      initial={false}
      animate={
        reduced
          ? undefined
          : {
              y: compactNav && hidden ? -120 : 0,
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed z-50 transition-[background,border-color,box-shadow,top] duration-300",
        /* Mobile / tablet — floating frosted glass */
        "left-3 right-3 rounded-2xl border xl:left-0 xl:right-0 xl:rounded-none xl:border-x-0 xl:border-t-0 xl:shadow-none",
        compactNav
          ? scrolled
            ? "top-2 border-[#b68a3e]/35 bg-white/72 shadow-[0_16px_48px_rgba(16,13,11,0.18),inset_0_1px_0_rgba(255,255,255,0.85)]"
            : "top-3 border-white/55 bg-white/40 shadow-[0_12px_40px_rgba(16,13,11,0.14),inset_0_1px_0_rgba(255,255,255,0.7)]"
          : "top-0",
        "backdrop-blur-2xl backdrop-saturate-150",
        solid
          ? "xl:border-b xl:border-[#b68a3e]/20 xl:bg-[#f7f3ea]/96 xl:shadow-[0_8px_32px_rgba(16,13,11,0.08)]"
          : "xl:border-b xl:border-white/30 xl:bg-[#f7f3ea]/88"
      )}
    >
      {/* Gold sheen — intensifies when scrolled */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 xl:hidden",
          scrolled
            ? "bg-gradient-to-br from-[#e9d5a7]/40 via-transparent to-[#b68a3e]/10 opacity-100"
            : "bg-gradient-to-br from-[#e9d5a7]/25 via-transparent to-transparent opacity-80"
        )}
        aria-hidden
      />

      {/* Scroll progress — thin gold line under glass (mobile) */}
      <div
        className="pointer-events-none absolute inset-x-4 bottom-0 h-px overflow-hidden rounded-full xl:hidden"
        aria-hidden
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-[#b68a3e] via-[#e9d5a7] to-[#b68a3e] transition-[transform] duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav
        className={cn(
          "relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 transition-[padding] duration-300 sm:gap-3 md:gap-4 md:px-8 xl:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1.1fr)]",
          scrolled && compactNav
            ? "px-3 py-2 sm:px-3.5 sm:py-2 md:py-3"
            : "px-3.5 py-2.5 sm:px-4 sm:py-3 md:py-3.5"
        )}
        aria-label={t("mainAria")}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 sm:gap-2.5 xl:max-w-[280px] 2xl:max-w-[320px]"
        >
          <span
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md transition-all duration-300 xl:h-auto xl:w-auto xl:border-0 xl:bg-transparent xl:shadow-none",
              scrolled && compactNav ? "h-8 w-8 border-[#b68a3e]/30 bg-[#e9d5a7]/25" : "h-9 w-9"
            )}
          >
            <MeskelCross
              size={scrolled && compactNav ? 24 : 28}
              priority
              className="opacity-95 xl:hidden"
            />
            <MeskelCross
              size={40}
              priority
              className="hidden opacity-90 transition-opacity group-hover:opacity-100 xl:inline-flex"
            />
          </span>
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "font-display block font-medium leading-[1.15] tracking-[0.01em] text-[#1a1510] transition-all duration-300 group-hover:text-[#8a6a3a] xl:truncate xl:text-[1.08rem]",
                scrolled && compactNav
                  ? "text-[0.78rem] sm:text-[0.9rem] md:text-[1rem]"
                  : "text-[0.82rem] sm:text-[0.95rem] md:text-[1.05rem]"
              )}
            >
              {tSite("shortName")}
            </span>
            <span className="mt-0.5 hidden text-[8px] font-semibold uppercase tracking-[0.22em] text-[#5c4524] lg:block xl:truncate">
              {tSite("denomination")}
            </span>
          </div>
        </Link>

        <ul className="hidden items-center justify-center gap-4 xl:flex 2xl:gap-6">
          {navRoutes.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={cn(
                  "group relative inline-block whitespace-nowrap py-1 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 2xl:tracking-[0.22em]",
                  isActive(item.href)
                    ? "text-[#1a1510]"
                    : "text-[#1a1510]/65 hover:text-[#1a1510]"
                )}
              >
                {t(item.key)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#b68a3e] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden xl:flex xl:items-center xl:gap-5">
            <LanguageSwitcher className="[&_button]:text-[11px] [&_button]:tracking-[0.08em] [&_button]:text-[#2a241c]/55 [&_button[aria-current=true]]:text-[#8a6a2e] [&_button:hover]:text-[#1a1510]" />
            <Link
              href="/give"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#b68a3e] to-[#c9a227] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#1a1510] transition-all duration-300 hover:brightness-110 hover:shadow-[0_6px_20px_rgba(182,138,62,0.28)]"
            >
              {tCommon("give")}
            </Link>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <div
              className={cn(
                "flex items-center rounded-full border px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md transition-all duration-300",
                scrolled
                  ? "border-[#b68a3e]/30 bg-white/70"
                  : "border-white/60 bg-white/45"
              )}
            >
              <LanguageSwitcher className="[&_button]:text-[10px] [&_button]:text-[#2a241c]/65 [&_button[aria-current=true]]:text-[#8a6a2e] sm:[&_button]:text-[11px]" />
            </div>
            <Link
              href="/give"
              className="hidden items-center justify-center rounded-full bg-gradient-to-r from-[#b68a3e] to-[#c9a227] px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1a1510] shadow-[0_4px_14px_rgba(182,138,62,0.3)] sm:inline-flex"
            >
              {tCommon("give")}
            </Link>
            <button
              type="button"
              className={cn(
                "flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_16px_rgba(16,13,11,0.08)] backdrop-blur-md transition-all duration-300",
                open
                  ? "border-[#b68a3e]/45 bg-[#e9d5a7]/40"
                  : scrolled
                    ? "border-[#b68a3e]/30 bg-white/70"
                    : "border-white/70 bg-white/50"
              )}
              aria-expanded={open}
              aria-label={t("toggleMenu")}
              onClick={() => setOpen(!open)}
            >
              <span
                className={cn(
                  "block h-px w-4 bg-[#1a1510] transition-transform",
                  open && "translate-y-[5px] rotate-45"
                )}
              />
              <span className={cn("block h-px w-3 bg-[#1a1510] transition-opacity", open && "opacity-0")} />
              <span
                className={cn(
                  "block h-px w-4 bg-[#1a1510] transition-transform",
                  open && "-translate-y-[5px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/40 xl:hidden"
          >
            <div className="bg-white/40 px-2 pb-3 pt-1 backdrop-blur-xl">
              <ul className="flex flex-col overflow-hidden rounded-xl border border-white/50 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                {navRoutes.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block border-b border-[#1a1510]/06 px-4 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors last:border-0",
                        isActive(item.href)
                          ? "bg-[#e9d5a7]/25 text-[#8a6a2e]"
                          : "text-[#2a241c]/85 active:bg-white/60"
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
                <li className="p-3 sm:hidden">
                  <Link
                    href="/give"
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#b68a3e] to-[#c9a227] py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[#1a1510] shadow-[0_6px_20px_rgba(182,138,62,0.28)]"
                  >
                    {tCommon("give")}
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
