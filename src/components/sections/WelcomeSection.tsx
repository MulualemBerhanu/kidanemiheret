import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WelcomeImageShowcase } from "@/components/sections/WelcomeImageShowcase";
import { editorialImages } from "@/data/images";

const HIGHLIGHT_KEYS = ["heritage", "worship", "community"] as const;

export async function WelcomeSection() {
  const t = await getTranslations("welcome");
  const tCommon = await getTranslations("common");
  const tButtons = await getTranslations("buttons");

  return (
    <section className="section-padding relative overflow-x-clip bg-ivory" id="welcome">
      <div
        className="pointer-events-none absolute -right-16 top-1/4 hidden font-amharic text-[clamp(5rem,14vw,11rem)] leading-none text-gold/[0.06] select-none lg:block"
        lang="am"
        aria-hidden
      >
        {t("geEz")}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(182,138,62,0.06),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <SectionReveal className="order-2 lg:order-1">
            <p className="mb-5 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-bronze">
              <span className="h-px w-8 bg-gold/55" aria-hidden />
              {t("eyebrow")}
            </p>

            <SectionHeading
              geEz={t("geEz")}
              title={t("title")}
              description={t("description")}
              align="left"
              theme="light"
              className="!mx-0 !text-left [&_p:first-child]:hidden"
            />

            <blockquote className="relative mt-8 border-l-2 border-gold/70 pl-5 md:mt-10 md:pl-6">
              <p className="font-display text-xl leading-snug text-charcoal/90 md:text-[1.65rem]">
                &ldquo;{t("imageQuote")}&rdquo;
              </p>
            </blockquote>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" aria-label={t("highlightsLabel")}>
              {HIGHLIGHT_KEYS.map((key, i) => (
                <li key={key}>
                  <span className="inline-flex items-center gap-2.5 rounded-[2px] border border-gold/25 bg-white/70 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-bronze shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <span className="font-display text-sm text-gold">0{i + 1}</span>
                    {t(`highlights.${key}`)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/about" variant="gold">
                {tCommon("ourStory")}
              </Button>
              <Button href="/contact" variant="ivory">
                {tButtons("planYourVisit")}
              </Button>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="order-1 lg:order-2">
            <WelcomeImageShowcase
              src={editorialImages.welcome}
              alt={t("imageAlt")}
              caption={t("imageCaption")}
            />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
