/** CSS glow — replaces Three.js for faster hero load */
export function HeroGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-[42%] h-[min(70vw,480px)] w-[min(70vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2)_0%,transparent_65%)] hero-glow-pulse" />
    </div>
  );
}
