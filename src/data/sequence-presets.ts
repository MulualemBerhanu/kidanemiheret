import {
  SEQUENCE_FALLBACK,
  SEQUENCE_FRAME_COUNT,
  SEQUENCE_PATTERN,
  framePath,
} from "@/data/frames";
import type { ScrollImageSequenceScrollConfig } from "@/components/sequence/ScrollImageSequence";

export type SequencePresetId =
  | "instruments"
  | "worship"
  | "heritage"
  | "community";

export type SequenceSize = "hero" | "standard" | "compact";

export interface SequencePreset {
  id: SequencePresetId;
  framePattern: string;
  frameCount: number;
  startFrame: number;
  fallbackSrc: string;
  ariaLabel: string;
  size: SequenceSize;
}

/** Responsive strip heights — mobile ~150–200, tablet ~220–280, desktop ~300–360 */
export const SEQUENCE_HEIGHTS: Record<SequenceSize, string> = {
  hero: "h-[180px] w-full sm:h-[220px] md:h-[280px] lg:h-[340px]",
  standard: "h-[160px] w-full sm:h-[200px] md:h-[250px] lg:h-[320px]",
  compact: "h-[140px] w-full sm:h-[170px] md:h-[220px] lg:h-[260px]",
};

/** Named presets — same visual language, different frame ranges */
export const sequencePresets: Record<SequencePresetId, SequencePreset> = {
  instruments: {
    id: "instruments",
    framePattern: SEQUENCE_PATTERN,
    frameCount: SEQUENCE_FRAME_COUNT,
    startFrame: 1,
    fallbackSrc: SEQUENCE_FALLBACK,
    ariaLabel: "Sacred Ethiopian instruments and Meskel cross",
    size: "hero",
  },
  worship: {
    id: "worship",
    framePattern: SEQUENCE_PATTERN,
    frameCount: 8,
    startFrame: 1,
    fallbackSrc: framePath(4),
    ariaLabel: "Sacred worship and liturgy",
    size: "standard",
  },
  heritage: {
    id: "heritage",
    framePattern: SEQUENCE_PATTERN,
    frameCount: 8,
    startFrame: 8,
    fallbackSrc: framePath(12),
    ariaLabel: "Ethiopian Orthodox heritage",
    size: "standard",
  },
  community: {
    id: "community",
    framePattern: SEQUENCE_PATTERN,
    frameCount: SEQUENCE_FRAME_COUNT,
    startFrame: 1,
    fallbackSrc: framePath(10),
    ariaLabel: "Church community and fellowship",
    size: "compact",
  },
};

export const DEFAULT_SEQUENCE_SCROLL: ScrollImageSequenceScrollConfig = {
  start: "top 90%",
  end: "bottom 10%",
  scrub: true,
  pin: false,
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  preventOverlaps: true,
};
