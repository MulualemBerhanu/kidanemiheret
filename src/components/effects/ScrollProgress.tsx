"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gold bar pinned to the very top that fills as the page scrolls.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-bronze via-gold to-amber"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
