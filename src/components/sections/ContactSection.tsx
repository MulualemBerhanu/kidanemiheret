import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { editorialImages } from "@/data/images";
import { getLocalizedSchedule, getLocalizedSundaySegments } from "@/lib/i18n-content";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ui/ContactForm";

export async function ContactSection() {
  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");
  const { address, phone, email, maps } = siteConfig;
  const serviceSchedule = await getLocalizedSchedule();
  const sunday = await getLocalizedSundaySegments();
  const otherServices = serviceSchedule.filter((s) => s.id !== "sunday-liturgy");

  return (
    <section className="section-padding bg-ivory" id="contact">
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

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <SectionReveal>
            <div className="space-y-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[#1a1510] ring-1 ring-gold/15">
                <Image
                  src={editorialImages.contact}
                  alt={t("imageAlt")}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>

              <div className="rounded-[2px] border border-gold/25 bg-cream p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-bronze">
                  {t("planVisitEyebrow")}
                </p>
                <h3 className="mt-2 font-display text-2xl text-charcoal">
                  {t("planVisitTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                  {t("planVisitNote")}
                </p>

                <div className="mt-6">
                  <h4 className="mb-3 text-xs uppercase tracking-widest text-bronze">
                    {sunday.title}
                  </h4>
                  <div className="rounded-[2px] border border-gold/20 bg-ivory/70 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gold/15 pb-3">
                      <p className="font-display text-lg text-charcoal">{sunday.sundayTitle}</p>
                      <p className="text-sm font-medium text-bronze">{sunday.sundayRange}</p>
                    </div>
                    <ul className="mt-3 space-y-2.5">
                      {sunday.segments.map((seg) => (
                        <li
                          key={seg.id}
                          className="grid grid-cols-[7.5rem_1fr] gap-3 text-sm sm:grid-cols-[9rem_1fr]"
                        >
                          <span className="shrink-0 text-bronze tabular-nums">{seg.time}</span>
                          <span className="text-charcoal/80">{seg.service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {otherServices.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {otherServices.map((s) => (
                        <li
                          key={s.id}
                          className="flex justify-between gap-4 border-b border-gold/10 pb-3 text-sm"
                        >
                          <span className="font-medium text-charcoal">{s.day}</span>
                          <span className="text-right text-charcoal/60">
                            {s.time} — {s.service}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
                    {t("scheduleNote")}
                  </p>
                </div>

                <div className="mt-6 border-t border-gold/15 pt-6">
                  <h4 className="mb-3 text-xs uppercase tracking-widest text-bronze">
                    {tCommon("address")}
                  </h4>
                  <p className="leading-relaxed text-charcoal/80">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="mt-4">
                    <a href={`tel:${phone}`} className="text-bronze hover:text-gold">
                      {phone}
                    </a>
                    <br />
                    <a href={`mailto:${email}`} className="text-bronze hover:text-gold">
                      {email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] ring-1 ring-gold/15">
                  <iframe
                    src={maps.embedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    title={t("mapTitle")}
                  />
                </div>
                <a
                  href={maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-bronze transition hover:text-gold"
                >
                  {t("getDirections")} →
                </a>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <ContactForm />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
