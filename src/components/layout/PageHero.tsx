import { getTranslations } from "next-intl/server";
import { HeroMedia } from "@/components/layout/HeroMedia";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SacredEyebrow } from "@/components/ui/SacredEyebrow";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundSrc?: string;
  /** Kept for API compatibility */
  backgroundPosition?: "top" | "center" | "bottom";
  /** Kept for API compatibility */
  imageFit?: "cover" | "contain";
  /** Higher quality for featured pages */
  variant?: "default" | "cinematic";
}

export async function PageHero({
  title,
  subtitle,
  backgroundSrc,
  variant = "default",
}: PageHeroProps) {
  const t = await getTranslations("site");
  const cinematic = variant === "cinematic";

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea]">
      {/* Reserved space so the floating menu never covers the image */}
      <div
        className="w-full shrink-0 bg-[#f7f3ea]"
        style={{ height: "var(--site-nav-clearance, 5.5rem)" }}
        aria-hidden
      />

      {/* Taller on mobile so the image owns the first screen; widens toward 2:1 on desktop */}
      <div
        className="relative flex w-full aspect-[4/5] items-end overflow-hidden sm:aspect-[5/4] md:aspect-[3/2] lg:aspect-[2/1]"
        style={{ backgroundColor: "var(--hero-frame, #4a3420)" }}
      >
        {backgroundSrc && (
          <HeroMedia
            src={backgroundSrc}
            priority
            quality={cinematic ? 90 : 85}
            opacity={1}
            fit="cover"
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent md:from-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#100d0b]/70 via-[#100d0b]/25 to-transparent sm:h-40 md:h-36"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 sm:px-6 sm:pb-12 md:px-8 md:pb-12">
          <SectionReveal>
            <div className="relative max-w-2xl">
              <div
                className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.94)_0%,rgba(247,243,234,0.78)_45%,transparent_78%)] sm:-inset-x-8 sm:-inset-y-8 md:-inset-x-10"
                aria-hidden
              />

              <SacredEyebrow tone="dark" className="mb-3 sm:mb-4">
                {t("shortName")}
              </SacredEyebrow>
              <h1 className="font-display max-w-[18ch] text-[clamp(2.15rem,7vw,3.6rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-4 max-w-xl text-[14px] font-light leading-relaxed text-[#2a241c]/85 sm:mt-5 sm:text-base md:text-lg">
                  {subtitle}
                </p>
              )}
              <div className="mt-8 hidden items-center gap-3 opacity-60 sm:flex" aria-hidden>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#5c4524]">Scroll</span>
                <span className="block h-8 w-px bg-gradient-to-b from-[#b68a3e] to-transparent" />
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
