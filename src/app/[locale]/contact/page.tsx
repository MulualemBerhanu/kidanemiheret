import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionTransition } from "@/components/layout/SectionTransition";
import { pageHeroImages } from "@/data/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.contact}
        imageFit="contain"
      />
      <SectionTransition from="charcoal" to="ivory" />
      <ContactSection />
      <SectionTransition from="ivory" to="charcoal" />
    </PageShell>
  );
}
