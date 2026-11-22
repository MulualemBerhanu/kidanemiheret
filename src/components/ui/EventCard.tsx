"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ChurchEvent } from "@/data/events";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: ChurchEvent;
  className?: string;
  compact?: boolean;
}

function formatDisplayDate(iso: string, locale: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    month: d.toLocaleString(locale === "am" ? "am-ET" : "en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
  };
}

export function EventCard({ event, className, compact }: EventCardProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const { month, day } = formatDisplayDate(event.startDate, locale);

  return (
    <TiltCard className={cn("h-full", className)}>
      <article
        className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-gold/12 bg-charcoal-light/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_22px_50px_rgba(0,0,0,0.45)]"
        itemScope
        itemType="https://schema.org/Event"
      >
        {event.flyerImage && !compact && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={event.flyerImage}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
          </div>
        )}
        <div className="flex flex-1 gap-4 p-5 md:p-6">
          <div className="flex shrink-0 flex-col items-center justify-center rounded-sm border border-gold/30 bg-charcoal px-3 py-2 text-center">
            <span className="text-[10px] tracking-widest text-gold">{month}</span>
            <span className="font-display text-2xl text-ivory">{day}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg text-ivory" itemProp="name">
              {event.title}
            </h3>
            <meta itemProp="startDate" content={event.dtStart} />
            {event.dtEnd && <meta itemProp="endDate" content={event.dtEnd} />}
            <p className={cn("mt-2 text-sm", compact ? "text-ivory/90" : "text-ivory/60")}>
              <span itemProp="startTime">{event.startTime}</span>
              {event.endTime && ` – ${event.endTime}`}
            </p>
            <p
              className={cn("mt-1 text-sm", compact ? "text-[#e9d5a7]" : "text-gold/80")}
              itemProp="location"
            >
              {event.location}
            </p>
            {event.description && !compact && (
              <p className="mt-3 line-clamp-2 text-sm text-ivory/50">
                {event.description}
              </p>
            )}
            <data itemProp="eventSchedule" value={event.dtStart} />
          </div>
        </div>
        <Link
          href="/events"
          className={cn(
            "border-t border-gold/15 px-6 py-3 text-xs uppercase tracking-widest transition-colors hover:text-[#e9d5a7]",
            compact ? "text-[#e9d5a7]" : "text-gold/70 hover:text-gold"
          )}
        >
          {t("details")}
        </Link>
      </article>
    </TiltCard>
  );
}
