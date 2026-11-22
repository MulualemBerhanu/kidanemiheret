import { NextResponse } from "next/server";
import { assertAdminApiSession } from "@/lib/admin-auth";
import {
  deleteGalleryImage,
  getStoredGalleryImage,
  normalizeCategory,
  upsertGalleryImage,
} from "@/lib/gallery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  const { id } = await params;
  const existing = getStoredGalleryImage(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const image = {
      ...existing,
      categoryKey:
        body.categoryKey !== undefined
          ? normalizeCategory(String(body.categoryKey))
          : existing.categoryKey,
      published:
        body.published === undefined ? existing.published : Boolean(body.published),
      order:
        typeof body.order === "number" && Number.isFinite(body.order)
          ? body.order
          : existing.order,
      altKey: body.altKey !== undefined ? String(body.altKey) : existing.altKey,
      updatedAt: new Date().toISOString(),
    };
    upsertGalleryImage(image);
    return NextResponse.json({ ok: true, image });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  const { id } = await params;
  const ok = deleteGalleryImage(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
