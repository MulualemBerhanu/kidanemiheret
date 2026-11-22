/**
 * Sequence frames — cinematic tier ONLY (scroll canvas strips).
 * Do not use for cards, gallery, or section photos.
 * See public/images/ASSETS.md
 */

export const SEQUENCE_DIR = "/sequence";
export const SEQUENCE_EXT = "png";
export const SEQUENCE_FRAME_COUNT = 15;
export const SEQUENCE_PATTERN = `${SEQUENCE_DIR}/frame-{frame}.${SEQUENCE_EXT}`;

export function framePath(num: number): string {
  return `${SEQUENCE_DIR}/frame-${String(num).padStart(4, "0")}.${SEQUENCE_EXT}`;
}

export const SEQUENCE_FALLBACK = framePath(15);
