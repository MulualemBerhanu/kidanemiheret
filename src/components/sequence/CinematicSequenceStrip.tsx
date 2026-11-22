"use client";

import { useTranslations } from "next-intl";
import { GoldParticles } from "@/components/effects/GoldParticles";
import { SmokeOverlay } from "@/components/effects/SmokeOverlay";
import { ScrollImageSequence } from "@/components/sequence/ScrollImageSequence";
import {
  DEFAULT_SEQUENCE_SCROLL,
  type SequencePresetId,
  sequencePresets,
} from "@/data/sequence-presets";
import { cn } from "@/lib/utils";

interface CinematicSequenceStripProps {
  /** Use a named preset for consistent config across the site */
  preset: SequencePresetId;
  className?: string;
  /** Override scroll trigger — defaults to non-pin reactive scroll */
  scrollTrigger?: typeof DEFAULT_SEQUENCE_SCROLL;
  /** Reduce particles on secondary strips */
  particles?: boolean;
}

/**
 * Reusable scroll-reactive canvas strip.
 * Drop between sections on any page — same overlays, same behavior, different frame ranges.
 *
 * @example
 * <CinematicSequenceStrip preset="worship" />
 * <CinematicSequenceStrip preset="heritage" />
 */
export function CinematicSequenceStrip({
  preset: presetId,
  className,
  scrollTrigger = DEFAULT_SEQUENCE_SCROLL,
  particles = true,
}: CinematicSequenceStripProps) {
  const t = useTranslations("sequence");
  const preset = sequencePresets[presetId];
  const ariaLabel = t(`presets.${presetId}`);

  return (
    <div
      className={cn(
        "relative w-full border-y border-gold/10 bg-charcoal",
        className
      )}
      data-sequence={presetId}
    >
      <ScrollImageSequence
        framePattern={preset.framePattern}
        frameCount={preset.frameCount}
        startFrame={preset.startFrame}
        fallbackSrc={preset.fallbackSrc}
        fallbackAlt={ariaLabel}
        size={preset.size}
        scrollTrigger={scrollTrigger}
      >
        <SequenceOverlays particles={particles} />
      </ScrollImageSequence>
    </div>
  );
}

function SequenceOverlays({ particles }: { particles: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/4 bg-gradient-to-b from-charcoal to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/4 bg-gradient-to-t from-charcoal to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(182,138,62,0.12), transparent 70%)",
        }}
        aria-hidden
      />
      <SmokeOverlay className="z-20 opacity-30" intensity="low" />
      {particles && <GoldParticles count={6} className="z-20 opacity-40" />}
    </>
  );
}
