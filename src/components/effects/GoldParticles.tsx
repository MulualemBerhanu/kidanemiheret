"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

interface GoldParticlesProps {
  count?: number;
  className?: string;
}

/** CSS-only particles — no Framer Motion overhead */
export function GoldParticles({ count = 12, className }: GoldParticlesProps) {
  const reduced = usePrefersReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: Math.min(count, 16) }, (_, i) => ({
        id: i,
        left: `${(i * 41) % 100}%`,
        top: `${(i * 29) % 100}%`,
        size: 2 + (i % 2),
        delay: `${(i % 8) * 0.55}s`,
        duration: `${5 + (i % 4)}s`,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-dot absolute rounded-full bg-gold/50"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
