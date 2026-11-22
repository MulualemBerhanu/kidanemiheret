"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorshipSourceRow {
  id: string;
  label: string;
  kind?: string;
  note?: string;
  originalFile: string | null;
  slideCount: number;
  presentUrl: string;
  pageCount?: number;
}

interface WorshipAdminClientProps {
  initialSources: WorshipSourceRow[];
  initialSlideCount: number;
  updatedAt?: string;
}

export function WorshipAdminClient({
  initialSources,
  initialSlideCount,
  updatedAt,
}: WorshipAdminClientProps) {
  const router = useRouter();
  const [sources, setSources] = useState(initialSources);
  const [slideCount, setSlideCount] = useState(initialSlideCount);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function syncUploads() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/worship/sync", { method: "POST" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Sync failed");
      await refreshList();
      setMessage(
        data.converted?.length
          ? `Synced. Converted: ${data.converted.join(", ")}`
          : "Slides are up to date"
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(file: File) {
    setBusy(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/worship/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Upload failed");
      await refreshList();
      setMessage(`Uploaded and converted: ${file.name}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function refreshList() {
    const res = await fetch("/api/admin/worship");
    const data = await res.json();
    if (data.ok) {
      setSources(data.sources ?? []);
      setSlideCount(data.slideCount ?? 0);
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="admin-card space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-xl text-charcoal">Hall / TV slides</p>
            <p className="mt-1 max-w-xl text-sm text-charcoal/50">
              Upload PDF or PowerPoint for the worship screen. Bookmark a deck&apos;s TV link on
              the hall display.
            </p>
            <p className="mt-2 text-xs text-charcoal/40">
              {slideCount} slides in manifest
              {updatedAt ? ` · updated ${updatedAt}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={syncUploads}
              className="rounded-[2px] border border-gold/40 bg-white px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-charcoal transition hover:bg-gold/10 disabled:opacity-60"
            >
              {busy ? "Working…" : "Sync uploads"}
            </button>
            <label className="cursor-pointer rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110">
              {busy ? "Working…" : "Upload PDF / PPT"}
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,application/pdf"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-charcoal/45">
          TV present URLs stay public (no login). Operator tools live here in admin. You can still
          open <a href="/worship-screen" className="text-gold underline-offset-2 hover:underline">/worship-screen</a>{" "}
          on a laptop if needed.
        </p>
      </div>

      {message && (
        <p className="rounded-[2px] border border-gold/25 bg-white/80 px-4 py-3 text-sm text-charcoal/70">
          {message}
        </p>
      )}

      {sources.length === 0 ? (
        <div className="admin-card px-5 py-14 text-center text-sm text-charcoal/50">
          No presentations yet. Upload a PDF or PPT to get started.
        </div>
      ) : (
        <ul className="admin-card divide-y divide-gold/15 overflow-hidden">
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex flex-wrap items-center gap-4 px-4 py-4 md:px-5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl text-charcoal">{source.label}</p>
                <p className="mt-1 text-xs text-charcoal/50">
                  {(source.kind || "slides").toUpperCase()} · {source.slideCount} slides
                  {source.originalFile ? ` · ${source.originalFile}` : ""}
                </p>
              </div>
              <a
                href={source.presentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[2px] border border-gold/35 bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal/70 transition hover:border-gold hover:bg-gold/10"
              >
                Open TV link
              </a>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `${window.location.origin}${source.presentUrl}`
                  );
                  setMessage(`Copied: ${source.presentUrl}`);
                }}
                className="rounded-[2px] border border-charcoal/15 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-charcoal/55 hover:border-gold/40"
              >
                Copy URL
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
