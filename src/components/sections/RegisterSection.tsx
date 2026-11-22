import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SacredBorder } from "@/components/ui/SacredBorder";
import { MembershipRegistrationForm } from "@/components/ui/MembershipRegistrationForm";
import { siteConfig } from "@/data/site";

const BENEFIT_KEYS = ["worship", "community", "sacraments", "service"] as const;
const PROCESS_KEYS = ["step1", "step2", "step3"] as const;

export async function RegisterSection() {
  const t = await getTranslations("membership");
  const { phone, email } = siteConfig;

  return (
    <section className="section-padding relative overflow-x-clip bg-ivory" id="register">
      <div
        className="pointer-events-none absolute -right-24 top-16 hidden h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.07),transparent_70%)] lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("sectionTitle")}
            description={t("sectionDescription")}
            theme="light"
          />
        </SectionReveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <SectionReveal className="lg:sticky lg:top-28 lg:self-start">
            <aside className="overflow-hidden rounded-[2px] border border-gold/20 bg-charcoal shadow-[0_32px_64px_rgba(8,8,8,0.2)]">
              <div className="border-b border-gold/15 bg-gradient-to-br from-charcoal-light to-charcoal px-6 py-8 md:px-7">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">
                  {t("sidebarEyebrow")}
                </p>
                <h2 className="mt-3 font-display text-2xl font-light leading-snug text-ivory md:text-[1.65rem]">
                  {t("sidebarTitle")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ivory/55">
                  {t("sidebarDescription")}
                </p>
              </div>

              <div className="space-y-6 px-6 py-8 md:px-7">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/65">
                    {t("benefitsTitle")}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {BENEFIT_KEYS.map((key, i) => (
                      <li
                        key={key}
                        className="flex gap-3 border-b border-ivory/5 pb-3 text-sm leading-relaxed text-ivory/75 last:border-0 last:pb-0"
                      >
                        <span className="font-display text-base text-gold/90">0{i + 1}</span>
                        <span>{t(`benefits.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gold/10 pt-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/65">
                    {t("processTitle")}
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {PROCESS_KEYS.map((key, i) => (
                      <li key={key} className="flex gap-3 text-sm text-ivory/70">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/35 text-[10px] text-gold">
                          {i + 1}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{t(`process.${key}`)}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-[2px] border border-gold/15 bg-ivory/[0.04] p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold/60">
                    {t("needHelp")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/55">{t("needHelpNote")}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <a href={`tel:${phone}`} className="block text-gold/90 transition hover:text-gold">
                      {phone}
                    </a>
                    <a
                      href={`mailto:${email}`}
                      className="block text-gold/90 transition hover:text-gold"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-px rounded-[3px] bg-gradient-to-br from-gold/25 via-transparent to-gold/10 opacity-60"
                aria-hidden
              />
              <div className="relative rounded-[2px] border border-gold/20 bg-gradient-to-b from-cream via-ivory to-cream p-6 shadow-[0_24px_56px_rgba(24,18,10,0.08)] md:p-9 lg:p-10">
                <SacredBorder className="mb-8" theme="light" size={48} />
                <MembershipRegistrationForm />
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
