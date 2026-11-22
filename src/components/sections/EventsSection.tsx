import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocalizedEvents } from "@/lib/i18n-content";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/ui/EventCard";

interface EventsSectionProps {
  limit?: number;
}

export async function EventsSection({ limit = 4 }: EventsSectionProps) {
  const t = await getTranslations("events");
  const tCommon = await getTranslations("common");
  const events = await getLocalizedEvents();
  const items = events.slice(0, limit);

  return (
    <section className="section-padding bg-charcoal" id="events">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("title")}
            description={t("description")}
            theme="dark"
          />
        </SectionReveal>
        <div className={`mt-14 grid gap-6 ${limit <= 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-2"}`}>
          {items.map((e, i) => (
            <SectionReveal key={e.id} delay={i * 0.08}>
              <EventCard event={e} />
            </SectionReveal>
          ))}
        </div>
        <p className="mt-12 text-center">
          <Link
            href="/events"
            className="text-xs uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
          >
            {tCommon("fullCalendar")}
          </Link>
        </p>
      </div>
    </section>
  );
}
