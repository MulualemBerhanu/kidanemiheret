import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { loadWorshipManifest } from "@/lib/worship-manifest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ sourceId: string }>;
}

/** Stream an uploaded PDF by manifest source id (avoids broken URLs with spaces). */
export async function GET(_request: Request, { params }: RouteParams) {
  const { sourceId } = await params;
  const manifest = loadWorshipManifest();
  const source = manifest.sources?.find((s) => s.id === sourceId);

  if (!source?.originalFile) {
    return NextResponse.json({ ok: false, error: "Source not found" }, { status: 404 });
  }

  const relative = source.originalFile.replace(/^uploads\//, "");
  const filePath = path.join(process.cwd(), "public/worship-slides/uploads", relative);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false, error: "PDF file missing on disk" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buffer.length),
      "Content-Disposition": `inline; filename="${filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
