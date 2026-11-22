/** Sync uploads/ PDFs — outputs JSON for the Next.js API. */
import { syncUploadFolder } from "./worship-lib.mjs";

try {
  const { manifest, converted, skipped } = await syncUploadFolder();
  console.log(
    JSON.stringify({
      ok: true,
      slides: manifest.slides,
      sources: manifest.sources,
      settings: manifest.settings,
      converted,
      skipped,
      totalSlides: manifest.slides.length,
    })
  );
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.log(JSON.stringify({ ok: false, error: message }));
  process.exit(1);
}
