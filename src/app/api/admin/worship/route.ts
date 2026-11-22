import { NextResponse } from "next/server";
import { assertAdminApiSession } from "@/lib/admin-auth";
import { loadWorshipManifest } from "@/lib/worship-manifest";
import { deckLabel } from "@/data/worship-slides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  const manifest = loadWorshipManifest();
  const sources = (manifest.sources ?? []).map((source) => ({
    ...source,
    label: deckLabel(source),
    slideCount: source.slideIds?.length ?? 0,
    presentUrl: `/worship-screen/present/${encodeURIComponent(source.id)}`,
  }));

  return NextResponse.json({
    ok: true,
    updatedAt: manifest.updatedAt,
    slideCount: manifest.slides.length,
    sources,
  });
}
