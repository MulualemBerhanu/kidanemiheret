/**
 * Worship display slide types & default manifest loader.
 * Production slides are driven by public/worship-slides/manifest.json
 */

export interface WorshipSlide {
  id: string;
  /** Rasterized slide image (PPT / placeholders) */
  file?: string;
  /** Live PDF page — rendered in browser, one full page per slide */
  kind?: "image" | "pdf-page";
  page?: number;
  sourceId?: string;
  title?: string;
  titleAm?: string;
  order: number;
}

export type WorshipSourceKind = "document" | "presentation" | "image";

export interface WorshipSource {
  id: string;
  kind?: WorshipSourceKind;
  note?: string;
  originalFile: string | null;
  convertedAt?: string;
  pageCount?: number;
  slideIds: string[];
}

export interface WorshipDisplaySettings {
  showCounter: boolean;
  autoPlay: {
    enabled: boolean;
    intervalSeconds: number;
  };
  controlsHideDelayMs: number;
}

export interface WorshipManifest {
  version: number;
  updatedAt: string;
  settings: WorshipDisplaySettings;
  slides: WorshipSlide[];
  sources?: WorshipSource[];
}

export const WORSHIP_SLIDES_DIR = "/worship-slides";

export const DEFAULT_WORSHIP_SETTINGS: WorshipDisplaySettings = {
  showCounter: true,
  autoPlay: {
    enabled: false,
    intervalSeconds: 10,
  },
  controlsHideDelayMs: 3500,
};

/** Fallback slides if manifest.json is unavailable */
export const FALLBACK_SLIDES: WorshipSlide[] = [
  { id: "slide-001", file: "slide-001.webp", title: "Opening Prayer", titleAm: "ጸሎት", order: 1 },
  { id: "slide-002", file: "slide-002.webp", title: "Hymn / Mezmur", titleAm: "መዝሙር", order: 2 },
  { id: "slide-003", file: "slide-003.webp", title: "Divine Liturgy", titleAm: "ቅዱስ ቁርባን", order: 3 },
];

export function slideSrc(file: string | undefined): string {
  if (!file) return "";
  return `${WORSHIP_SLIDES_DIR}/${file}`;
}

export function uploadFileSrc(relativePath: string): string {
  const normalized = relativePath.replace(/^\/?worship-slides\//, "");
  const encoded = normalized
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${WORSHIP_SLIDES_DIR}/${encoded}`;
}

/** Clean API URL for live PDF rendering (no spaces/special chars in path). */
export function pdfSourceApiSrc(sourceId: string): string {
  return `/api/worship/pdf/${encodeURIComponent(sourceId)}`;
}

export function isPdfPageSlide(slide: WorshipSlide): boolean {
  return slide.kind === "pdf-page" || (slide.page != null && !slide.file);
}

export function isDocumentSource(source: WorshipSource): boolean {
  if (source.kind === "document") return true;
  const file = source.originalFile?.toLowerCase() ?? "";
  return file.endsWith(".pdf");
}

export function isPresentationSource(source: WorshipSource): boolean {
  if (source.kind === "presentation") return true;
  return isPowerPointSource(source);
}

export function sortSlides(slides: WorshipSlide[]): WorshipSlide[] {
  return [...slides].sort((a, b) => a.order - b.order);
}

export function slidesForSource(
  slides: WorshipSlide[],
  sources: WorshipSource[],
  sourceId: string
): WorshipSlide[] {
  const source = sources.find((s) => s.id === sourceId);
  if (!source) return [];
  const ids = new Set(source.slideIds);
  return sortSlides(slides.filter((s) => ids.has(s.id)));
}

export function isPowerPointSource(source: WorshipSource): boolean {
  const file = source.originalFile?.toLowerCase() ?? "";
  return file.endsWith(".ppt") || file.endsWith(".pptx");
}

export function deckLabel(source: WorshipSource): string {
  if (source.note) return source.note;
  if (source.originalFile) {
    return source.originalFile.replace(/^uploads\//, "").replace(/\.[^.]+$/, "");
  }
  return source.id;
}
