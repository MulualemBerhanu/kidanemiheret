import { WorshipScreenClient } from "@/components/worship/WorshipScreenClient";
import { loadWorshipManifest } from "@/lib/worship-manifest";

interface WorshipScreenPageProps {
  searchParams: Promise<{ deck?: string; start?: string }>;
}

export default async function WorshipScreenPage({ searchParams }: WorshipScreenPageProps) {
  const manifest = loadWorshipManifest();
  const { deck, start } = await searchParams;

  return (
    <WorshipScreenClient
      initialSlides={manifest.slides}
      settings={manifest.settings}
      sources={manifest.sources ?? []}
      initialDeckId={deck}
      mode="console"
      autoPresent={start === "1" && !!deck}
    />
  );
}
