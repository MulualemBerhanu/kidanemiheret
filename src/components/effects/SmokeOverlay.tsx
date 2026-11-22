import { cn } from "@/lib/utils";

interface SmokeOverlayProps {
  className?: string;
  intensity?: "low" | "medium";
}

/** Static CSS smoke — zero animation cost */
export function SmokeOverlay({ className, intensity = "medium" }: SmokeOverlayProps) {
  const opacity = intensity === "low" ? 0.2 : 0.32;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 80%, rgba(140,120,100,${opacity}), transparent 55%),
          radial-gradient(ellipse 70% 45% at 80% 30%, rgba(120,100,90,${opacity * 0.8}), transparent 50%)
        `,
      }}
      aria-hidden
    />
  );
}
