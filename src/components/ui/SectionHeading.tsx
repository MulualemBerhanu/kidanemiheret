import { cn } from "@/lib/utils";
import { SacredBorder } from "@/components/ui/SacredBorder";

interface SectionHeadingProps {
  eyebrow?: string;
  geEz?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  geEz,
  title,
  description,
  align = "center",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {(eyebrow || geEz) && (
        <div
          className={cn(
            "mb-4 flex flex-wrap items-center gap-x-4 gap-y-1",
            align === "center" && "justify-center"
          )}
        >
          {eyebrow && (
            <p
              className={cn(
                "font-sans text-[10px] uppercase tracking-[0.4em]",
                isDark ? "text-gold/85" : "text-bronze"
              )}
            >
              {eyebrow}
            </p>
          )}
          {geEz && (
            <p
              className={cn(
                "font-amharic text-sm tracking-wide",
                isDark ? "text-gold/50" : "text-bronze/70"
              )}
              lang="am"
            >
              {geEz}
            </p>
          )}
        </div>
      )}
      <SacredBorder className="mb-7" theme={theme} />
      <h2
        className={cn(
          "font-display text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-[1.15] tracking-tight",
          isDark ? "text-ivory" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-[15px] md:text-base leading-[1.75] max-w-2xl",
            align === "center" && "mx-auto",
            isDark ? "text-ivory/60" : "text-charcoal/65"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
