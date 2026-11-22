import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { SectionTransition, SectionFeather } from "@/components/layout/SectionTransition";
import { AboutIntroSection } from "@/components/sections/AboutIntroSection";
import { AboutDetailsSection } from "@/components/sections/AboutDetailsSection";
import { GovernanceBodiesSection } from "@/components/sections/GovernanceBodiesSection";
import { BoardMembersSection } from "@/components/sections/BoardMembersSection";
import { BylawsSection } from "@/components/sections/BylawsSection";
import { CinematicSequenceStrip } from "@/components/sequence/CinematicSequenceStrip";
import { pageHeroImages } from "@/data/images";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.about}
        imageFit="contain"
        variant="cinematic"
      />

      <AboutIntroSection />

      <SectionTransition from="ivory" to="charcoal" />
      <AboutDetailsSection />

      <SectionTransition from="charcoal" to="ivory" />
      <GovernanceBodiesSection />

      <SectionTransition from="ivory" to="charcoal" />
      <BoardMembersSection locale={locale} />

      <SectionTransition from="charcoal" to="cream" />
      <BylawsSection locale={locale} />

      <SectionFeather tone="cream" />
      <CinematicSequenceStrip preset="heritage" />
    </PageShell>
  );
}
