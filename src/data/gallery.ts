export interface GalleryImage {
  id: string;
  src: string;
  /** Key under gallery.alts.* */
  altKey: string;
  width: number;
  height: number;
  /** Key under gallery.categories.* */
  categoryKey?: string;
}

/** Admin / JSON store record */
export interface StoredGalleryImage {
  id: string;
  src: string;
  altKey: string;
  width: number;
  height: number;
  categoryKey: string;
  order: number;
  published: boolean;
  updatedAt: string;
}

export interface GalleryFile {
  version: 1;
  updatedAt: string;
  images: StoredGalleryImage[];
}

export const GALLERY_CATEGORY_KEYS = [
  "Worship",
  "Music",
  "Feasts",
  "Youth",
  "Outreach",
  "Education",
  "Church",
  "Prayer",
  "Liturgy",
  "Community",
  "Heritage",
  "Fellowship",
  "Ministry",
  "Sacred",
  "Faith",
] as const;

export type GalleryCategoryKey = (typeof GALLERY_CATEGORY_KEYS)[number];
