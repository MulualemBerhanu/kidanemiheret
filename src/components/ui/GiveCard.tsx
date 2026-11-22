"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { SacredBorder } from "@/components/ui/SacredBorder";

export function GiveCard() {
  const t = useTranslations("give");
  const tButtons = useTranslations("buttons");

  return (
    <div className="relative overflow-hidden rounded-sm border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal-light/40 to-maroon/20 p-8 md:p-12 backdrop-blur-xl shadow-[0_8px_48px_rgba(201,162,39,0.15)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(232,168,56,0.2), transparent 50%)",
        }}
        aria-hidden
      />
      <SacredBorder theme="dark" className="mb-8" />
      <h3 className="font-display text-2xl md:text-3xl text-ivory text-center">
        {t("cardTitle")}
      </h3>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-ivory/70 leading-relaxed">
        {t("cardDescription")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/give" variant="gold">
          {tButtons("giveOnline")}
        </Button>
        <Button href="/contact" variant="outline">
          {tButtons("otherWaysToGive")}
        </Button>
      </div>
    </div>
  );
}
