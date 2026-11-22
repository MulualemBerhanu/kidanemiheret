"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  WorshipDisplaySettings,
  WorshipSlide,
  WorshipSource,
} from "@/data/worship-slides";
import {
  deckLabel,
  isDocumentSource,
  isPdfPageSlide,
  isPresentationSource,
  slideSrc,
  slidesForSource,
} from "@/data/worship-slides";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const WorshipPdfViewer = dynamic(
  () =>
    import("@/components/worship/WorshipPdfViewer").then((mod) => mod.WorshipPdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0c0c0c]">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
          Loading PDF viewer…
        </div>
      </div>
    ),
  }
);

interface WorshipScreenClientProps {
  initialSlides: WorshipSlide[];
  settings: WorshipDisplaySettings;
  sources?: WorshipSource[];
  initialDeckId?: string;
  /** TV/projector surface — hides upload/sync chrome */
  mode?: "console" | "present";
  autoPresent?: boolean;
}

function isPresentationFile(name: string) {
  const lower = name.toLowerCase();
  return lower.endsWith(".ppt") || lower.endsWith(".pptx");
}

export function WorshipScreenClient({
  initialSlides,
  settings,
  sources: initialSources = [],
  initialDeckId,
  mode = "console",
  autoPresent = false,
}: WorshipScreenClientProps) {
  const isPresentMode = mode === "present";
  const [allSlides, setAllSlides] = useState(initialSlides);
  const [sources, setSources] = useState(initialSources);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(initialDeckId ?? null);
  const [presentationMode, setPresentationMode] = useState(
    isPresentMode || !!initialDeckId
  );
  const [index, setIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(settings.autoPlay.enabled);
  const [started, setStarted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoPresentStarted = useRef(false);

  const displaySlides = useMemo(() => {
    if (!activeDeckId) return allSlides;
    return slidesForSource(allSlides, sources, activeDeckId);
  }, [activeDeckId, allSlides, sources]);

  const total = displaySlides.length;
  const current = displaySlides[index];

  const activeSource = useMemo(
    () => (activeDeckId ? sources.find((s) => s.id === activeDeckId) : null),
    [activeDeckId, sources]
  );

  const slideSource = useMemo(() => {
    if (!current?.sourceId) return activeSource;
    return sources.find((s) => s.id === current.sourceId) ?? activeSource;
  }, [current, sources, activeSource]);

  const isPdfSlide = current ? isPdfPageSlide(current) : false;
  const isPptPresentation = slideSource ? isPresentationSource(slideSource) : false;
  const isDocumentView = slideSource ? isDocumentSource(slideSource) : isPdfSlide;
  const hideDelay = presentationMode ? 2000 : settings.controlsHideDelayMs;

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), hideDelay);
  }, [hideDelay]);

  const goNext = useCallback(() => {
    if (total <= 0) return;
    setIndex((i) => (i + 1) % total);
    revealControls();
  }, [total, revealControls]);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    setIndex((i) => (i - 1 + total) % total);
    revealControls();
  }, [total, revealControls]);

  const enterFullscreen = useCallback(async () => {
    try {
      const el = containerRef.current ?? document.documentElement;
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      }
      setStarted(true);
      revealControls();
    } catch {
      setStarted(true);
      revealControls();
    }
  }, [revealControls]);

  const startPresentation = useCallback(
    async (
      deckId: string | null,
      {
        fullscreen = true,
        slidesOverride,
        sourcesOverride,
      }: {
        fullscreen?: boolean;
        slidesOverride?: WorshipSlide[];
        sourcesOverride?: WorshipSource[];
      } = {}
    ) => {
      const slideList = slidesOverride ?? allSlides;
      const sourceList = sourcesOverride ?? sources;

      if (deckId) {
        const deck = slidesForSource(slideList, sourceList, deckId);
        if (!deck.length) return;
        setActiveDeckId(deckId);
        setPresentationMode(true);
        setIndex(0);
      } else {
        setActiveDeckId(null);
        setPresentationMode(false);
        setIndex(0);
      }

      setStarted(true);
      setShowControls(false);

      if (fullscreen) {
        await enterFullscreen();
      } else {
        revealControls();
      }
    },
    [allSlides, sources, enterFullscreen, revealControls]
  );

  const worshipAdminHeaders = useCallback(() => {
    const secret =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("worship-admin-secret")
        : null;
    return secret ? { "x-worship-admin-secret": secret } : undefined;
  }, []);

  const ensureWorshipAdminSecret = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("worship-admin-secret")) return;
    const entered = window.prompt(
      "Enter the worship admin password (set WORSHIP_ADMIN_SECRET on the server):"
    );
    if (entered) {
      window.sessionStorage.setItem("worship-admin-secret", entered.trim());
    }
  }, []);

  const syncSlides = useCallback(async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      let res = await fetch("/api/worship/sync", {
        method: "POST",
        headers: worshipAdminHeaders(),
      });
      if (res.status === 401) {
        await ensureWorshipAdminSecret();
        res = await fetch("/api/worship/sync", {
          method: "POST",
          headers: worshipAdminHeaders(),
        });
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Sync failed");

      if (data.slides?.length) setAllSlides(data.slides);
      if (data.sources?.length) setSources(data.sources);

      if (data.converted?.length) {
        setSyncMessage(`Converted: ${data.converted.join(", ")}`);
      } else {
        setSyncMessage("Slides ready");
      }

      return data;
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Could not sync slides");
      return null;
    } finally {
      setSyncing(false);
    }
  }, [ensureWorshipAdminSecret, worshipAdminHeaders]);

  const handleStartFullscreen = useCallback(async () => {
    if (!isPresentMode) {
      await syncSlides();
    }
    await startPresentation(activeDeckId, { fullscreen: true });
  }, [isPresentMode, syncSlides, startPresentation, activeDeckId]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (isPresentMode) return;
      setUploading(true);
      setSyncMessage(null);
      try {
        const formData = new FormData();
        formData.append("file", file);

        let res = await fetch("/api/worship/upload", {
          method: "POST",
          body: formData,
          headers: worshipAdminHeaders(),
        });
        if (res.status === 401) {
          await ensureWorshipAdminSecret();
          res = await fetch("/api/worship/upload", {
            method: "POST",
            body: formData,
            headers: worshipAdminHeaders(),
          });
        }
        const data = await res.json();
        if (!data.ok) throw new Error(data.error ?? "Upload failed");

        if (data.slides?.length) setAllSlides(data.slides);
        if (data.sources?.length) setSources(data.sources);

        const isPpt = isPresentationFile(file.name);
        const isPdf = file.name.toLowerCase().endsWith(".pdf");

        if ((isPpt || isPdf) && data.sourceId) {
          setSyncMessage(`Opening presentation: ${file.name.replace(/\.[^.]+$/, "")}`);
          await startPresentation(data.sourceId, {
            fullscreen: true,
            slidesOverride: data.slides,
            sourcesOverride: data.sources ?? sources,
          });
        } else if (data.sourceId) {
          const deck = slidesForSource(data.slides, data.sources ?? sources, data.sourceId);
          setIndex(Math.max(0, deck.length - (data.slideCount ?? 1)));
          setSyncMessage(`Uploaded: ${data.filename} (${data.slideCount} slides)`);
        } else {
          setSyncMessage(`Uploaded: ${data.filename}`);
        }
      } catch (err) {
        setSyncMessage(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [
      ensureWorshipAdminSecret,
      isPresentMode,
      sources,
      startPresentation,
      worshipAdminHeaders,
    ]
  );

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  const exitPresentation = useCallback(async () => {
    await exitFullscreen();
    if (isPresentMode) {
      setStarted(false);
      setShowControls(false);
      return;
    }
    setPresentationMode(false);
    setActiveDeckId(null);
    setIndex(0);
    setStarted(false);
  }, [exitFullscreen, isPresentMode]);

  useEffect(() => {
    if (!autoPresent || autoPresentStarted.current) return;
    autoPresentStarted.current = true;

    (async () => {
      // Present/TV mode starts from the baked manifest — no admin sync prompt.
      if (isPresentMode) {
        if (initialDeckId) {
          await startPresentation(initialDeckId, {
            fullscreen: true,
            slidesOverride: initialSlides,
            sourcesOverride: initialSources,
          });
        }
        return;
      }

      const data = await syncSlides();
      if (initialDeckId && data?.slides) {
        await startPresentation(initialDeckId, {
          fullscreen: true,
          slidesOverride: data.slides,
          sourcesOverride: data.sources ?? initialSources,
        });
      }
    })();
  }, [
    autoPresent,
    initialDeckId,
    initialSlides,
    initialSources,
    isPresentMode,
    syncSlides,
    startPresentation,
  ]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter" || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        setIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setIndex(Math.max(0, total - 1));
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (document.fullscreenElement) exitFullscreen();
        else enterFullscreen();
      } else if (e.key === "Escape") {
        if (presentationMode && document.fullscreenElement) {
          revealControls();
        } else {
          revealControls();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    started,
    goNext,
    goPrev,
    total,
    enterFullscreen,
    exitFullscreen,
    revealControls,
    presentationMode,
  ]);

  useEffect(() => {
    if (isPresentMode || !autoPlay || total <= 1 || !started) return;
    const ms = settings.autoPlay.intervalSeconds * 1000;
    const id = setInterval(goNext, ms);
    return () => clearInterval(id);
  }, [
    autoPlay,
    goNext,
    isPresentMode,
    settings.autoPlay.intervalSeconds,
    total,
    started,
  ]);

  useEffect(() => {
    if (index >= total && total > 0) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      className="hidden"
      disabled={uploading || syncing}
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) handleUpload(f);
        e.target.value = "";
      }}
    />
  );

  if (!current) {
    return (
      <div className="flex h-[100dvh] w-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white/60">
        <p>No slides found.</p>
        {!isPresentMode && (
          <label className="cursor-pointer rounded-sm border border-gold/40 px-6 py-3 text-sm text-gold hover:bg-gold/10">
            Upload slides
            {fileInput}
          </label>
        )}
      </div>
    );
  }

  const slideFitClass =
    isPptPresentation || isDocumentView || presentationMode
      ? "object-contain object-center"
      : "object-cover object-center";

  const pdfSourceId =
    isPdfSlide && (current.sourceId ?? slideSource?.id) ? (current.sourceId ?? slideSource!.id) : null;

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-screen cursor-none overflow-hidden bg-black select-none"
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      {isPdfSlide && pdfSourceId && current.page ? (
        <div className="absolute inset-0 z-0">
          <WorshipPdfViewer
            sourceId={pdfSourceId}
            pageNumber={current.page}
            presentationMode={presentationMode}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="absolute inset-0 h-[100dvh] w-[100vw]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {current.file ? (
              <Image
                src={slideSrc(current.file)}
                alt={current.titleAm ?? current.title ?? `Slide ${index + 1}`}
                fill
                priority
                className={cn("!h-[100dvh] !w-[100vw]", slideFitClass)}
                sizes="100vw"
                draggable={false}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                Slide unavailable
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <button
        type="button"
        className="absolute inset-y-0 left-0 z-10 w-[38%] cursor-none opacity-0"
        aria-label="Previous slide"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 z-10 w-[62%] cursor-none opacity-0"
        aria-label="Next slide"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
      />

      {!started && isPresentMode && (
        <div className="absolute inset-0 z-30 flex cursor-auto flex-col items-center justify-center bg-black/95 px-6 text-center">
          <p className="font-amharic text-2xl text-gold md:text-3xl">የአምልኮ ማሳያ</p>
          <p className="mt-2 text-sm text-white/50">
            {activeSource ? deckLabel(activeSource) : "Presentation"}
          </p>
          <button
            type="button"
            onClick={() =>
              startPresentation(activeDeckId ?? initialDeckId ?? null, {
                fullscreen: true,
              })
            }
            className="mt-8 rounded-sm bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-charcoal transition hover:brightness-110"
          >
            Resume fullscreen
          </button>
          <a
            href="/admin/worship"
            className="mt-4 rounded-sm border border-white/20 px-8 py-3 text-xs uppercase tracking-widest text-white/70 transition hover:border-gold/50 hover:text-gold"
          >
            Back to Admin
          </a>
          <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/35">
            Press F for fullscreen. Arrow keys or Space advance pages.
          </p>
        </div>
      )}

      {!started && !isPresentMode && (
        <div className="absolute inset-0 z-30 flex cursor-auto flex-col items-center justify-center overflow-y-auto bg-black/95 px-6 py-10 text-center">
          <p className="font-amharic text-2xl text-gold md:text-3xl">የአምልኮ ማሳያ</p>
          <p className="mt-2 text-sm text-white/50">Worship Display — Operator Console</p>

          {sources.length > 0 && (
            <div className="mt-8 w-full max-w-lg">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Presentations
              </p>
              <ul className="space-y-2 text-left">
                {sources.map((source) => {
                  const count = slidesForSource(allSlides, sources, source.id).length;
                  const presentHref = `/worship-screen/present/${encodeURIComponent(source.id)}`;
                  return (
                    <li key={source.id}>
                      <div className="flex items-stretch gap-2">
                        <button
                          type="button"
                          disabled={syncing || uploading}
                          onClick={() => startPresentation(source.id, { fullscreen: true })}
                          className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-gold/40 hover:bg-gold/10 disabled:opacity-50"
                        >
                          <span className="min-w-0 flex-1 truncate text-sm text-white/85">
                            {deckLabel(source)}
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30">
                              {isDocumentSource(source)
                                ? "PDF"
                                : isPresentationSource(source)
                                  ? "PPT"
                                  : "Slides"}
                            </span>
                          </span>
                          <span className="shrink-0 text-[10px] uppercase tracking-widest text-gold">
                            ▶ Present · {count}
                          </span>
                        </button>
                        <a
                          href={presentHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center rounded-sm border border-white/10 px-3 text-[10px] uppercase tracking-widest text-white/40 transition hover:border-gold/40 hover:text-gold"
                          title="Open TV present URL"
                        >
                          TV link
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-left text-[11px] leading-relaxed text-white/30">
                On the hall TV, bookmark a deck&apos;s present URL (TV link) and open it fullscreen.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleStartFullscreen}
            disabled={syncing || uploading}
            className="mt-8 rounded-sm bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-charcoal transition hover:brightness-110 disabled:opacity-60"
          >
            {syncing ? "Preparing slides…" : "Start Fullscreen (All Slides)"}
          </button>

          <label
            className={cn(
              "mt-5 cursor-pointer rounded-sm border border-white/20 px-8 py-3 text-xs uppercase tracking-widest text-white/70 transition hover:border-gold/50 hover:text-gold",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? "Uploading…" : "Upload slides"}
            {fileInput}
          </label>

          <p className="mt-5 max-w-md text-xs leading-relaxed text-white/35">
            PDF and PowerPoint both open in presentation mode — fullscreen, arrow keys to advance,
            one page per slide.
          </p>

          {syncMessage && (
            <p className="mt-4 max-w-md text-xs leading-relaxed text-gold/80">{syncMessage}</p>
          )}

          <button
            type="button"
            onClick={async () => {
              await syncSlides();
              setStarted(true);
              revealControls();
            }}
            disabled={syncing}
            className="mt-4 text-xs text-white/40 underline underline-offset-4 hover:text-white/60 disabled:opacity-50"
          >
            Continue without fullscreen
          </button>

          <a
            href="/admin/worship"
            className="mt-6 text-xs uppercase tracking-[0.18em] text-gold/70 transition hover:text-gold"
          >
            ← Back to Admin
          </a>
        </div>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 transition-opacity duration-500",
          showControls && started ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-6 pt-16 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 md:h-14 md:w-14"
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-2">
              {presentationMode && activeSource && (
                <span className="max-w-[14rem] truncate text-[10px] uppercase tracking-widest text-gold/70">
                  {deckLabel(activeSource)}
                </span>
              )}
              {settings.showCounter && (
                <span className="font-mono text-sm text-white/70">
                  {index + 1} / {total}
                </span>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isPresentMode && (
                  <button
                    type="button"
                    onClick={() => setAutoPlay((v) => !v)}
                    className={cn(
                      "cursor-pointer rounded-sm border px-3 py-1.5 text-[10px] uppercase tracking-widest transition",
                      autoPlay
                        ? "border-gold/60 bg-gold/20 text-gold"
                        : "border-white/20 text-white/50 hover:border-white/40"
                    )}
                    aria-pressed={autoPlay}
                  >
                    {autoPlay ? "Auto ▶" : "Auto"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                  className="cursor-pointer rounded-sm border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/50 hover:border-white/40"
                >
                  {isFullscreen ? "Exit FS" : "Fullscreen"}
                </button>
                {(presentationMode || isPresentMode) && (
                  <button
                    type="button"
                    onClick={exitPresentation}
                    className="cursor-pointer rounded-sm border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/50 hover:border-white/40"
                  >
                    End
                  </button>
                )}
                {isPresentMode && (
                  <a
                    href="/admin/worship"
                    className="cursor-pointer rounded-sm border border-gold/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-gold/80 hover:border-gold hover:text-gold"
                  >
                    Admin
                  </a>
                )}
                {!isPresentMode && (
                  <label className="cursor-pointer rounded-sm border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/50 hover:border-white/40">
                    + Upload
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
              {(current.titleAm || current.title) && (
                <p className="font-amharic max-w-xs truncate text-center text-xs text-white/40">
                  {current.titleAm ?? current.title}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 md:h-14 md:w-14"
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {settings.showCounter && started && !showControls && (
        <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-sm bg-black/50 px-3 py-1 font-mono text-xs text-white/50 backdrop-blur">
          {index + 1} / {total}
        </div>
      )}

      {presentationMode && started && !showControls && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/20">
          {isPdfSlide ? "Page" : "Slide"} {index + 1} of {total} · → Space to advance
        </div>
      )}
    </div>
  );
}
