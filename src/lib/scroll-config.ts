/**
 * Native scroll = fastest feel (Apple / Stripe style).
 * Set ENABLE_LENIS to true for light Lenis smoothing.
 */
export const ENABLE_LENIS = false;

export const LENIS_LERP = 0.08;
export const LENIS_WHEEL_MULTIPLIER = 1.15;
export const LENIS_TOUCH_MULTIPLIER = 1.2;

/** Scroll-driven sequence — reacts to scroll, never controls it */
export const SEQUENCE_SCROLL = {
  start: "top 90%",
  end: "bottom 10%",
  scrub: true as const,
  pin: false as const,
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  preventOverlaps: true,
};

export const MAX_CANVAS_DPR_DESKTOP = 1.25;
export const MAX_CANVAS_DPR_MOBILE = 1;
export const PRIORITY_FRAME_COUNT = 5;
