import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { editorialImages } from "@/data/images";
import { getLocalizedSchedule, getLocalizedSundaySegments } from "@/lib/i18n-content";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export async function ContactTeaserSection() {
  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");
  const tButtons = await getTranslations("buttons");
  const { address, phone, email, maps } = siteConfig;
  const schedule = await getLocalizedSchedule();
  const sunday = await getLocalizedSundaySegments();
  const nextService = schedule[0];

  return (
    <section className="section-padding relative overflow-hidden bg-ivory" id="contact">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(182,138,62,0.07),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("title")}
            description={t("teaserDescription")}
            theme="light"
          />
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <SectionReveal className="min-w-0">
            <div className="relative h-full min-h-[240px] overflow-hidden rounded-[2px] bg-[#1a1510] ring-1 ring-gold/20 sm:min-h-[280px]">
              <Image
                src={editorialImages.contact}
                alt={t("imageAlt")}
                fill
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 50vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="min-w-0">
            <div className="flex h-full flex-col justify-center space-y-7 rounded-[2px] border border-gold/15 bg-white/55 p-6 shadow-[0_18px_48px_rgba(16,13,11,0.06)] md:p-8">
              {nextService && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-bronze">
                    {t("nextService")}
                  </p>
                  <p className="mt-2 font-display text-2xl text-charcoal md:text-[1.75rem]">
                    {sunday.sundayTitle} · {sunday.sundayRange}
                  </p>
                  <p className="text-charcoal/60">{nextService.service}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-bronze">
                  {sunday.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {sunday.segments.map((seg) => (
                    <li
                      key={seg.id}
                      className="grid grid-cols-[7.25rem_1fr] gap-2 border-b border-gold/10 pb-2 text-sm last:border-0 sm:grid-cols-[8.5rem_1fr]"
                    >
                      <span className="text-bronze tabular-nums">{seg.time}</span>
                      <span className="text-charcoal/80">{seg.service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-bronze">
                  {tCommon("address")}
                </p>
                <p className="mt-2 leading-relaxed text-charcoal/80">
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zip}
                </p>
                <a
                  href={maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm text-bronze transition hover:text-gold"
                >
                  {t("getDirections")} →
                </a>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="text-bronze transition hover:text-gold"
                >
                  {phone}
                </a>
                <a href={`mailto:${email}`} className="text-bronze transition hover:text-gold">
                  {email}
                </a>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button href="/contact" variant="gold">
                  {tButtons("planYourVisit")}
                </Button>
                <Button href="/contact?subject=prayer" variant="ivory">
                  {tButtons("prayerRequest")}
                </Button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
