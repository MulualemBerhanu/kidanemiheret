import { NextResponse } from "next/server";
import { formatFields, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (String(body.company ?? "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (key === "company") continue;
      if (typeof value === "string") fields[key] = value.trim();
      else if (value != null) fields[key] = String(value);
    }

    const fullName = fields.fullName ?? "";
    const phone = fields.phone ?? "";
    const email = fields.email ?? "";
    const signature = fields.signature ?? "";

    if (!fullName || !phone || !signature) {
      return NextResponse.json(
        { ok: false, error: "Full name, phone, and signature are required." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    const text = [
      "New membership registration",
      "",
      formatFields(fields),
    ].join("\n");

    await sendMail({
      subject: `[Membership] ${fullName}`,
      replyTo: email || undefined,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not submit registration";
    console.error("[api/register]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
