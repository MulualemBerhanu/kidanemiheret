import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Primary governing bodies first (bylaws), then supporting structures. */
const PRIMARY_KEYS = ["assembly", "council", "rector"] as const;
const SUPPORT_KEYS = ["audit", "clergy", "services"] as const;

export async function GovernanceBodiesSection() {
  const t = await getTranslations("governance");

  return (
    <section className="section-padding relative overflow-x-clip bg-ivory" id="governance">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(182,138,62,0.06),transparent_50%)]"
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

        {/* Primary bodies — documented leadership structure */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PRIMARY_KEYS.map((key, i) => (
            <SectionReveal key={key} delay={i * 0.06}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[2px] border border-gold/25 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_22px_50px_rgba(182,138,62,0.12)] md:p-7">
                <div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent opacity-60"
                  aria-hidden
                />
                <span className="font-display text-3xl text-gold/35 transition-colors group-hover:text-gold/55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl text-charcoal md:text-[1.35rem]">
                  {t(`bodies.${key}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">
                  {t(`bodies.${key}.description`)}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>

        {/* Documented connector between primary row and supporting bodies */}
        <div className="mx-auto my-8 hidden h-8 w-px bg-gradient-to-b from-gold/40 to-gold/15 md:block" aria-hidden />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-0 mt-8">
          {SUPPORT_KEYS.map((key, i) => (
            <SectionReveal key={key} delay={0.08 + i * 0.05}>
              <article className="group h-full rounded-[2px] border border-gold/18 bg-cream/80 p-5 transition-all duration-300 hover:border-gold/40 hover:bg-cream md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display text-2xl text-gold/30">
                    {String(i + 4).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg text-charcoal">
                  {t(`bodies.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                  {t(`bodies.${key}.description`)}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-charcoal/50">
            {t("note")}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
