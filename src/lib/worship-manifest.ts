import "server-only";
import fs from "fs";
import path from "path";
import type { WorshipManifest } from "@/data/worship-slides";
import {
  DEFAULT_WORSHIP_SETTINGS,
  FALLBACK_SLIDES,
  sortSlides,
} from "@/data/worship-slides";

export function loadWorshipManifest(): WorshipManifest {
  const manifestPath = path.join(
    process.cwd(),
    "public/worship-slides/manifest.json"
  );

  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const data = JSON.parse(raw) as WorshipManifest;
    return {
      ...data,
      settings: { ...DEFAULT_WORSHIP_SETTINGS, ...data.settings },
      slides: sortSlides(data.slides ?? FALLBACK_SLIDES),
    };
  } catch {
    return {
      version: 1,
      updatedAt: new Date().toISOString().slice(0, 10),
      settings: DEFAULT_WORSHIP_SETTINGS,
      slides: FALLBACK_SLIDES,
      sources: [],
    };
  }
}
