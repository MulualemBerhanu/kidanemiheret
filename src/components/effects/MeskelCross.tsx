import Image from "next/image";
import { brandImages } from "@/data/images";
import { cn } from "@/lib/utils";

interface MeskelCrossProps {
  className?: string;
  size?: number;
  glow?: boolean;
  priority?: boolean;
}

export function MeskelCross({
  className,
  size = 120,
  glow = true,
  priority = false,
}: MeskelCrossProps) {
  const height = Math.round(size * 1.4);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      aria-hidden
    >
      {glow && (
        <div
          className="absolute inset-0 scale-150 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
          }}
        />
      )}
      <Image
        src={brandImages.cross}
        alt=""
        width={size}
        height={height}
        priority={priority}
        className="relative z-10 object-contain drop-shadow-[0_0_24px_rgba(212,175,55,0.45)]"
        style={{ width: size, height }}
      />
    </div>
  );
}
