"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StoredEvent } from "@/data/events";

const CATEGORY_OPTIONS = ["Feast", "Liturgy", "Youth", "Fellowship", "Other"];

interface EventFormProps {
  initial?: StoredEvent;
}

export function EventForm({ initial }: EventFormProps) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [titleEn, setTitleEn] = useState(initial?.title.en ?? "");
  const [titleAm, setTitleAm] = useState(initial?.title.am ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initial?.description.en ?? "");
  const [descriptionAm, setDescriptionAm] = useState(initial?.description.am ?? "");
  const [locationEn, setLocationEn] = useState(initial?.location.en ?? "");
  const [locationAm, setLocationAm] = useState(initial?.location.am ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "");
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? []);
  const [flyerImage, setFlyerImage] = useState(initial?.flyerImage ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function uploadBanner(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/events/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Upload failed");
      setFlyerImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: { en: titleEn, am: titleAm },
        description: { en: descriptionEn, am: descriptionAm },
        location: { en: locationEn, am: locationAm },
        startDate,
        endDate: endDate || null,
        startTime,
        endTime: endTime || null,
        categories,
        flyerImage: flyerImage || null,
        published,
        timezone: "America/Los_Angeles",
      };

      const res = await fetch(
        editing ? `/api/admin/events/${initial!.id}` : "/api/admin/events",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!window.confirm(`Delete “${initial.title.en}”?`)) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/events/${initial.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Delete failed");
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card space-y-8 p-6 md:p-8">
      <section>
        <h2 className="font-display text-xl text-charcoal">Details</h2>
        <p className="mt-1 text-sm text-charcoal/50">
          English is required. Amharic can be added now or later.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="admin-label">Title (English)</label>
            <input
              className="admin-field"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Meskel Celebration"
              required
            />
          </div>
          <div>
            <label className="admin-label">Title (Amharic)</label>
            <input
              className="admin-field font-amharic"
              value={titleAm}
              onChange={(e) => setTitleAm(e.target.value)}
              placeholder="መስቀል በዓል"
            />
          </div>
          <div>
            <label className="admin-label">Place (English)</label>
            <input
              className="admin-field"
              value={locationEn}
              onChange={(e) => setLocationEn(e.target.value)}
              placeholder="Church Grounds"
              required
            />
          </div>
          <div>
            <label className="admin-label">Place (Amharic)</label>
            <input
              className="admin-field font-amharic"
              value={locationAm}
              onChange={(e) => setLocationAm(e.target.value)}
              placeholder="የቤተ ክርስቲያን ግቢ"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Description (English)</label>
            <textarea
              className="admin-field min-h-[96px] resize-y"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Short description for the events page"
            />
          </div>
          <div className="md:col-span-2">
            <label className="admin-label">Description (Amharic)</label>
            <textarea
              className="admin-field font-amharic min-h-[96px] resize-y"
              value={descriptionAm}
              onChange={(e) => setDescriptionAm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 pt-8">
        <h2 className="font-display text-xl text-charcoal">Date & time</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="admin-label">Start date</label>
            <input
              type="date"
              className="admin-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="admin-label">End date</label>
            <input
              type="date"
              className="admin-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Start time</label>
            <input
              className="admin-field"
              placeholder="10:00 AM"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="admin-label">End time</label>
            <input
              className="admin-field"
              placeholder="2:00 PM"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 pt-8">
        <h2 className="font-display text-xl text-charcoal">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((cat) => {
            const on = categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={
                  on
                    ? "rounded-[2px] border border-gold bg-gold/15 px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-charcoal"
                    : "rounded-[2px] border border-charcoal/15 bg-white px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-charcoal/55 hover:border-gold/40"
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-gold/15 pt-8">
        <h2 className="font-display text-xl text-charcoal">Banner image</h2>
        <p className="mt-1 text-sm text-charcoal/50">
          Upload a flyer or photo (JPG, PNG, or WebP). Shown on the Events page.
        </p>
        <div className="mt-5 space-y-4">
          {flyerImage ? (
            <div className="relative aspect-[16/9] max-w-xl overflow-hidden rounded-[2px] border border-gold/25 bg-charcoal/5">
              <Image src={flyerImage} alt="" fill className="object-cover" sizes="640px" />
            </div>
          ) : (
            <div className="flex aspect-[16/9] max-w-xl items-center justify-center rounded-[2px] border border-dashed border-gold/30 bg-white/60 text-sm text-charcoal/40">
              No banner yet
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-[2px] border border-gold/40 bg-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-charcoal transition hover:border-gold hover:bg-gold/10">
              {uploading ? "Uploading…" : "Upload banner"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadBanner(f);
                  e.target.value = "";
                }}
              />
            </label>
            {flyerImage && (
              <button
                type="button"
                onClick={() => setFlyerImage("")}
                className="text-[11px] uppercase tracking-[0.18em] text-charcoal/45 hover:text-charcoal"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </section>

      <label className="flex items-center gap-3 border-t border-gold/15 pt-6 text-sm text-charcoal/75">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-[#d4af37]"
        />
        Published on the website
      </label>

      {error && (
        <p className="rounded-[2px] border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-gold/15 pt-6">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="rounded-[2px] border border-charcoal/15 bg-white px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-charcoal/60 transition hover:border-gold/40"
        >
          Cancel
        </button>
        {editing && (
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="ml-auto text-[11px] uppercase tracking-[0.18em] text-red-700/70 hover:text-red-700"
          >
            Delete event
          </button>
        )}
      </div>
    </form>
  );
}
