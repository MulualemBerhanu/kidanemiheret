import { cn } from "@/lib/utils";

interface SacredEyebrowProps {
  children: React.ReactNode;
  className?: string;
  /** Dark text for light mist heroes; light for dark heroes */
  tone?: "dark" | "light";
}

/**
 * Premium sacred label — ornamental gold rails + diamond, no pill/box.
 */
export function SacredEyebrow({
  children,
  className,
  tone = "dark",
}: SacredEyebrowProps) {
  const dark = tone === "dark";

  return (
    <p
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-2.5 sm:gap-3.5",
        className
      )}
    >
      <span
        className={cn(
          "text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.34em]",
          dark
            ? "text-[#3d2e16] [text-shadow:0_1px_0_rgba(247,243,234,0.9)]"
            : "text-[#e9d5a7] [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
        )}
      >
        {children}
      </span>
      <span
        className="h-1.5 w-1.5 shrink-0 rotate-45 border border-[#b68a3e]"
        aria-hidden
      />
      <span className="hidden h-px w-6 shrink-0 bg-gradient-to-l from-transparent to-[#b68a3e] sm:block sm:w-8" aria-hidden />
    </p>
  );
}
