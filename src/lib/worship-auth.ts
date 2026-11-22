import { NextResponse } from "next/server";

/**
 * Protect worship write endpoints with WORSHIP_ADMIN_SECRET.
 * In production the secret is required. In development, open if unset.
 */
export function assertWorshipAdmin(request: Request): NextResponse | null {
  const secret = process.env.WORSHIP_ADMIN_SECRET?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!secret) {
    if (isProd) {
      return NextResponse.json(
        { ok: false, error: "Worship admin is not configured" },
        { status: 503 }
      );
    }
    return null;
  }

  const header = request.headers.get("x-worship-admin-secret");
  const auth = request.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : null;

  if (header === secret || bearer === secret) {
    return null;
  }

  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
