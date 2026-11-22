import "server-only";
import nodemailer from "nodemailer";
import { siteConfig } from "@/data/site";

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
};

function getToEmail() {
  return process.env.CONTACT_TO_EMAIL?.trim() || siteConfig.email;
}

function getFromEmail() {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `Kidane Miheret <noreply@${siteConfig.email.split("@")[1] || "kidanportland.com"}>`
  );
}

async function sendViaResend(payload: MailPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromEmail(),
      to: [getToEmail()],
      reply_to: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string; id?: string };
  if (!res.ok) {
    throw new Error(data.message || `Resend error (${res.status})`);
  }
  return { provider: "resend" as const, id: data.id };
}

async function sendViaSmtp(payload: MailPayload) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: getToEmail(),
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return { provider: "smtp" as const, id: info.messageId };
}

/**
 * Sends mail via Resend (preferred) or SMTP.
 * In development with no provider configured, logs the message and succeeds
 * so forms can be tested locally.
 */
export async function sendMail(payload: MailPayload) {
  const viaResend = await sendViaResend(payload);
  if (viaResend) return viaResend;

  const viaSmtp = await sendViaSmtp(payload);
  if (viaSmtp) return viaSmtp;

  if (process.env.NODE_ENV !== "production") {
    console.info("[mail:dev-fallback]", {
      to: getToEmail(),
      subject: payload.subject,
      replyTo: payload.replyTo,
      text: payload.text,
    });
    return { provider: "dev-log" as const, id: `dev-${Date.now()}` };
  }

  throw new Error(
    "Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS."
  );
}

export function formatFields(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}
