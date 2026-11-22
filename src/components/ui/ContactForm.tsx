"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const t = useTranslations("contactForm");
  const tButtons = useTranslations("buttons");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not send message");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send message");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-gold/30 bg-cream p-6">
        <p className="text-charcoal">{t("thankYou")}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
          className="mt-5 inline-flex items-center justify-center rounded-[2px] border border-gold/40 bg-ivory/80 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-charcoal transition hover:border-gold hover:bg-gold/10"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-charcoal/60">{t("name")}</span>
          <input
            required
            name="name"
            type="text"
            className="mt-2 w-full border-b border-gold/30 bg-transparent py-2 text-charcoal outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-charcoal/60">{t("email")}</span>
          <input
            required
            name="email"
            type="email"
            className="mt-2 w-full border-b border-gold/30 bg-transparent py-2 text-charcoal outline-none focus:border-gold"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-charcoal/60">{t("subject")}</span>
        <select
          name="subject"
          className="mt-2 w-full border-b border-gold/30 bg-transparent py-2 text-charcoal outline-none focus:border-gold"
        >
          <option>{t("subjects.general")}</option>
          <option>{t("subjects.prayer")}</option>
          <option>{t("subjects.visit")}</option>
          <option>{t("subjects.ministry")}</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-charcoal/60">{t("message")}</span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full resize-none border-b border-gold/30 bg-transparent py-2 text-charcoal outline-none focus:border-gold"
        />
      </label>

      {error && (
        <p className="rounded-sm border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" variant="gold" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : tButtons("sendMessage")}
      </Button>
    </form>
  );
}
