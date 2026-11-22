"use client";

/**
 * ScrollImageSequence — canvas frames driven by natural page scroll.
 * No pin, no scroll lock. scrub: true maps progress → frame index instantly.
 * Drawing pauses when the section leaves the viewport.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, resolveFramePath } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";
import {
  MAX_CANVAS_DPR_DESKTOP,
  MAX_CANVAS_DPR_MOBILE,
  PRIORITY_FRAME_COUNT,
  SEQUENCE_SCROLL,
} from "@/lib/scroll-config";
import { loadCachedFrame } from "@/lib/frame-cache";
import {
  SEQUENCE_HEIGHTS,
  type SequenceSize,
} from "@/data/sequence-presets";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollImageSequenceScrollConfig {
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  invalidateOnRefresh?: boolean;
  fastScrollEnd?: boolean;
  preventOverlaps?: boolean;
}

export interface ScrollImageSequenceProps {
  framePattern: string;
  frameCount?: number;
  startFrame?: number;
  padLength?: number;
  fallbackSrc: string;
  fallbackAlt?: string;
  className?: string;
  canvasClassName?: string;
  scrollTrigger?: ScrollImageSequenceScrollConfig;
  priorityPreloadCount?: number;
  size?: SequenceSize;
  children?: React.ReactNode;
}

function getCanvasDpr(): number {
  if (typeof window === "undefined") return 1;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const cap = isMobile ? MAX_CANVAS_DPR_MOBILE : MAX_CANVAS_DPR_DESKTOP;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function ScrollImageSequence({
  framePattern,
  frameCount = 15,
  startFrame = 1,
  padLength = 4,
  fallbackSrc,
  fallbackAlt = "Sacred instrument sequence",
  className,
  canvasClassName,
  scrollTrigger: stConfig,
  priorityPreloadCount = PRIORITY_FRAME_COUNT,
  size = "hero",
  children,
}: ScrollImageSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const loadedMaskRef = useRef<boolean[]>([]);
  const highestLoadedRef = useRef(0);
  const currentFrameRef = useRef(-1);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const rafPendingRef = useRef<number | null>(null);
  const pendingIndexRef = useRef(0);
  const inViewRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [priorityReady, setPriorityReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = getCanvasDpr();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w === sizeRef.current.w && h === sizeRef.current.h && dpr === sizeRef.current.dpr) {
      return;
    }
    sizeRef.current = { w, h, dpr };
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const resolveDrawableIndex = useCallback((index: number) => {
    const mask = loadedMaskRef.current;
    if (mask[index]) return index;
    return Math.min(index, highestLoadedRef.current);
  }, []);

  const drawFrame = useCallback(
    (index: number) => {
      if (!inViewRef.current) return;
      if (index === currentFrameRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const drawable = resolveDrawableIndex(index);
      const img = framesRef.current[drawable];
      if (!canvas || !ctx || !img?.complete || !img.naturalWidth) return;

      resizeCanvas();
      const { w, h } = sizeRef.current;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const x = (w - dw) / 2;
      const y = (h - dh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, x, y, dw, dh);
      currentFrameRef.current = index;
    },
    [resizeCanvas, resolveDrawableIndex]
  );

  const scheduleDraw = useCallback(
    (index: number) => {
      pendingIndexRef.current = index;
      if (rafPendingRef.current !== null) return;
      rafPendingRef.current = requestAnimationFrame(() => {
        rafPendingRef.current = null;
        drawFrame(pendingIndexRef.current);
      });
    },
    [drawFrame]
  );

  // Preload first N frames immediately, lazy-load the rest
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const images: (HTMLImageElement | undefined)[] = new Array(frameCount);
    const mask = new Array(frameCount).fill(false);
    const priorityEnd = Math.min(priorityPreloadCount, frameCount);
    let priorityAttempted = 0;
    let priorityLoaded = 0;
    let totalAttempted = 0;
    let totalErrors = 0;
    let didPriorityReady = false;

    const onFrameDone = (i: number, ok: boolean) => {
      if (cancelled) return;
      totalAttempted++;
      if (!ok) totalErrors++;
      else {
        mask[i] = true;
        highestLoadedRef.current = Math.max(highestLoadedRef.current, i);
      }

      if (i < priorityEnd) {
        priorityAttempted++;
        if (ok) priorityLoaded++;
        if (priorityAttempted >= priorityEnd && !didPriorityReady) {
          didPriorityReady = true;
          if (priorityLoaded > 0) {
            framesRef.current = images;
            loadedMaskRef.current = mask;
            setPriorityReady(true);
            ScrollTrigger.refresh();
          } else {
            setLoadFailed(true);
          }
        }
      }
    };

    const loadFrame = (i: number) => {
      const frameIndex = startFrame + i;
      const src = resolveFramePath(framePattern, frameIndex, padLength);
      loadCachedFrame(src)
        .then((img) => {
          images[i] = img;
          onFrameDone(i, true);
        })
        .catch(() => onFrameDone(i, false));
    };

    for (let i = 0; i < priorityEnd; i++) loadFrame(i);

    let cursor = priorityEnd;
    const loadNextBatch = () => {
      if (cancelled || cursor >= frameCount) return;
      const end = Math.min(cursor + 3, frameCount);
      for (let i = cursor; i < end; i++) loadFrame(i);
      cursor = end;
      if (cursor < frameCount) requestAnimationFrame(loadNextBatch);
    };
    if (cursor < frameCount) requestAnimationFrame(loadNextBatch);

    return () => {
      cancelled = true;
    };
  }, [
    reducedMotion,
    framePattern,
    frameCount,
    startFrame,
    padLength,
    priorityPreloadCount,
  ]);

  // Pause drawing when off-screen
  useEffect(() => {
    if (!priorityReady || reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting && scrollTriggerRef.current) {
          const idx = Math.min(
            frameCount - 1,
            Math.floor(scrollTriggerRef.current.progress * (frameCount - 1))
          );
          scheduleDraw(idx);
        }
      },
      { rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priorityReady, reducedMotion, frameCount, scheduleDraw]);

  useEffect(() => {
    if (!priorityReady || reducedMotion) return;

    const ro = new ResizeObserver(() => {
      if (!inViewRef.current) return;
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    });
    const canvas = canvasRef.current;
    if (canvas) ro.observe(canvas);

    inViewRef.current = true;
    scheduleDraw(0);

    return () => ro.disconnect();
  }, [priorityReady, reducedMotion, drawFrame, resizeCanvas, scheduleDraw]);

  // ScrollTrigger — no pin, direct frame mapping
  useEffect(() => {
    if (reducedMotion || loadFailed || !priorityReady) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: stConfig?.start ?? SEQUENCE_SCROLL.start,
        end: stConfig?.end ?? SEQUENCE_SCROLL.end,
        scrub: stConfig?.scrub ?? SEQUENCE_SCROLL.scrub,
        pin: stConfig?.pin ?? SEQUENCE_SCROLL.pin,
        invalidateOnRefresh:
          stConfig?.invalidateOnRefresh ?? SEQUENCE_SCROLL.invalidateOnRefresh,
        fastScrollEnd: stConfig?.fastScrollEnd ?? SEQUENCE_SCROLL.fastScrollEnd,
        preventOverlaps:
          stConfig?.preventOverlaps ?? SEQUENCE_SCROLL.preventOverlaps,
        onUpdate: (self) => {
          const idx = Math.min(
            frameCount - 1,
            Math.floor(self.progress * (frameCount - 1))
          );
          scheduleDraw(idx);
        },
      });
      scrollTriggerRef.current = st;
    }, section);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [
    priorityReady,
    reducedMotion,
    loadFailed,
    frameCount,
    scheduleDraw,
    stConfig?.start,
    stConfig?.end,
    stConfig?.scrub,
    stConfig?.pin,
    stConfig?.invalidateOnRefresh,
    stConfig?.fastScrollEnd,
    stConfig?.preventOverlaps,
  ]);

  const heightClass = SEQUENCE_HEIGHTS[size];

  if (reducedMotion) {
    return (
      <section
        className={cn("relative w-full overflow-hidden bg-charcoal", className)}
        aria-label={fallbackAlt}
      >
        <div className={cn("relative", heightClass)}>
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </section>
    );
  }

  const showCanvas = priorityReady && !loadFailed;

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full overflow-hidden bg-charcoal", className)}
      aria-label={fallbackAlt}
    >
      <div className={cn("relative", heightClass)}>
        {showCanvas ? (
          <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 h-full w-full", canvasClassName)}
            aria-hidden
          />
        ) : (
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        {children}
      </div>
    </section>
  );
}
