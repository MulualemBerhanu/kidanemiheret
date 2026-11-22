import { NextResponse } from "next/server";
import type { LocalizedText, StoredEvent } from "@/data/events";
import { assertAdminApiSession } from "@/lib/admin-auth";
import {
  buildDt,
  deleteStoredEvent,
  getStoredEvent,
  upsertStoredEvent,
} from "@/lib/events-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

function asLocalized(value: unknown, previous?: LocalizedText): LocalizedText {
  if (value && typeof value === "object") {
    const v = value as { en?: string; am?: string };
    return {
      en: (v.en ?? previous?.en ?? "").trim(),
      am: (v.am ?? previous?.am ?? "").trim(),
    };
  }
  if (typeof value === "string") {
    return { en: value.trim(), am: previous?.am ?? "" };
  }
  return previous ?? { en: "", am: "" };
}

export async function GET(request: Request, { params }: RouteProps) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  const { id } = await params;
  const event = getStoredEvent(id);
  if (!event) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, event });
}

export async function PUT(request: Request, { params }: RouteProps) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  const { id } = await params;
  const existing = getStoredEvent(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asLocalized(body.title, existing.title);
    if (!title.en) {
      return NextResponse.json({ ok: false, error: "English title is required" }, { status: 400 });
    }

    const startDate = String(body.startDate ?? existing.startDate).trim();
    const startTime = String(body.startTime ?? existing.startTime).trim();
    const endDateRaw = body.endDate !== undefined ? String(body.endDate ?? "").trim() : existing.endDate;
    const endTimeRaw = body.endTime !== undefined ? String(body.endTime ?? "").trim() : existing.endTime;
    const endDate = endDateRaw || undefined;
    const endTime = endTimeRaw || undefined;

    const event: StoredEvent = {
      ...existing,
      title,
      description: asLocalized(body.description, existing.description),
      location: asLocalized(body.location, existing.location),
      startDate,
      endDate,
      startTime,
      endTime,
      dtStart: buildDt(startDate, startTime),
      dtEnd: endDate || endTime ? buildDt(endDate || startDate, endTime || startTime) : undefined,
      timezone: String(body.timezone ?? existing.timezone).trim(),
      categories: Array.isArray(body.categories)
        ? body.categories.map(String).map((c) => c.trim()).filter(Boolean)
        : existing.categories,
      flyerImage:
        body.flyerImage === null
          ? undefined
          : typeof body.flyerImage === "string"
            ? body.flyerImage
            : existing.flyerImage,
      published: body.published === undefined ? existing.published : Boolean(body.published),
      updatedAt: new Date().toISOString(),
    };

    upsertStoredEvent(event);
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update event";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  const { id } = await params;
  const ok = deleteStoredEvent(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
