import { WorshipAdminClient } from "@/components/admin/WorshipAdminClient";
import { deckLabel } from "@/data/worship-slides";
import { loadWorshipManifest } from "@/lib/worship-manifest";

export const dynamic = "force-dynamic";

export default function AdminWorshipPage() {
  const manifest = loadWorshipManifest();
  const sources = (manifest.sources ?? []).map((source) => ({
    ...source,
    label: deckLabel(source),
    slideCount: source.slideIds?.length ?? 0,
    presentUrl: `/worship-screen/present/${encodeURIComponent(source.id)}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Worship</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal">Worship display</h1>
        <p className="mt-2 text-sm text-charcoal/55">
          Upload liturgy decks and copy TV present links for the hall screen.
        </p>
      </div>
      <WorshipAdminClient
        initialSources={sources}
        initialSlideCount={manifest.slides.length}
        updatedAt={manifest.updatedAt}
      />
    </div>
  );
}
