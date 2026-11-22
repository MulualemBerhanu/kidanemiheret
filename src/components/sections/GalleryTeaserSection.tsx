import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryPreviewShowcase } from "@/components/sections/GalleryPreviewShowcase";
import { SacredBorder } from "@/components/ui/SacredBorder";
import { getPublishedGalleryImages } from "@/lib/gallery-store";

const PREVIEW_COUNT = 8;

export async function GalleryTeaserSection() {
  const t = await getTranslations("gallery");
  const tCommon = await getTranslations("common");
  const galleryImages = getPublishedGalleryImages();
  const preview = galleryImages.slice(0, PREVIEW_COUNT);

  return (
    <section className="section-padding relative overflow-hidden bg-charcoal" id="gallery">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/3 font-amharic text-[clamp(5rem,14vw,11rem)] leading-none text-ivory/[0.025] select-none"
        lang="am"
        aria-hidden
      >
        ምስሎች
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <div className="text-center">
            <SacredBorder className="mb-8" theme="dark" size={48} />
            <SectionHeading
              eyebrow={t("eyebrow")}
              geEz={t("geEz")}
              title={t("title")}
              description={t("description")}
              theme="dark"
            />
          </div>
        </SectionReveal>

        <div className="mt-14">
          <GalleryPreviewShowcase images={preview} />
        </div>

        <SectionReveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-gold/10 pt-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/35">
              {t("photoCount", { count: galleryImages.length })}
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-[2px] border border-gold/30 bg-ivory/[0.04] px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] text-gold/85 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {tCommon("viewFullGallery")}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
