import type { Ministry } from "@/data/ministries";

type IconName = Ministry["icon"];

interface MinistryIconProps {
  name: IconName;
  className?: string;
}

export function MinistryIcon({ name, className }: MinistryIconProps) {
  const stroke = "currentColor";
  const common = { fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round" as const };

  switch (name) {
    case "book":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M4 6h8a3 3 0 0 1 3 3v12H7a3 3 0 0 0-3 3V6z" />
          <path {...common} d="M20 6h-8a3 3 0 0 0-3 3v12h8a3 3 0 0 0 3-3V6z" />
        </svg>
      );
    case "music":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="18" cy="16" r="3" fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M12 2c1 3 4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-5 0 2-1 3-2 4z" />
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M8 11V5a2 2 0 1 1 4 0v6M12 11V4a2 2 0 1 1 4 0v8" />
          <path {...common} d="M8 11v2a4 4 0 0 0 8 0v-2" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "flower":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="2" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path {...common} d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path {...common} d="M12 2l8 3v7c0 5-3.5 9-8 10-4.5-1-8-5-8-10V5l8-3z" />
          <path {...common} d="M12 8v8M9 11h6" />
        </svg>
      );
    default:
      return null;
  }
}
