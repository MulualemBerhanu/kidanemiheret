import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "ivory";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  gold:
    "relative overflow-hidden bg-gradient-to-r from-[#8a6a2e] via-gold to-[#d4b56a] text-charcoal font-medium shadow-[0_2px_20px_rgba(182,138,62,0.28)] hover:shadow-[0_4px_28px_rgba(182,138,62,0.4)] hover:brightness-110 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/0 before:to-white/15 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
  outline:
    "border border-gold/45 text-ivory bg-ivory/[0.04] backdrop-blur-sm hover:bg-gold/10 hover:border-gold/80",
  ghost:
    "text-ivory/80 hover:text-gold underline-offset-4 hover:underline decoration-gold/50",
  ivory:
    "bg-ivory text-charcoal border border-gold/15 hover:border-gold/40 hover:shadow-md",
};

export function Button({
  variant = "gold",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-[2px] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] transition-all duration-200",
    variants[variant],
    className
  );

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
          <span className="relative z-10">{children}</span>
        </a>
      );
    }
    return (
      <Link href={href} className={base}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
