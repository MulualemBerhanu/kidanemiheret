"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface BylawsPdfPagesProps {
  pdfUrl: string;
  pageNumber: number;
  scale: number;
  onLoadSuccess: (numPages: number) => void;
}

export function BylawsPdfPages({
  pdfUrl,
  pageNumber,
  scale,
  onLoadSuccess,
}: BylawsPdfPagesProps) {
  const [error, setError] = useState<string | null>(null);
  const [baseWidth, setBaseWidth] = useState(720);

  useEffect(() => {
    const update = () => setBaseWidth(Math.min(920, Math.floor(window.innerWidth * 0.88)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const width = baseWidth * scale;

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-ivory/55">Could not load PDF.</p>
        <p className="font-mono text-[10px] text-ivory/30">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex justify-center">
      <Document
        file={pdfUrl}
        loading={
          <div className="py-24 text-[11px] uppercase tracking-[0.28em] text-ivory/40">
            Opening…
          </div>
        }
        error={
          <div className="py-24 text-sm text-ivory/50">Could not render document.</div>
        }
        onLoadSuccess={({ numPages }) => {
          setError(null);
          onLoadSuccess(numPages);
        }}
        onLoadError={(err) => setError(err.message)}
      >
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer
          renderAnnotationLayer={false}
          className="!bg-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          loading={
            <div className="py-24 text-[11px] uppercase tracking-[0.28em] text-ivory/40">
              …
            </div>
          }
        />
      </Document>
    </div>
  );
}
