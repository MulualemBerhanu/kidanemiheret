"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Ministry } from "@/data/ministries";
import { MinistryIcon } from "@/components/ui/MinistryIcon";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MinistryCardProps {
  ministry: Ministry;
  theme?: "dark" | "light";
}

export function MinistryCard({ ministry, theme = "light" }: MinistryCardProps) {
  const t = useTranslations("common");
  const dark = theme === "dark";

  return (
    <Link
      href={ministry.href}
      className={cn(
        "group block h-full overflow-hidden rounded-[2px] border transition-all duration-300 hover:-translate-y-1",
        dark
          ? "border-gold/15 bg-charcoal-light/60 hover:border-gold/40 hover:shadow-[0_22px_50px_rgba(0,0,0,0.45)]"
          : "border-gold/20 bg-cream hover:border-gold/45 hover:shadow-[0_22px_50px_rgba(182,138,62,0.16)]"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={ministry.image}
          alt={ministry.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent transition-opacity duration-300 group-hover:from-charcoal/90" />
        <span
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-[2px] border border-gold/35 bg-charcoal/45 text-gold backdrop-blur-sm"
          aria-hidden
        >
          <MinistryIcon name={ministry.icon} className="h-4 w-4" />
        </span>
      </div>
      <div className="p-6 md:p-7">
        <h3
          className={cn(
            "font-display text-xl transition-transform duration-300 group-hover:translate-x-0.5",
            dark ? "text-ivory" : "text-charcoal"
          )}
        >
          {ministry.title}
        </h3>
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed",
            dark ? "text-ivory/60" : "text-charcoal/65"
          )}
        >
          {ministry.description}
        </p>
        <span
          className={cn(
            "mt-5 inline-block text-[10px] uppercase tracking-widest transition-colors",
            dark ? "text-gold/70 group-hover:text-gold" : "text-bronze group-hover:text-gold"
          )}
        >
          {t("learnMore")} →
        </span>
      </div>
    </Link>
  );
}
