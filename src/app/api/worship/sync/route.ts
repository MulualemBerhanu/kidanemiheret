import { NextResponse } from "next/server";
import { assertWorshipAdmin } from "@/lib/worship-auth";
import { syncWorshipUploads } from "@/lib/worship-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Auto-convert new/updated PDFs in uploads/ before worship display. */
export async function POST(request: Request) {
  const denied = assertWorshipAdmin(request);
  if (denied) return denied;

  try {
    const data = await syncWorshipUploads();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
