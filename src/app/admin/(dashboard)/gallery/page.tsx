import { GalleryAdminClient } from "@/components/admin/GalleryAdminClient";
import { listStoredGalleryImages } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
  const images = listStoredGalleryImages();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Gallery</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal">Manage gallery</h1>
        <p className="mt-2 text-sm text-charcoal/55">
          Upload parish photos, set categories, reorder, and publish to the website.
        </p>
      </div>
      <GalleryAdminClient initialImages={images} />
    </div>
  );
}
