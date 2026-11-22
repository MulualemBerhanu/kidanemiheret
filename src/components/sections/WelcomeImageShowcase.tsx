"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { brandImages } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** welcome.JPG — 3652×2972. Intrinsic ratio only; never crop. */
const IMAGE_WIDTH = 3652;
const IMAGE_HEIGHT = 2972;

interface WelcomeImageShowcaseProps {
  src: string;
  alt: string;
  caption: string;
}

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-8 w-8 text-gold/50 md:h-10 md:w-10", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M4 44 L4 4 L44 4 M4 12 L36 12 M12 4 L12 36"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function WelcomeImageShowcase({ src, alt, caption }: WelcomeImageShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const frameY = useTransform(scrollYProgress, [0, 1], [16, -12]);

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        className="relative will-change-transform"
        style={reduced ? undefined : { y: frameY }}
      >
        <div className="relative rounded-[3px] bg-gradient-to-br from-[#f3ece0] via-ivory to-cream p-3 shadow-[0_32px_64px_rgba(24,18,10,0.12)] ring-1 ring-gold/20 md:p-4">
          <CornerOrnament className="absolute left-2 top-2 md:left-3 md:top-3" />
          <CornerOrnament className="absolute right-2 top-2 rotate-90 md:right-3 md:top-3" />
          <CornerOrnament className="absolute bottom-2 left-2 -rotate-90 md:bottom-3 md:left-3" />
          <CornerOrnament className="absolute bottom-2 right-2 rotate-180 md:bottom-3 md:right-3" />

          <div className="border border-gold/30 bg-charcoal/[0.02] p-1.5 md:p-2">
            <Image
              src={src}
              alt={alt}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              unoptimized
              className="block h-auto w-full rounded-[1px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="mt-4 flex items-center gap-3 border-t border-gold/15 pt-4 md:mt-5 md:pt-4">
            <Image
              src={brandImages.cross}
              alt=""
              width={24}
              height={34}
              className="h-8 w-auto shrink-0 opacity-75"
            />
            <p className="min-w-0 text-[10px] uppercase leading-relaxed tracking-[0.22em] text-bronze/85">
              {caption}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
