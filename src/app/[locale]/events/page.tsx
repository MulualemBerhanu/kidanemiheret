import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { EventCard } from "@/components/ui/EventCard";
import { getLocalizedEvents } from "@/lib/i18n-content";
import { pageHeroImages } from "@/data/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.events" });
  return { title: t("title"), description: t("description") };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const events = await getLocalizedEvents();

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.events}
        imageFit="contain"
      />
      <section className="bg-charcoal py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-8 md:grid-cols-2">
          {events.map((e, i) => (
            <SectionReveal key={e.id} delay={i * 0.06}>
              <EventCard event={e} />
            </SectionReveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
