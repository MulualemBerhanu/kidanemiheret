import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { assertAdminApiSession } from "@/lib/admin-auth";
import {
  createGalleryImageId,
  getGalleryUploadDir,
  nextGalleryOrder,
  normalizeCategory,
  upsertGalleryImage,
} from "@/lib/gallery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (!/\.(jpe?g|png|webp)$/i.test(file.name) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Use JPG, PNG, or WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Image must be under 12MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = getGalleryUploadDir();
    fs.mkdirSync(uploadDir, { recursive: true });

    const stamp = Date.now().toString(36);
    const safeBase =
      path
        .basename(file.name, path.extname(file.name))
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "gallery";
    const filename = `${safeBase}-${stamp}.webp`;
    const outPath = path.join(uploadDir, filename);

    const image = sharp(buffer).rotate();
    const meta = await image.metadata();
    await image
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    const outMeta = await sharp(outPath).metadata();
    const src = `/images/gallery/uploads/${filename}`;
    const now = new Date().toISOString();
    const categoryKey = normalizeCategory(String(formData.get("categoryKey") ?? "Community"));

    const record = {
      id: createGalleryImageId(),
      src,
      altKey: "1",
      width: outMeta.width || meta.width || 1600,
      height: outMeta.height || meta.height || 1200,
      categoryKey,
      order: nextGalleryOrder(),
      published: true,
      updatedAt: now,
    };

    upsertGalleryImage(record);
    return NextResponse.json({ ok: true, image: record });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
