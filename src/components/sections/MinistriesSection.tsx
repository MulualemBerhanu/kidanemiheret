import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLocalizedMinistries } from "@/lib/i18n-content";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MinistryCard } from "@/components/ui/MinistryCard";

interface MinistriesSectionProps {
  limit?: number;
}

export async function MinistriesSection({ limit }: MinistriesSectionProps) {
  const t = await getTranslations("ministries");
  const tCommon = await getTranslations("common");
  const ministries = await getLocalizedMinistries();
  const items = limit ? ministries.slice(0, limit) : ministries;

  return (
    <section className="section-padding bg-cream" id="ministries">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("title")}
            description={t("description")}
            theme="light"
          />
        </SectionReveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m, i) => (
            <SectionReveal key={m.id} delay={i * 0.05}>
              <MinistryCard ministry={m} theme="light" />
            </SectionReveal>
          ))}
        </div>
        <p className="mt-12 text-center">
          <Link
            href="/ministries"
            className="text-xs uppercase tracking-widest text-bronze hover:text-gold transition-colors"
          >
            {tCommon("viewAllMinistries")}
          </Link>
        </p>
      </div>
    </section>
  );
}
