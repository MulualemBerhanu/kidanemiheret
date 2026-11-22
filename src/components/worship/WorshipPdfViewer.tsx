"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface WorshipPdfViewerProps {
  sourceId?: string;
  pdfUrl?: string;
  pageNumber: number;
  /** Fullscreen slide-style view (like PowerPoint) */
  presentationMode?: boolean;
  className?: string;
}

export function WorshipPdfViewer({
  sourceId,
  pdfUrl,
  pageNumber,
  presentationMode = false,
  className,
}: WorshipPdfViewerProps) {
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchUrl = sourceId
    ? `/api/worship/pdf/${encodeURIComponent(sourceId)}`
    : pdfUrl;

  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!fetchUrl) {
      setLoadError("No PDF source");
      setReady(false);
      return;
    }

    let cancelled = false;
    setReady(false);
    setLoadError(null);

    fetch(fetchUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load PDF");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchUrl]);

  const pageHeight = presentationMode
    ? Math.floor(viewport.h * 0.98)
    : Math.floor(viewport.h * 0.92);

  if (loadError) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center",
          presentationMode ? "bg-black" : "bg-[#0c0c0c]",
          className
        )}
      >
        <p className="text-sm text-white/50">Could not load PDF.</p>
        <p className="font-mono text-[10px] text-white/25">{loadError}</p>
      </div>
    );
  }

  if (!ready || !fetchUrl) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          presentationMode ? "bg-black" : "bg-[#0c0c0c]",
          className
        )}
      >
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        presentationMode ? "bg-black" : "bg-[#0c0c0c]",
        className
      )}
    >
      <Document
        file={fetchUrl}
        loading={
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
            Opening…
          </div>
        }
        error={
          <div className="max-w-sm px-6 text-center text-sm text-white/50">
            Could not render page.
          </div>
        }
        className="flex h-full w-full items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0, scale: presentationMode ? 0.98 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: presentationMode ? 1.01 : 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Page
              pageNumber={pageNumber}
              height={pageHeight}
              renderTextLayer={!presentationMode}
              renderAnnotationLayer={false}
              className={cn(
                "!bg-white",
                presentationMode
                  ? "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                  : "shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
              )}
              loading={
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
                  …
                </div>
              }
            />
          </motion.div>
        </AnimatePresence>
      </Document>
    </div>
  );
}
