import { NextResponse } from "next/server";
import type { LocalizedText, StoredEvent } from "@/data/events";
import { assertAdminApiSession } from "@/lib/admin-auth";
import {
  buildDt,
  createEventId,
  listStoredEvents,
  upsertStoredEvent,
} from "@/lib/events-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asLocalized(value: unknown, fallback = ""): LocalizedText {
  if (value && typeof value === "object") {
    const v = value as { en?: string; am?: string };
    return { en: (v.en ?? "").trim(), am: (v.am ?? "").trim() };
  }
  if (typeof value === "string") {
    return { en: value.trim(), am: fallback };
  }
  return { en: fallback, am: "" };
}

export async function GET(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;
  return NextResponse.json({ ok: true, events: listStoredEvents() });
}

export async function POST(request: Request) {
  const denied = assertAdminApiSession(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = asLocalized(body.title);
    if (!title.en) {
      return NextResponse.json({ ok: false, error: "English title is required" }, { status: 400 });
    }

    const startDate = String(body.startDate ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return NextResponse.json({ ok: false, error: "Start date is required (YYYY-MM-DD)" }, { status: 400 });
    }

    const startTime = String(body.startTime ?? "").trim() || "12:00 PM";
    const endDate = String(body.endDate ?? "").trim() || undefined;
    const endTime = String(body.endTime ?? "").trim() || undefined;
    const timezone = String(body.timezone ?? "America/Los_Angeles").trim();
    const categories = Array.isArray(body.categories)
      ? body.categories.map(String).map((c) => c.trim()).filter(Boolean)
      : [];

    const now = new Date().toISOString();
    const event: StoredEvent = {
      id: createEventId(title.en, startDate),
      title,
      description: asLocalized(body.description),
      location: asLocalized(body.location),
      startDate,
      endDate,
      startTime,
      endTime,
      dtStart: buildDt(startDate, startTime),
      dtEnd: endDate || endTime ? buildDt(endDate || startDate, endTime || startTime) : undefined,
      timezone,
      categories,
      flyerImage: typeof body.flyerImage === "string" ? body.flyerImage : undefined,
      published: body.published !== false,
      updatedAt: now,
    };

    upsertStoredEvent(event);
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create event";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
