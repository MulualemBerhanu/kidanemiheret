import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { SacredInstrumentDivider } from "@/components/sequence/SacredInstrumentDivider";
import { CinematicSequenceStrip } from "@/components/sequence/CinematicSequenceStrip";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { MinistriesSection } from "@/components/sections/MinistriesSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GalleryTeaserSection } from "@/components/sections/GalleryTeaserSection";
import { GiveSection } from "@/components/sections/GiveSection";
import { ContactTeaserSection } from "@/components/sections/ContactTeaserSection";
import { StatBand } from "@/components/sections/StatBand";
import { SectionTransition } from "@/components/layout/SectionTransition";
import { SectionFeather } from "@/components/layout/SectionTransition";
import { Footer } from "@/components/layout/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      {/* Transition A — Begena / instruments (after hero) */}
      <SacredInstrumentDivider />

      <WelcomeSection />

      <SectionTransition from="ivory" to="charcoal" />
      <StatBand />
      <SectionTransition from="charcoal" to="cream" />

      <MinistriesSection limit={3} />
      <SectionTransition from="cream" to="charcoal" />
      <EventsSection limit={2} />

      {/* Transition D — Meskel / heritage (before gallery) */}
      <CinematicSequenceStrip preset="heritage" />

      <GalleryTeaserSection />
      <SectionFeather tone="charcoal" />
      <GiveSection />
      <SectionTransition from="charcoal" to="ivory" />
      <ContactTeaserSection />
      <SectionTransition from="ivory" to="charcoal" />
      <Footer />
    </>
  );
}
