import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BylawsDocumentPreview } from "@/components/sections/BylawsDocumentPreview";
import { brandImages } from "@/data/images";
import { bylawsPresentUrls, churchDocuments } from "@/data/documents";

interface BylawsSectionProps {
  locale: string;
}

export async function BylawsSection({ locale }: BylawsSectionProps) {
  const t = await getTranslations("about.bylaws");
  const isAmharic = locale === "am";

  const primary = isAmharic
    ? {
        label: t("amharicTitle"),
        pdf: churchDocuments.bylawsAmharic,
        present: bylawsPresentUrls.amharic,
      }
    : {
        label: t("englishTitle"),
        pdf: churchDocuments.bylawsEnglish,
        present: bylawsPresentUrls.english,
      };

  const secondary = isAmharic
    ? {
        label: t("englishTitle"),
        pdf: churchDocuments.bylawsEnglish,
        present: bylawsPresentUrls.english,
      }
    : {
        label: t("amharicTitle"),
        pdf: churchDocuments.bylawsAmharic,
        present: bylawsPresentUrls.amharic,
      };

  const previewLabels = {
    openLabel: t("preview"),
    closeLabel: t("closePreview"),
    prevLabel: t("prevPage"),
    nextLabel: t("nextPage"),
    zoomInLabel: t("zoomIn"),
    zoomOutLabel: t("zoomOut"),
  };

  return (
    <section id="bylaws" className="section-padding relative overflow-hidden bg-cream scroll-mt-24">
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[24rem] w-[24rem] translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(182,138,62,0.1),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("title")}
            description={t("description")}
            theme="light"
          />
        </SectionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <SectionReveal>
            <article className="group relative h-full overflow-hidden rounded-[2px] border border-gold/30 bg-gradient-to-br from-ivory via-[#faf6ee] to-cream p-7 shadow-[0_18px_44px_rgba(16,13,11,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_56px_rgba(182,138,62,0.12)] md:p-9">
              <div className="flex items-start justify-between gap-4">
                <Image
                  src={brandImages.cross}
                  alt=""
                  width={22}
                  height={31}
                  className="h-8 w-auto opacity-70 transition-opacity group-hover:opacity-90"
                />
                <span className="rounded-[2px] border border-gold/35 bg-gold/10 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-bronze">
                  {t("primaryBadge")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl text-charcoal">{primary.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{t("primaryNote")}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-charcoal/40">PDF</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={primary.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[2px] border border-gold/40 bg-white/60 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-charcoal/80 transition hover:border-gold hover:bg-gold/10 hover:text-bronze"
                >
                  {t("downloadPdf")}
                </a>
                <BylawsDocumentPreview
                  pdfUrl={primary.pdf}
                  title={primary.label}
                  variant="primary"
                  {...previewLabels}
                />
                <a
                  href={primary.present}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[2px] bg-gradient-to-r from-[#8b6914] via-gold to-amber px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal shadow-[0_2px_20px_rgba(212,175,55,0.25)] transition hover:brightness-110"
                >
                  {t("present")}
                </a>
              </div>
            </article>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <article className="group relative h-full overflow-hidden rounded-[2px] border border-gold/20 bg-white/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_40px_rgba(16,13,11,0.06)] md:p-9">
              <p className="text-[10px] uppercase tracking-[0.28em] text-bronze/80">
                {t("secondaryBadge")}
              </p>
              <h3 className="mt-4 font-display text-xl text-charcoal md:text-2xl">{secondary.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{t("secondaryNote")}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-charcoal/40">PDF</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={secondary.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[2px] border border-gold/30 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-charcoal/70 transition hover:border-gold/50 hover:text-bronze"
                >
                  {t("downloadPdf")}
                </a>
                <BylawsDocumentPreview
                  pdfUrl={secondary.pdf}
                  title={secondary.label}
                  variant="secondary"
                  {...previewLabels}
                />
                <a
                  href={secondary.present}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[2px] border border-gold/30 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-charcoal/70 transition hover:border-gold/50 hover:text-bronze"
                >
                  {t("present")}
                </a>
              </div>
            </article>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
