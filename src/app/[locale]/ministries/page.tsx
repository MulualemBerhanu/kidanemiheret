import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { MinistryCard } from "@/components/ui/MinistryCard";
import { SectionTransition } from "@/components/layout/SectionTransition";
import { getLocalizedMinistries } from "@/lib/i18n-content";
import { pageHeroImages } from "@/data/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.ministries" });
  return { title: t("title"), description: t("description") };
}

export default async function MinistriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ministries");
  const ministries = await getLocalizedMinistries();

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.ministries}
        imageFit="contain"
      />
      <SectionTransition from="charcoal" to="cream" />
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => (
            <div key={m.id} id={m.id}>
              <SectionReveal delay={i * 0.05}>
                <MinistryCard ministry={m} theme="light" />
              </SectionReveal>
            </div>
          ))}
        </div>
      </section>
      <SectionTransition from="cream" to="charcoal" />
    </PageShell>
  );
}
