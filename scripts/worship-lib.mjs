/**
 * Shared worship slide conversion logic (runs in plain Node — not Next.js bundled code).
 */
import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import sharp from "sharp";
import { pdf } from "pdf-to-img";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const slidesDir = path.join(__dirname, "../public/worship-slides");
export const uploadsDir = path.join(slidesDir, "uploads");
export const manifestPath = path.join(slidesDir, "manifest.json");

export const TARGET_W = 1920;
export const TARGET_H = 1080;
export const TARGET_AR = TARGET_W / TARGET_H;

export const UPLOAD_EXTENSIONS = [".pdf", ".ppt", ".pptx"];

export function isSupportedUpload(filename) {
  const ext = path.extname(filename).toLowerCase();
  return UPLOAD_EXTENSIONS.includes(ext);
}

export function sourceIdFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function loadManifest() {
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  }
  return {
    version: 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    settings: {
      showCounter: true,
      autoPlay: { enabled: false, intervalSeconds: 10 },
      controlsHideDelayMs: 3500,
    },
    slides: [],
    sources: [],
  };
}

export function saveManifest(manifest) {
  fs.mkdirSync(slidesDir, { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

export function removeSourceSlides(manifest, id) {
  const source = manifest.sources?.find((s) => s.id === id);
  if (!source) return;

  const removeIds = new Set(source.slideIds ?? []);
  for (const slideId of removeIds) {
    const slide = manifest.slides.find((s) => s.id === slideId);
    if (slide?.file) {
      const fp = path.join(slidesDir, slide.file);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
  }

  manifest.slides = manifest.slides.filter((s) => !removeIds.has(s.id));
  manifest.sources = (manifest.sources ?? []).filter((s) => s.id !== id);
}

async function countPdfPages(pdfPath) {
  const document = await pdf(pdfPath, { scale: 1 });
  let pageCount = 0;
  for await (const _ of document) pageCount++;
  return pageCount;
}

/** One full page letterboxed on 1920×1080 — never splits content. */
async function pageToPresentationSlide(
  imageBuffer,
  pageNum,
  sourceId,
  name,
  customTitle
) {
  const id = `${sourceId}-page-${String(pageNum).padStart(3, "0")}`;
  const file = `${id}.webp`;
  const titleBase = customTitle ?? name;

  const fitted = await sharp(imageBuffer)
    .resize(TARGET_W, TARGET_H, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([{ input: fitted, gravity: "centre" }])
    .webp({ quality: 93 })
    .toFile(path.join(slidesDir, file));

  return {
    id,
    file,
    kind: "image",
    sourceId,
    title: `${titleBase} — Slide ${pageNum}`,
  };
}

function fileNeedsConversion(manifest, filename, mtimeMs) {
  const sourceId = sourceIdFromFilename(filename);
  const source = manifest.sources?.find(
    (s) => s.id === sourceId || s.originalFile === `uploads/${filename}`
  );
  if (!source?.convertedAt) return true;
  if (mtimeMs > new Date(source.convertedAt).getTime()) return true;

  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf" && source.kind !== "document") return true;
  if ((ext === ".ppt" || ext === ".pptx") && source.kind !== "presentation") return true;
  if (source.slideIds?.some((id) => id.includes("-part-"))) return true;

  return false;
}

/** Locate LibreOffice binary for PPT/PPTX → PDF conversion. */
export async function findLibreOffice() {
  const candidates = [
    process.env.LIBREOFFICE_PATH,
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/Applications/OpenOffice.app/Contents/MacOS/soffice",
    "/usr/bin/soffice",
    "/usr/bin/libreoffice",
    "/usr/local/bin/soffice",
    "/usr/local/bin/libreoffice",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  for (const cmd of ["soffice", "libreoffice"]) {
    try {
      const { stdout } = await execFileAsync("which", [cmd]);
      const found = stdout.trim();
      if (found) return found;
    } catch {
      /* not on PATH */
    }
  }

  return null;
}

/** Convert PowerPoint to PDF using LibreOffice (must be installed). */
export async function officeToPdf(inputPath) {
  const soffice = await findLibreOffice();
  if (!soffice) {
    throw new Error(
      "PowerPoint files need LibreOffice (free). Install from https://www.libreoffice.org — or export your slides as PDF from PowerPoint and upload that instead."
    );
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "worship-ppt-"));
  try {
    try {
      await execFileAsync(
        soffice,
        [
          "--headless",
          "--nologo",
          "--nofirststartwizard",
          "--convert-to",
          "pdf",
          "--outdir",
          tmpDir,
          inputPath,
        ],
        { timeout: 120000 }
      );
    } catch (err) {
      throw new Error(
        "PowerPoint conversion failed. Try exporting as PDF from PowerPoint, or reinstall LibreOffice."
      );
    }

    const base = path.basename(inputPath, path.extname(inputPath));
    const pdfPath = path.join(tmpDir, `${base}.pdf`);

    if (!fs.existsSync(pdfPath)) {
      throw new Error(
        "PowerPoint conversion failed. Try exporting as PDF from PowerPoint, or reinstall LibreOffice."
      );
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    return pdfBuffer;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/** Register a PDF document — live browser rendering, one page per slide (no image splitting). */
export async function registerPdfDocument(
  pdfPath,
  { replace = true, title = null, sourceFilename = null } = {}
) {
  const filename = sourceFilename ?? path.basename(pdfPath);
  const pdfName = path.basename(filename, path.extname(filename));
  const sourceId = sourceIdFromFilename(filename);

  let manifest = loadManifest();
  if (replace) removeSourceSlides(manifest, sourceId);

  const pageCount = await countPdfPages(pdfPath);
  if (pageCount === 0) throw new Error("No pages found in PDF.");

  const newSlides = Array.from({ length: pageCount }, (_, i) => {
    const pageNum = i + 1;
    const id = `${sourceId}-page-${String(pageNum).padStart(3, "0")}`;
    return {
      id,
      kind: "pdf-page",
      page: pageNum,
      sourceId,
      title: `${title ?? pdfName} — Page ${pageNum}`,
    };
  });

  const maxOrder = manifest.slides.reduce((m, s) => Math.max(m, s.order ?? 0), 0);
  newSlides.forEach((s, i) => {
    s.order = maxOrder + i + 1;
  });

  manifest.slides.push(...newSlides);
  manifest.updatedAt = new Date().toISOString();
  manifest.sources = manifest.sources ?? [];
  manifest.sources.push({
    id: sourceId,
    kind: "document",
    note: title ?? pdfName,
    originalFile: `uploads/${filename}`,
    convertedAt: manifest.updatedAt,
    pageCount,
    slideIds: newSlides.map((s) => s.id),
  });

  saveManifest(manifest);

  return {
    sourceId,
    filename,
    slideCount: newSlides.length,
    manifest,
  };
}

/** Rasterize a presentation PDF (from PPT) — one slide per page, never split. */
export async function convertPresentationPdf(
  pdfPath,
  { replace = true, title = null, sourceFilename = null } = {}
) {
  const filename = sourceFilename ?? path.basename(pdfPath);
  const pdfName = path.basename(filename, path.extname(filename));
  const sourceId = sourceIdFromFilename(filename);

  let manifest = loadManifest();
  if (replace) removeSourceSlides(manifest, sourceId);

  const document = await pdf(pdfPath, { scale: 3 });
  let pageNum = 0;
  const newSlides = [];

  for await (const image of document) {
    pageNum++;
    const slide = await pageToPresentationSlide(
      image,
      pageNum,
      sourceId,
      pdfName,
      title
    );
    newSlides.push(slide);
  }

  if (newSlides.length === 0) {
    throw new Error("No slides found in presentation.");
  }

  const maxOrder = manifest.slides.reduce((m, s) => Math.max(m, s.order ?? 0), 0);
  newSlides.forEach((s, i) => {
    s.order = maxOrder + i + 1;
  });

  manifest.slides.push(...newSlides);
  manifest.updatedAt = new Date().toISOString();
  manifest.sources = manifest.sources ?? [];
  manifest.sources.push({
    id: sourceId,
    kind: "presentation",
    note: title ?? pdfName,
    originalFile: `uploads/${filename}`,
    convertedAt: manifest.updatedAt,
    pageCount: newSlides.length,
    slideIds: newSlides.map((s) => s.id),
  });

  saveManifest(manifest);

  return {
    sourceId,
    filename,
    slideCount: newSlides.length,
    manifest,
  };
}

/** @deprecated Use registerPdfDocument or convertPresentationPdf */
export async function convertPdfFile(
  pdfPath,
  { replace = true, title = null, sourceFilename = null } = {}
) {
  return registerPdfDocument(pdfPath, { replace, title, sourceFilename });
}

/** Convert PDF, PPT, or PPTX from uploads/ and update manifest. */
export async function convertUploadFile(filePath, options = {}) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return registerPdfDocument(filePath, options);
  }

  if (ext === ".ppt" || ext === ".pptx") {
    const pdfBuffer = await officeToPdf(filePath);
    const tmpPdf = path.join(
      os.tmpdir(),
      `worship-${Date.now()}-${path.basename(filePath, ext)}.pdf`
    );
    fs.writeFileSync(tmpPdf, pdfBuffer);
    try {
      return await convertPresentationPdf(tmpPdf, {
        ...options,
        sourceFilename: path.basename(filePath),
        title: options.title ?? path.basename(filePath, ext),
      });
    } finally {
      if (fs.existsSync(tmpPdf)) fs.unlinkSync(tmpPdf);
    }
  }

  throw new Error(`Unsupported file type "${ext}". Use PDF, PPT, or PPTX.`);
}

/** Scan uploads/ and convert new or updated PDFs / PowerPoint files. */
export async function syncUploadFolder() {
  fs.mkdirSync(uploadsDir, { recursive: true });

  const converted = [];
  const skipped = [];
  const failed = [];

  const files = fs
    .readdirSync(uploadsDir)
    .filter((f) => isSupportedUpload(f) && !f.startsWith("."));

  for (const filename of files) {
    const filePath = path.join(uploadsDir, filename);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const manifest = loadManifest();
    if (!fileNeedsConversion(manifest, filename, stat.mtimeMs)) {
      skipped.push(filename);
      continue;
    }

    try {
      await convertUploadFile(filePath, { replace: true });
      converted.push(filename);
    } catch (err) {
      failed.push({
        filename,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (failed.length === 1) {
    throw new Error(failed[0].error);
  }

  if (failed.length > 1) {
    throw new Error(
      failed.map((f) => `${f.filename}: ${f.error}`).join(" · ")
    );
  }

  return {
    manifest: loadManifest(),
    converted,
    skipped,
    failed,
  };
}
