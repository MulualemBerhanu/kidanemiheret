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
 * Fills its parent with blurred ambient + contained art.
 * Parent must already start below the floating menu.
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
      className={cn(
        "absolute inset-0 isolate overflow-hidden bg-[#1a1510]",
        className
      )}
    >
      {/* Nested clip so blur never paints into the menu band */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          quality={60}
          className="object-cover opacity-80 blur-2xl"
          sizes="100vw"
        />
      </div>
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
