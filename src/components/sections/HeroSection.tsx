import { getTranslations } from "next-intl/server";
import { getLocalizedEvents } from "@/lib/i18n-content";
import { HeroSectionClient } from "@/components/sections/HeroSectionClient";

export async function HeroSection() {
  const events = await getLocalizedEvents();
  const upcomingEvent = events[0];

  return <HeroSectionClient upcomingEvent={upcomingEvent} />;
}
