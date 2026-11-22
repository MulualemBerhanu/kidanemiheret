import { notFound } from "next/navigation";
import { WorshipScreenClient } from "@/components/worship/WorshipScreenClient";
import { loadWorshipManifest } from "@/lib/worship-manifest";
import { slidesForSource } from "@/data/worship-slides";

interface PresentPageProps {
  params: Promise<{ sourceId: string }>;
}

export default async function WorshipPresentPage({ params }: PresentPageProps) {
  const { sourceId } = await params;
  const manifest = loadWorshipManifest();
  const deckSlides = slidesForSource(manifest.slides, manifest.sources ?? [], sourceId);

  if (deckSlides.length === 0) {
    notFound();
  }

  return (
    <WorshipScreenClient
      initialSlides={manifest.slides}
      settings={manifest.settings}
      sources={manifest.sources ?? []}
      initialDeckId={sourceId}
      mode="present"
      autoPresent
    />
  );
}
