import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SacredBorder } from "@/components/ui/SacredBorder";
import { brandImages } from "@/data/images";

const OBJECTIVE_KEYS = ["1", "2", "3", "4", "5"] as const;
const LEGAL_KEYS = ["nonprofit", "taxExempt", "bylawsDate", "affiliation", "location"] as const;

export async function AboutDetailsSection() {
  const t = await getTranslations("about");

  return (
    <section className="section-padding relative overflow-x-clip bg-charcoal" id="mission">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(182,138,62,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 xl:gap-20">
          <SectionReveal>
            <SectionHeading
              eyebrow={t("mission.eyebrow")}
              geEz={t("mission.geEz")}
              title={t("mission.title")}
              description={t("mission.description")}
              align="left"
              theme="dark"
              className="!mx-0 !text-left"
            />

            <ol className="relative mt-10 space-y-0">
              <span
                className="pointer-events-none absolute bottom-4 left-[1.15rem] top-4 w-px bg-gradient-to-b from-gold/50 via-gold/25 to-gold/10 md:left-[1.35rem]"
                aria-hidden
              />
              {OBJECTIVE_KEYS.map((key, i) => (
                <li key={key} className="relative flex gap-4 py-3 md:gap-5">
                  <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-charcoal text-[11px] font-medium tracking-wider text-gold md:h-11 md:w-11 md:text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="group flex-1 rounded-[2px] border border-gold/15 bg-ivory/[0.04] p-5 transition-all duration-300 hover:border-gold/40 hover:bg-ivory/[0.07] md:p-6">
                    <p className="text-sm leading-relaxed text-ivory/80 md:text-base">
                      {t(`mission.objectives.${key}`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:self-start">
            <div className="relative overflow-hidden rounded-[2px] border border-gold/30 bg-gradient-to-br from-cream via-ivory to-[#f3eee4] p-7 shadow-[0_28px_56px_rgba(0,0,0,0.35)] md:p-8">
              <SacredBorder className="mb-6" theme="light" size={44} />
              <p className="text-[10px] uppercase tracking-[0.35em] text-bronze">
                {t("legal.eyebrow")}
              </p>
              <h3 className="mt-3 font-display text-2xl font-light text-charcoal md:text-[1.65rem]">
                {t("legal.title")}
              </h3>
              <ul className="mt-6 space-y-0">
                {LEGAL_KEYS.map((key, i) => (
                  <li
                    key={key}
                    className="flex gap-4 border-b border-gold/15 py-5 text-sm leading-relaxed text-charcoal/80 last:border-0"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/35 text-[10px] text-bronze">
                      {i + 1}
                    </span>
                    <span>{t(`legal.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center gap-3 border-t border-gold/15 pt-5">
                <Image
                  src={brandImages.cross}
                  alt=""
                  width={18}
                  height={26}
                  className="h-6 w-auto opacity-70"
                />
                <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50">
                  {t("legal.footer")}
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
