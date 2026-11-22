"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GALLERY_CATEGORY_KEYS, type StoredGalleryImage } from "@/data/gallery";

interface GalleryAdminClientProps {
  initialImages: StoredGalleryImage[];
}

export function GalleryAdminClient({ initialImages }: GalleryAdminClientProps) {
  const router = useRouter();
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage(null);
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error ?? `Failed: ${file.name}`);
        next.unshift(data.image);
      }
      setImages(next.sort((a, b) => a.order - b.order));
      setMessage(`Uploaded ${files.length} photo${files.length > 1 ? "s" : ""}`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function updateImage(id: string, patch: Record<string, unknown>) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Update failed");
      setImages((prev) =>
        prev.map((img) => (img.id === id ? data.image : img)).sort((a, b) => a.order - b.order)
      );
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeImage(id: string, label: string) {
    if (!window.confirm(`Remove this photo from the gallery?\n${label}`)) return;
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Delete failed");
      setImages((prev) => prev.filter((img) => img.id !== id));
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function move(id: string, direction: -1 | 1) {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((img) => img.id === id);
    const swapWith = index + direction;
    if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return;

    const a = sorted[index]!;
    const b = sorted[swapWith]!;
    setBusyId(id);
    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${a.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: b.order }),
        }),
        fetch(`/api/admin/gallery/${b.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
      const aOrder = a.order;
      setImages((prev) =>
        prev
          .map((img) => {
            if (img.id === a.id) return { ...img, order: b.order };
            if (img.id === b.id) return { ...img, order: aOrder };
            return img;
          })
          .sort((x, y) => x.order - y.order)
      );
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-display text-xl text-charcoal">Upload photos</p>
          <p className="mt-1 text-sm text-charcoal/50">
            JPG, PNG, or WebP. They appear on the public Gallery page when published.
          </p>
        </div>
        <label className="cursor-pointer rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110">
          {uploading ? "Uploading…" : "Upload photos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {message && (
        <p className="rounded-[2px] border border-gold/25 bg-white/80 px-4 py-3 text-sm text-charcoal/70">
          {message}
        </p>
      )}

      {images.length === 0 ? (
        <div className="admin-card px-5 py-14 text-center text-sm text-charcoal/50">
          No gallery photos yet.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => {
            const busy = busyId === img.id;
            return (
              <li key={img.id} className="admin-card overflow-hidden">
                <div className="relative aspect-[4/3] bg-charcoal/5">
                  <Image src={img.src} alt="" fill className="object-cover" sizes="320px" />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <label className="admin-label">Category</label>
                    <select
                      className="admin-field"
                      value={img.categoryKey}
                      disabled={busy}
                      onChange={(e) => updateImage(img.id, { categoryKey: e.target.value })}
                    >
                      {GALLERY_CATEGORY_KEYS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-charcoal/70">
                    <input
                      type="checkbox"
                      checked={img.published}
                      disabled={busy}
                      onChange={(e) => updateImage(img.id, { published: e.target.checked })}
                      className="accent-[#d4af37]"
                    />
                    Published
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || index === 0}
                      onClick={() => move(img.id, -1)}
                      className="rounded-[2px] border border-charcoal/15 px-3 py-1.5 text-[10px] uppercase tracking-wider text-charcoal/60 disabled:opacity-40"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={busy || index === images.length - 1}
                      onClick={() => move(img.id, 1)}
                      className="rounded-[2px] border border-charcoal/15 px-3 py-1.5 text-[10px] uppercase tracking-wider text-charcoal/60 disabled:opacity-40"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => removeImage(img.id, img.src)}
                      className="ml-auto text-[10px] uppercase tracking-wider text-red-700/70 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
