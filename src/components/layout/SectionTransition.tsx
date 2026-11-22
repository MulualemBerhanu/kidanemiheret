import { cn } from "@/lib/utils";

type SectionTone = "ivory" | "cream" | "charcoal";

const TONE_HEX: Record<SectionTone, string> = {
  ivory: "#f7f3ea",
  cream: "#f3eee4",
  charcoal: "#100d0b",
};

const TONE_CLASS: Record<SectionTone, string> = {
  ivory: "bg-ivory",
  cream: "bg-cream",
  charcoal: "bg-charcoal",
};

interface SectionTransitionProps {
  /** Background tone of the section above */
  from: SectionTone;
  /** Background tone of the section below */
  to: SectionTone;
  className?: string;
}

/**
 * Smooth gradient band placed between two sections so tone changes
 * blend instead of showing a hard edge.
 */
export function SectionTransition({ from, to, className }: SectionTransitionProps) {
  return (
    <div
      aria-hidden
      className={cn("h-20 w-full md:h-28", className)}
      style={{
        background: `linear-gradient(to bottom, ${TONE_HEX[from]} 0%, ${TONE_HEX[to]} 100%)`,
      }}
    />
  );
}

interface SectionFeatherProps {
  /** Background tone on both sides of the rule */
  tone?: SectionTone;
  className?: string;
}

/**
 * Subtle gold rule between sections that share the same background tone.
 */
export function SectionFeather({ tone = "charcoal", className }: SectionFeatherProps) {
  return (
    <div aria-hidden className={cn("w-full", TONE_CLASS[tone], className)}>
      <div className="flex h-14 items-center justify-center px-5 md:h-16 md:px-8">
        <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      </div>
    </div>
  );
}
