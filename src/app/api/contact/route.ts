import { NextResponse } from "next/server";
import { formatFields, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot — bots fill this; humans never see it
    if (String(body.company ?? "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "General Inquiry").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    const text = formatFields({
      Name: name,
      Email: email,
      Subject: subject,
      Message: message,
    });

    await sendMail({
      subject: `[Contact] ${subject} — ${name}`,
      replyTo: email,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not send message";
    console.error("[api/contact]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
