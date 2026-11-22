import "server-only";
import { getLocale, getTranslations } from "next-intl/server";
import { ministryImages } from "@/data/images";
import type { ChurchEvent } from "@/data/events";
import type { Ministry } from "@/data/ministries";
import { getPublishedChurchEvents } from "@/lib/events-store";

const MINISTRY_IDS = [
  "sunday-school",
  "choir",
  "youth",
  "prayer",
  "outreach",
  "women",
  "men",
] as const;

const MINISTRY_ICONS: Record<(typeof MINISTRY_IDS)[number], Ministry["icon"]> = {
  "sunday-school": "book",
  choir: "music",
  youth: "flame",
  prayer: "hands",
  outreach: "heart",
  women: "flower",
  men: "shield",
};

const SCHEDULE_IDS = ["sunday-liturgy"] as const;

const SUNDAY_SEGMENT_IDS = [
  "kidan",
  "qidase",
  "mezmur",
  "teaching",
  "closing",
] as const;

export async function getLocalizedMinistries(): Promise<Ministry[]> {
  const t = await getTranslations("ministries.items");

  return MINISTRY_IDS.map((id) => ({
    id,
    title: t(`${id}.title`),
    description: t(`${id}.description`),
    icon: MINISTRY_ICONS[id],
    href: `/ministries#${id}`,
    image: ministryImages[id],
  }));
}

export async function getLocalizedEvents(): Promise<ChurchEvent[]> {
  const locale = await getLocale();
  return getPublishedChurchEvents(locale);
}

export async function getLocalizedSchedule() {
  const t = await getTranslations("schedule");

  return SCHEDULE_IDS.map((id) => ({
    id,
    day: t(`${id}.day`),
    time: t(`${id}.time`),
    service: t(`${id}.service`),
  }));
}

export async function getLocalizedSundaySegments() {
  const t = await getTranslations("schedule");

  return {
    title: t("title"),
    sundayTitle: t("sundayTitle"),
    sundayRange: t("sundayRange"),
    segments: SUNDAY_SEGMENT_IDS.map((id) => ({
      id,
      time: t(`sundaySegments.${id}.time`),
      service: t(`sundaySegments.${id}.service`),
    })),
  };
}

