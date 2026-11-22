import { NextResponse } from "next/server";
import { assertAdminApiSession } from "@/lib/admin-auth";
import {
  createGalleryImageId,
  listStoredGalleryImages,
  nextGalleryOrder,
  normalizeCategory,
  upsertGalleryImage,
} from "@/lib/gallery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true, images: listStoredGalleryImages() });
}

/** Create gallery item from an already-uploaded src (used after upload route). */
export async function POST(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const src = String(body.src ?? "").trim();
    if (!src.startsWith("/images/gallery/")) {
      return NextResponse.json({ ok: false, error: "Invalid image path" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const image = {
      id: createGalleryImageId(),
      src,
      altKey: String(body.altKey ?? "1"),
      width: Number(body.width) || 1600,
      height: Number(body.height) || 1200,
      categoryKey: normalizeCategory(String(body.categoryKey ?? "Community")),
      order: typeof body.order === "number" ? body.order : nextGalleryOrder(),
      published: body.published !== false,
      updatedAt: now,
    };

    upsertGalleryImage(image);
    return NextResponse.json({ ok: true, image });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not add image";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
