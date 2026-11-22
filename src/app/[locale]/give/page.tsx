import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { GiveCard } from "@/components/ui/GiveCard";
import { pageHeroImages, editorialImages } from "@/data/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.give" });
  return { title: t("title"), description: t("description") };
}

export default async function GivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("give");

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.give}
      />
      <section className="relative bg-charcoal py-16 md:py-24 overflow-hidden">
        <Image
          src={editorialImages.give}
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="relative mx-auto max-w-3xl px-5 md:px-8">
          <SectionReveal>
            <GiveCard />
          </SectionReveal>
          <SectionReveal delay={0.2} className="mt-12 text-center text-sm text-ivory/50">
            <p>{t("integrationNote")}</p>
            <p className="mt-4">{t("mailNote")}</p>
          </SectionReveal>
        </div>
      </section>
    </PageShell>
  );
}
