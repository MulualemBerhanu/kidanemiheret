import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GiveCard } from "@/components/ui/GiveCard";
import { MeskelCross } from "@/components/effects/MeskelCross";
import { editorialImages } from "@/data/images";

export async function GiveSection() {
  const t = await getTranslations("give");

  return (
    <section className="section-padding relative overflow-hidden bg-charcoal" id="give">
      <Image
        src={editorialImages.give}
        alt=""
        fill
        className="object-cover opacity-[0.18]"
        sizes="100vw"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/92 to-charcoal" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(182,138,62,0.12),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionReveal>
          <div className="mb-8 flex justify-center">
            <MeskelCross size={56} className="opacity-80" />
          </div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            geEz={t("geEz")}
            title={t("title")}
            theme="dark"
            className="mb-12"
          />
        </SectionReveal>
        <SectionReveal delay={0.12}>
          <GiveCard />
        </SectionReveal>
      </div>
    </section>
  );
}
