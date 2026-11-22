"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brandImages } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionTone = "dark" | "light";

interface SacredBorderProps {
  className?: string;
  theme?: SectionTone;
  size?: number;
}

const DEFAULT_SIZE = 64;

export function SacredBorder({
  className,
  theme = "light",
  size = DEFAULT_SIZE,
}: SacredBorderProps) {
  const stroke = theme === "dark" ? "#c9a227" : "#8b6914";
  const height = Math.round(size * 1.4);
  const reduced = usePrefersReducedMotion();

  const line = (dir: "left" | "right") => (
    <motion.span
      className="h-px w-12 origin-center md:w-20"
      style={{
        background:
          dir === "left"
            ? `linear-gradient(90deg, transparent, ${stroke})`
            : `linear-gradient(90deg, ${stroke}, transparent)`,
      }}
      initial={reduced ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );

  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden>
      {line("left")}
      <motion.span
        initial={reduced ? false : { scale: 0.4, opacity: 0, rotate: -8 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={brandImages.cross}
          alt=""
          width={size}
          height={height}
          className="shrink-0 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
          style={{ width: size, height }}
        />
      </motion.span>
      {line("right")}
    </div>
  );
}
