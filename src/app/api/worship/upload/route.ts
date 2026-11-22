import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { assertWorshipAdmin } from "@/lib/worship-auth";
import { convertWorshipPdf, getUploadsDir, isSupportedUpload } from "@/lib/worship-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Upload a PDF, PPT, or PPTX and convert it to worship slides immediately. */
export async function POST(request: Request) {
  const denied = assertWorshipAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (!isSupportedUpload(file.name)) {
      return NextResponse.json(
        { ok: false, error: "Supported formats: PDF, PPT, PPTX" },
        { status: 400 }
      );
    }

    const uploadsDir = getUploadsDir();
    fs.mkdirSync(uploadsDir, { recursive: true });

    const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9._\- ()]/g, "_");
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadsDir, safeName), buffer);

    const data = await convertWorshipPdf(`uploads/${safeName}`);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
