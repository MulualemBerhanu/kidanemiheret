import "server-only";
import fs from "fs";
import path from "path";
import type { GalleryFile, GalleryImage, StoredGalleryImage } from "@/data/gallery";
import { GALLERY_CATEGORY_KEYS } from "@/data/gallery";

export type { StoredGalleryImage, GalleryFile };

const GALLERY_FILE = path.join(process.cwd(), "data", "gallery.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "gallery", "uploads");

function emptyFile(): GalleryFile {
  return { version: 1, updatedAt: new Date().toISOString(), images: [] };
}

export function getGalleryUploadDir() {
  return UPLOAD_DIR;
}

export function readGalleryFile(): GalleryFile {
  try {
    if (!fs.existsSync(GALLERY_FILE)) return emptyFile();
    const parsed = JSON.parse(fs.readFileSync(GALLERY_FILE, "utf8")) as GalleryFile;
    if (!parsed?.images || !Array.isArray(parsed.images)) return emptyFile();
    return parsed;
  } catch {
    return emptyFile();
  }
}

export function writeGalleryFile(file: GalleryFile) {
  fs.mkdirSync(path.dirname(GALLERY_FILE), { recursive: true });
  const next: GalleryFile = {
    ...file,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(next, null, 2) + "\n", "utf8");
  return next;
}

export function listStoredGalleryImages(): StoredGalleryImage[] {
  return [...readGalleryFile().images].sort((a, b) => a.order - b.order);
}

export function getStoredGalleryImage(id: string) {
  return readGalleryFile().images.find((img) => img.id === id);
}

export function toPublicGalleryImage(img: StoredGalleryImage): GalleryImage {
  return {
    id: img.id,
    src: img.src,
    altKey: img.altKey,
    width: img.width,
    height: img.height,
    categoryKey: img.categoryKey,
  };
}

export function getPublishedGalleryImages(): GalleryImage[] {
  return listStoredGalleryImages()
    .filter((img) => img.published)
    .map(toPublicGalleryImage);
}

export function createGalleryImageId() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function nextGalleryOrder() {
  const images = listStoredGalleryImages();
  if (!images.length) return 1;
  return Math.max(...images.map((i) => i.order)) + 1;
}

export function upsertGalleryImage(image: StoredGalleryImage) {
  const file = readGalleryFile();
  const idx = file.images.findIndex((i) => i.id === image.id);
  if (idx >= 0) file.images[idx] = image;
  else file.images.push(image);
  writeGalleryFile(file);
  return image;
}

export function deleteGalleryImage(id: string) {
  const file = readGalleryFile();
  const existing = file.images.find((i) => i.id === id);
  if (!existing) return false;

  // Only delete files we uploaded under uploads/
  if (existing.src.startsWith("/images/gallery/uploads/")) {
    const abs = path.join(process.cwd(), "public", existing.src.replace(/^\//, ""));
    try {
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch {
      /* ignore */
    }
  }

  writeGalleryFile({
    ...file,
    images: file.images.filter((i) => i.id !== id),
  });
  return true;
}

export function normalizeCategory(key: string) {
  return (GALLERY_CATEGORY_KEYS as readonly string[]).includes(key)
    ? key
    : "Community";
}
