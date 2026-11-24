import { getTranslations } from "next-intl/server";
import { HeroMedia } from "@/components/layout/HeroMedia";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SacredEyebrow } from "@/components/ui/SacredEyebrow";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundSrc?: string;
  /** Kept for API compatibility */
  backgroundPosition?: "top" | "center" | "bottom";
  /** Kept for API compatibility */
  imageFit?: "cover" | "contain";
  /** Taller cinematic About-style hero */
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
        style={{ height: "var(--site-nav-clearance, 7rem)" }}
        aria-hidden
      />

      <div
        className={cn(
          "relative flex items-end overflow-hidden bg-[#1a1510]",
          cinematic
            ? "min-h-[44svh] pb-12 sm:min-h-[50svh] sm:pb-16 md:min-h-[62svh] md:pb-20 lg:min-h-[70svh]"
            : "min-h-[40svh] pb-12 sm:min-h-[46svh] sm:pb-16 md:min-h-[54svh] md:pb-20 lg:min-h-[60svh]"
        )}
      >
        {backgroundSrc && (
          <HeroMedia
            src={backgroundSrc}
            priority
            quality={cinematic ? 90 : 85}
            opacity={cinematic ? 0.95 : 0.92}
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent md:from-black/35 md:via-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#100d0b] via-[#100d0b]/50 to-transparent sm:h-44"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,236,180,0.1),transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-8">
          <SectionReveal>
            <div className="relative max-w-2xl">
              <div
                className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(247,243,234,0.94)_0%,rgba(247,243,234,0.78)_45%,transparent_78%)] sm:-inset-x-8 sm:-inset-y-8 md:-inset-x-10"
                aria-hidden
              />

              <SacredEyebrow tone="dark" className="mb-3 sm:mb-4">
                {t("shortName")}
              </SacredEyebrow>
              <h1 className="font-display max-w-[18ch] text-[clamp(2rem,6.5vw,3.6rem)] font-light leading-[1.08] tracking-[-0.02em] text-[#1a1510]">
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
