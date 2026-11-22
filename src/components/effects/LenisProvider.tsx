"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ENABLE_LENIS,
  LENIS_LERP,
  LENIS_TOUCH_MULTIPLIER,
  LENIS_WHEEL_MULTIPLIER,
} from "@/lib/scroll-config";
import { registerLenis } from "@/lib/scroll-sync";

gsap.registerPlugin(ScrollTrigger);

function useNativeScroll(): boolean {
  if (typeof window === "undefined") return true;
  if (!ENABLE_LENIS) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (useNativeScroll()) {
      document.documentElement.classList.add("scroll-native");
      registerLenis(null);
      ScrollTrigger.refresh();
      return;
    }

    document.documentElement.classList.remove("scroll-native");

    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
      touchMultiplier: LENIS_TOUCH_MULTIPLIER,
      syncTouch: false,
      infinite: false,
      autoRaf: false,
    });

    registerLenis(lenis);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true, force: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const raf = (time: number) => lenis.raf(time);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      registerLenis(null);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
