import { cn } from "@/lib/utils";

/** Film grain + vignette for premium cinematic sections */
export function CinematicOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      aria-hidden
    >
      <div className="absolute inset-0 vignette" />
      <div className="absolute inset-0 film-grain opacity-[0.04]" />
    </div>
  );
}
