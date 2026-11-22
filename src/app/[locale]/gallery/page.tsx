import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { GalleryPageClient } from "@/components/sections/GalleryPageClient";
import { getPublishedGalleryImages } from "@/lib/gallery-store";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.gallery" });
  return { title: t("title"), description: t("description") };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const tSite = await getTranslations("site");

  const images = getPublishedGalleryImages();

  return (
    <PageShell>
      <GalleryPageClient
        images={images}
        pageTitle={t("pageTitle")}
        pageSubtitle={t("pageSubtitle")}
        siteName={tSite("shortName")}
        sectionEyebrow={t("eyebrow")}
        geEz={t("geEz")}
        sectionTitle={t("title")}
        sectionDescription={t("fullDescription")}
      />
    </PageShell>
  );
}
