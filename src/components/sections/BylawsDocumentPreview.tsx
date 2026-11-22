"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const PdfPages = dynamic(
  () => import("@/components/sections/BylawsPdfPages").then((m) => m.BylawsPdfPages),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[50vh] items-center justify-center text-[11px] uppercase tracking-[0.28em] text-ivory/40">
        Loading document…
      </div>
    ),
  }
);

interface BylawsDocumentPreviewProps {
  pdfUrl: string;
  title: string;
  openLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export function BylawsDocumentPreview({
  pdfUrl,
  title,
  openLabel,
  closeLabel,
  prevLabel,
  nextLabel,
  zoomInLabel,
  zoomOutLabel,
  className,
  variant = "secondary",
}: BylawsDocumentPreviewProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);

  const close = useCallback(() => {
    setOpen(false);
    setPage(1);
    setScale(1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setPage((p) => (numPages ? Math.min(numPages, p + 1) : p + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      }
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(1.75, s + 0.15));
      if (e.key === "-") setScale((s) => Math.max(0.7, s - 0.15));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, numPages]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center rounded-[2px] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] transition",
          variant === "primary"
            ? "border border-gold/40 bg-white/60 text-charcoal/80 hover:border-gold hover:bg-gold/10 hover:text-bronze"
            : "border border-gold/30 text-charcoal/70 hover:border-gold/50 hover:text-bronze",
          className
        )}
      >
        {openLabel}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[80] flex flex-col bg-charcoal/95 backdrop-blur-sm"
        >
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gold/20 bg-charcoal px-4 py-3 md:px-6">
            <div className="min-w-0">
              <p id={titleId} className="truncate font-display text-lg text-ivory">
                {title}
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/45">
                {numPages > 0 ? `${page} / ${numPages}` : "…"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
                className="rounded-[2px] border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ivory/70 hover:border-gold/50 hover:text-gold"
                aria-label={zoomOutLabel}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(1.75, s + 0.15))}
                className="rounded-[2px] border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ivory/70 hover:border-gold/50 hover:text-gold"
                aria-label={zoomInLabel}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-[2px] border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ivory/70 enabled:hover:border-gold/50 enabled:hover:text-gold disabled:opacity-30"
              >
                {prevLabel}
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                disabled={numPages > 0 && page >= numPages}
                className="rounded-[2px] border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-ivory/70 enabled:hover:border-gold/50 enabled:hover:text-gold disabled:opacity-30"
              >
                {nextLabel}
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-[2px] bg-gold/15 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-gold hover:bg-gold/25"
              >
                {closeLabel}
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto bg-[#0a0908] p-4 md:p-8">
            <PdfPages
              pdfUrl={pdfUrl}
              pageNumber={page}
              scale={scale}
              onLoadSuccess={(n) => setNumPages(n)}
            />
          </div>
        </div>
      )}
    </>
  );
}
