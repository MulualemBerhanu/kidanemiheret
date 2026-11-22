/** Convert one upload (PDF / PPT / PPTX) — outputs JSON for the Next.js API. */
import path from "path";
import { convertUploadFile, isSupportedUpload, slidesDir } from "./worship-lib.mjs";

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: node scripts/convert-worship-api.mjs uploads/file.pdf");
  process.exit(1);
}

const filePath = path.isAbsolute(fileArg)
  ? fileArg
  : path.join(slidesDir, fileArg.replace(/^uploads\//, "uploads/"));

if (!isSupportedUpload(filePath)) {
  console.error("Unsupported file type. Use PDF, PPT, or PPTX.");
  process.exit(1);
}

try {
  const result = await convertUploadFile(filePath, { replace: true });
  console.log(
    JSON.stringify({
      ok: true,
      filename: result.filename,
      sourceId: result.sourceId,
      slideCount: result.slideCount,
      slides: result.manifest.slides,
      sources: result.manifest.sources,
      totalSlides: result.manifest.slides.length,
    })
  );
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.log(JSON.stringify({ ok: false, error: message }));
  process.exit(1);
}
