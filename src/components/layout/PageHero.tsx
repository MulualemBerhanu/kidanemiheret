import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionReveal } from "@/components/effects/SectionReveal";
import { SacredEyebrow } from "@/components/ui/SacredEyebrow";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundSrc?: string;
  /** Which part of the background image to keep in frame (cover mode) */
  backgroundPosition?: "top" | "center" | "bottom";
  /**
   * contain = favor full sacred art; on desktop the hero starts under the nav
   * and shows the whole image (edge-matched blur fills any gaps).
   * cover = fill the media area (editorial photos).
   */
  imageFit?: "cover" | "contain";
  /** Taller cinematic About-style hero */
  variant?: "default" | "cinematic";
}

export async function PageHero({
  title,
  subtitle,
  backgroundSrc,
  backgroundPosition = "center",
  imageFit = "cover",
  variant = "default",
}: PageHeroProps) {
  const t = await getTranslations("site");
  const cinematic = variant === "cinematic";
  const contain = imageFit === "contain";

  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-[#1a1510]",
        cinematic
          ? "min-h-[52svh] pt-28 pb-12 sm:min-h-[58svh] sm:pt-32 sm:pb-16 md:min-h-[70svh] md:pb-20 lg:min-h-[78svh]"
          : "min-h-[48svh] pt-28 pb-12 sm:min-h-[55svh] sm:pt-32 sm:pb-16 md:min-h-[62vh] md:pb-20 lg:min-h-[68vh]"
      )}
    >
      {backgroundSrc && (
        <div className="absolute inset-0 xl:top-[var(--site-nav-h)]">
          {/* Edge-matched fill behind the hero image */}
          <Image
            src={backgroundSrc}
            alt=""
            fill
            className="scale-[1.25] object-cover opacity-80 blur-3xl"
            sizes="100vw"
            priority
            quality={60}
            aria-hidden
          />
          <Image
            src={backgroundSrc}
            alt=""
            fill
            className={cn(
              cinematic ? "opacity-95" : "opacity-90",
              // Fill edge-to-edge (no side gaps); desktop media still starts under the nav
              "object-cover",
              contain
                ? "object-[center_28%] sm:object-[center_32%] xl:object-center"
                : [
                    backgroundPosition === "top" && "object-top",
                    backgroundPosition === "center" && "object-center",
                    backgroundPosition === "bottom" && "object-bottom",
                  ]
            )}
            sizes="100vw"
            priority
            quality={cinematic ? 90 : 85}
          />
        </div>
      )}

      {/* Soft luminous overlays — keep art bright */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent xl:top-[var(--site-nav-h)] md:from-black/35 md:via-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#100d0b] via-[#100d0b]/50 to-transparent sm:h-44"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,236,180,0.1),transparent_55%)] xl:top-[var(--site-nav-h)]"
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
    </section>
  );
}
