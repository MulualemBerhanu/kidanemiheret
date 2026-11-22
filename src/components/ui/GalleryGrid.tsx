"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/data/gallery";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: GalleryImage[];
  limit?: number;
  theme?: "dark" | "light";
  showFilters?: boolean;
  /** Open lightbox at this index (0-based, full image list) */
  initialIndex?: number | null;
  onInitialIndexConsumed?: () => void;
}

function categoryLabel(
  t: ReturnType<typeof useTranslations<"gallery">>,
  category?: string
) {
  if (!category) return null;
  const key = `categories.${category}` as const;
  return t.has(key) ? t(key) : category;
}

function GalleryFrame({
  img,
  index,
  theme,
  onOpen,
}: {
  img: GalleryImage;
  index: number;
  theme: "dark" | "light";
  onOpen: () => void;
}) {
  const t = useTranslations("gallery");
  const reduced = useReducedMotion();
  const isLight = theme === "light";

  return (
    <motion.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          isLight ? "focus-visible:ring-offset-ivory" : "focus-visible:ring-offset-charcoal"
        )}
      >
        <div className="rounded-[3px] bg-gradient-to-br from-[#f0e8d8] via-ivory to-[#ebe3d4] p-2 shadow-[0_8px_28px_rgba(0,0,0,0.28)] ring-1 ring-gold/25 transition-all duration-400 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(212,175,55,0.18)] group-hover:ring-gold/45 md:p-2.5">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5">
            <Image
              src={img.src}
              alt={t(`alts.${img.altKey}`)}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/15" />
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2 px-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {img.categoryKey ? (
            <span className="text-[9px] uppercase tracking-[0.2em] text-bronze/80">
              {categoryLabel(t, img.categoryKey)}
            </span>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "text-[9px] tracking-[0.15em]",
              isLight ? "text-charcoal/35" : "text-ivory/35"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </button>
    </motion.li>
  );
}

export function GalleryGrid({
  images,
  limit,
  theme = "dark",
  showFilters = true,
  initialIndex = null,
  onInitialIndexConsumed,
}: GalleryGridProps) {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const reduced = useReducedMotion();
  const filmstripRef = useRef<HTMLDivElement>(null);

  const pool = limit ? images.slice(0, limit) : images;
  const categories = useMemo(
    () => [...new Set(pool.map((img) => img.categoryKey).filter(Boolean))] as string[],
    [pool]
  );

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeCategory ? pool.filter((img) => img.categoryKey === activeCategory) : pool),
    [pool, activeCategory]
  );

  const active = activeIndex !== null ? filtered[activeIndex] : null;
  const isLight = theme === "light";

  const openAt = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    setActiveIndex(null);
  }, [activeCategory]);

  useEffect(() => {
    if (initialIndex === null || initialIndex === undefined) return;
    const img = pool[initialIndex];
    if (!img) return;
    const filteredIndex = filtered.findIndex((item) => item.id === img.id);
    if (filteredIndex >= 0) setActiveIndex(filteredIndex);
    onInitialIndexConsumed?.();
  }, [initialIndex, pool, filtered, onInitialIndexConsumed]);

  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null || !filmstripRef.current) return;
    const thumb = filmstripRef.current.children[activeIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  return (
    <>
      {showFilters && categories.length > 1 && (
        <div className="mb-10 flex flex-col items-center gap-6">
          <p
            className={cn(
              "text-[10px] uppercase tracking-[0.28em]",
              isLight ? "text-bronze/60" : "text-ivory/40"
            )}
          >
            {t("photoCount", { count: filtered.length })}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <FilterChip
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
              label={tCommon("all")}
              isLight={isLight}
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                label={categoryLabel(t, cat) ?? cat}
                isLight={isLight}
              />
            ))}
          </div>
        </div>
      )}

      <motion.ul
        layout={!reduced}
        className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => (
            <GalleryFrame key={`${activeCategory ?? "all"}-${img.id}`} img={img} index={i} theme={theme} onOpen={() => openAt(i)} />
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal
            aria-label={t(`alts.${active.altKey}`)}
          >
            <div className="absolute inset-0 overflow-hidden bg-charcoal">
              <Image
                src={active.src}
                alt=""
                fill
                className="scale-110 object-cover opacity-25 blur-3xl"
                aria-hidden
                priority
              />
              <div className="absolute inset-0 bg-charcoal/88 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-gold/10 px-5 py-4 md:px-8">
              <div className="min-w-0">
                {active.categoryKey && (
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
                    {categoryLabel(t, active.categoryKey)}
                  </p>
                )}
                <p className="mt-1 truncate font-display text-lg text-ivory md:text-xl">{t(`alts.${active.altKey}`)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden font-display text-sm text-ivory/40 sm:inline">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-gold/40">·</span>
                  {String(filtered.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("close")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-xl text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 md:px-12">
              <button
                type="button"
                onClick={prev}
                aria-label={t("previous")}
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-charcoal/60 text-xl text-ivory/80 backdrop-blur-sm transition hover:border-gold hover:text-gold md:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("next")}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-charcoal/60 text-xl text-ivory/80 backdrop-blur-sm transition hover:border-gold hover:text-gold md:right-6"
              >
                ›
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex max-h-[62vh] max-w-5xl items-center justify-center"
                >
                  <Image
                    src={active.src}
                    alt={t(`alts.${active.altKey}`)}
                    width={active.width}
                    height={active.height}
                    className="max-h-[62vh] w-auto max-w-full rounded-[2px] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-gold/20"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 border-t border-gold/10 bg-charcoal/70 px-4 py-4 backdrop-blur-sm md:px-8">
              <div
                ref={filmstripRef}
                className="flex justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filtered.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={t(`alts.${img.altKey}`)}
                    className={cn(
                      "relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px] border transition-all duration-300 md:h-14 md:w-14",
                      i === activeIndex
                        ? "border-gold ring-1 ring-gold/40"
                        : "border-gold/15 opacity-40 hover:opacity-90 hover:border-gold/35"
                    )}
                  >
                    <Image src={img.src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  isLight,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  isLight: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-300",
        active
          ? "border-gold bg-gold/15 text-gold"
          : isLight
            ? "border-gold/15 text-charcoal/50 hover:border-gold/30 hover:text-bronze"
            : "border-gold/15 text-ivory/45 hover:border-gold/30 hover:text-gold/80"
      )}
    >
      {label}
    </button>
  );
}
