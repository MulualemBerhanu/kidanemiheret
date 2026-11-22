"use client";

import { GalleryPageHero } from "@/components/sections/GalleryPageHero";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { SacredInstrumentDivider } from "@/components/sequence/SacredInstrumentDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageHeroImages } from "@/data/images";
import type { GalleryImage } from "@/data/gallery";

interface GalleryPageClientProps {
  images: GalleryImage[];
  pageTitle: string;
  pageSubtitle: string;
  siteName: string;
  sectionEyebrow: string;
  geEz: string;
  sectionTitle: string;
  sectionDescription: string;
}

export function GalleryPageClient({
  images,
  pageTitle,
  pageSubtitle,
  siteName,
  sectionEyebrow,
  geEz,
  sectionTitle,
  sectionDescription,
}: GalleryPageClientProps) {
  return (
    <>
      <GalleryPageHero
        images={images}
        title={pageTitle}
        subtitle={pageSubtitle}
        eyebrow={siteName}
        coverSrc={pageHeroImages.gallery}
      />
      <SacredInstrumentDivider />
      <section className="relative overflow-hidden bg-charcoal py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.07),transparent_55%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center">
            <SectionHeading
              eyebrow={sectionEyebrow}
              geEz={geEz}
              title={sectionTitle}
              description={sectionDescription}
              theme="dark"
            />
          </div>

          <div className="mt-14">
            <GalleryGrid images={images} theme="dark" showFilters />
          </div>
        </div>
      </section>
    </>
  );
}
