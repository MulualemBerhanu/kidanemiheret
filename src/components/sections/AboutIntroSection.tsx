import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { Button } from "@/components/ui/Button";
import { editorialImages, brandImages } from "@/data/images";

const CHAPTER_KEYS = ["believe", "belong", "become"] as const;

export async function AboutIntroSection() {
  const t = await getTranslations("about");
  const tChapters = await getTranslations("chapters");
  const tButtons = await getTranslations("buttons");

  return (
    <section className="section-padding relative overflow-x-clip bg-ivory" id="about-intro">
      <div
        className="pointer-events-none absolute -left-20 top-12 hidden font-amharic text-[clamp(5rem,14vw,11rem)] leading-none text-gold/[0.06] select-none lg:block"
        lang="am"
        aria-hidden
      >
        {t("intro.geEz")}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(182,138,62,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <SectionReveal>
            <p className="mb-5 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-bronze">
              <span className="h-px w-8 bg-gold/55" aria-hidden />
              {t("intro.eyebrow")}
            </p>

            <p
              className="font-amharic text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-charcoal"
              lang="am"
            >
              {t("intro.geEz")}
            </p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-charcoal/75 md:text-lg">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <blockquote className="relative mt-8 border-l-2 border-gold/70 pl-5 md:mt-10 md:pl-6">
              <p className="font-display text-xl leading-snug text-charcoal/90 md:text-[1.65rem]">
                &ldquo;{t("intro.quote")}&rdquo;
              </p>
            </blockquote>

            <ul
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              aria-label={t("intro.pillarsLabel")}
            >
              {CHAPTER_KEYS.map((key) => (
                <li key={key}>
                  <span className="inline-flex items-center gap-2.5 rounded-[2px] border border-gold/25 bg-white/70 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-bronze shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <span className="font-display text-sm text-gold">
                      {tChapters(`${key}.number`)}
                    </span>
                    <span className="font-amharic normal-case tracking-normal" lang="am">
                      {tChapters(`${key}.geEz`)}
                    </span>
                    <span className="text-charcoal/35">·</span>
                    {tChapters(`${key}.title`)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact" variant="gold">
                {tButtons("planYourVisit")}
              </Button>
              <Button href="/register" variant="ivory">
                {t("intro.joinCta")}
              </Button>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <div className="relative lg:pl-4">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[3px] bg-[radial-gradient(ellipse_at_center,rgba(182,138,62,0.2),transparent_68%)]"
                aria-hidden
              />
              <div className="relative rounded-[3px] bg-gradient-to-br from-[#f3ece0] via-ivory to-cream p-3 shadow-[0_32px_64px_rgba(16,13,11,0.14)] ring-1 ring-gold/30 md:p-4">
                <div className="border border-gold/35 bg-charcoal/[0.02] p-1.5">
                  <div className="relative aspect-[2/1] overflow-hidden rounded-[1px] bg-[#1a1510]">
                    <Image
                      src={editorialImages.aboutPortrait}
                      alt={t("imageAlt")}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-gold/15 pt-4">
                  <Image
                    src={brandImages.cross}
                    alt=""
                    width={24}
                    height={34}
                    className="h-8 w-auto shrink-0 opacity-75"
                  />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-bronze/85">
                    {t("intro.imageCaption")}
                  </p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
