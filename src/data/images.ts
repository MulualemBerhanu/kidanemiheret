/**
 * Tiered image manifest — replace placeholders in /public/images/editorial/
 * See public/images/ASSETS.md for the full upload checklist.
 *
 * Page heroes use /images/heroes/* staged frames (full art, 2:1) so the
 * complete image shows across desktop / tablet / mobile.
 */

export const editorialImages = {
  hero: "/images/heroes/home-km-hero.jpg",
  welcome: "/images/gallery/welcome.JPG",
  give: "/images/editorial/give.jpg",
  /** Staged full-frame for heroes / wide slots */
  contact: "/images/heroes/contact-holy-family.jpg",
  about: "/images/heroes/about-mary-saint-clouds.jpg",
  /** Original art for framed intro panels */
  aboutPortrait: "/images/mary-saint-radiant-clouds.png",
  contactLandscape: "/images/radiant-holy-family-journey.png",
} as const;

export const pageHeroImages = {
  about: "/images/heroes/about-mary-saint-clouds.jpg",
  ministries: "/images/heroes/ministries-altar.jpg",
  events: "/images/editorial/page-events.jpg",
  gallery: "/images/heroes/gallery-mariyam.jpg",
  give: "/images/editorial/page-give.jpg",
  contact: "/images/heroes/contact-holy-family.jpg",
  register: "/images/gallery/welcome.JPG",
} as const;

export const ministryImages: Record<string, string> = {
  "sunday-school": "/images/editorial/ministries/sunday-school.jpg",
  youth: "/images/editorial/ministries/youth.jpg",
  women: "/images/editorial/ministries/women.jpg",
  men: "/images/editorial/ministries/men.jpg",
  choir: "/images/editorial/ministries/choir.jpg",
  prayer: "/images/editorial/ministries/prayer.jpg",
  outreach: "/images/editorial/ministries/outreach.jpg",
};

export const eventImages: Record<string, string> = {
  meskel: "/images/editorial/events/meskel.jpg",
  timket: "/images/editorial/events/timket.jpg",
  "youth-retreat": "/images/editorial/events/youth-retreat.jpg",
  "community-meal": "/images/editorial/events/community-meal.jpg",
};

export const mediaImages: Record<string, string> = {
  "sermon-1": "/images/editorial/media/sermon-1.jpg",
  "sermon-2": "/images/editorial/media/sermon-2.jpg",
  "sermon-3": "/images/editorial/media/sermon-3.jpg",
  "sermon-4": "/images/editorial/media/sermon-4.jpg",
  "sermon-5": "/images/editorial/media/sermon-5.jpg",
  "sermon-6": "/images/editorial/media/sermon-6.jpg",
};

export const brandImages = {
  logo: "/images/km.png",
  cross: "/images/cross.png",
} as const;
