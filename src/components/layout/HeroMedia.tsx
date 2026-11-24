import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroMediaProps {
  src: string;
  alt?: string;
  /** Soften the sharp layer slightly */
  opacity?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
}

/**
 * Consistent hero framing across devices.
 * Media always starts below the floating menu (no overlap).
 * Blurred ambient fill + object-contain keeps the full composition
 * identical on phone, tablet, and desktop.
 */
export function HeroMedia({
  src,
  alt = "",
  opacity = 0.95,
  priority = false,
  quality = 90,
  className,
}: HeroMediaProps) {
  return (
    <div
      className={cn("absolute inset-x-0 bottom-0", className)}
      style={{ top: "var(--site-nav-clearance)" }}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        quality={55}
        className="scale-[1.2] object-cover opacity-90 blur-3xl"
        sizes="100vw"
        aria-hidden
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        className="object-contain object-center"
        style={{ opacity }}
        sizes="100vw"
      />
    </div>
  );
}
