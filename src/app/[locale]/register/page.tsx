import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { RegisterSection } from "@/components/sections/RegisterSection";
import { SectionTransition } from "@/components/layout/SectionTransition";
import { pageHeroImages } from "@/data/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.register" });
  return { title: t("title"), description: t("description") };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("membership");

  return (
    <PageShell>
      <PageHero
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        backgroundSrc={pageHeroImages.register}
        backgroundPosition="center"
      />
      <SectionTransition from="charcoal" to="ivory" />
      <RegisterSection />
      <SectionTransition from="ivory" to="charcoal" />
    </PageShell>
  );
}
