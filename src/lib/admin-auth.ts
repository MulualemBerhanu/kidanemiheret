import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "km_admin_session";
const SESSION_DAYS = 7;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    ""
  );
}

/** In development, allow a default password when unset so local work is possible. */
export function resolveAdminPassword() {
  const configured = getAdminPassword();
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "admin";
  return "";
}

function resolveSessionSecret() {
  const configured = getSessionSecret();
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "dev-admin-session";
  return "";
}

function sign(payload: string) {
  const secret = resolveSessionSecret();
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(8).toString("base64url");
  const payload = `${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expStr, nonce, signature] = parts;
  if (!expStr || !nonce || !signature) return false;

  const payload = `${expStr}.${nonce}`;
  const expected = sign(payload);

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export function verifyAdminPassword(password: string) {
  const expected = resolveAdminPassword();
  if (!expected) return false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function adminSessionCookieOptions(token: string) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export function assertAdminApiSession(request: Request): NextResponse | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  const token = match?.slice(ADMIN_SESSION_COOKIE.length + 1);

  if (verifyAdminSessionToken(token)) return null;

  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
