import { NextResponse } from "next/server";
import { assertAdminApiSession } from "@/lib/admin-auth";
import { syncWorshipUploads } from "@/lib/worship-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  try {
    const data = await syncWorshipUploads();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
