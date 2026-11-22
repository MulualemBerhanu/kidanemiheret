import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { assertAdminApiSession } from "@/lib/admin-auth";
import { getEventUploadDir } from "@/lib/events-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

export async function POST(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      return NextResponse.json(
        { ok: false, error: "Use JPG, PNG, or WebP for banners" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Image must be under 8MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = getEventUploadDir();
    fs.mkdirSync(uploadDir, { recursive: true });

    const stamp = Date.now().toString(36);
    const safeBase = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "banner";
    const filename = `${safeBase}-${stamp}.webp`;
    const outPath = path.join(uploadDir, filename);

    await sharp(buffer)
      .rotate()
      .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    const url = `/images/events/uploads/${filename}`;
    return NextResponse.json({ ok: true, url, filename });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
