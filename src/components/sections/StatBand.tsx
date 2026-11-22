import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";

const STAT_KEYS = ["established", "status", "worship", "location"] as const;

export async function StatBand() {
  const t = await getTranslations("stats");

  return (
    <section className="relative overflow-hidden bg-charcoal py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STAT_KEYS.map((key, i) => (
            <SectionReveal key={key} delay={i * 0.08}>
              <div className="text-center">
                <p className="font-display text-3xl text-gradient-gold md:text-4xl">
                  {t(`${key}.value`)}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-ivory/55">
                  {t(`${key}.label`)}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
