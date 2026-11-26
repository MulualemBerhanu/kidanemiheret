import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroMediaProps {
  src: string;
  alt?: string;
  /** Soften the sharp layer slightly */
  opacity?: number;
  priority?: boolean;
  quality?: number;
  /**
   * contain — full art with frame letterboxing
   * cover — fills taller page-hero planes on mobile
   */
  fit?: "contain" | "cover";
  /** object-position when fit is cover */
  position?: "center" | "top" | "bottom";
  className?: string;
}

/**
 * Hero image layer. Use fit="cover" on page heroes so taller mobile
 * planes stay image-filled; fit="contain" keeps full artwork visible.
 */
export function HeroMedia({
  src,
  alt = "",
  opacity = 1,
  priority = false,
  quality = 90,
  fit = "contain",
  position = "center",
  className,
}: HeroMediaProps) {
  const positionClass =
    position === "top"
      ? "object-top"
      : position === "bottom"
        ? "object-bottom"
        : "object-center";

  return (
    <div
      className={cn("absolute inset-0 isolate overflow-hidden", className)}
      style={{ backgroundColor: "var(--hero-frame, #4a3420)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(201,162,39,0.22) 0%, rgba(74,52,32,0.95) 70%, #4a3420 100%)",
        }}
        aria-hidden
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        className={cn(
          fit === "cover" ? "object-cover" : "object-contain",
          fit === "contain" ? "object-top" : positionClass
        )}
        style={{ opacity }}
        sizes="100vw"
      />
    </div>
  );
}
