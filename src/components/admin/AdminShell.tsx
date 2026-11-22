"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/worship", label: "Worship" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-charcoal/95 text-ivory backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="group min-w-0">
            <p className="font-amharic text-base text-gold transition group-hover:brightness-110">
              ኪዳነ ምሕረት
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.28em] text-ivory/45">
              Parish Admin
            </p>
          </Link>

          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[2px] px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] transition",
                    active
                      ? "bg-gold text-charcoal"
                      : "text-ivory/55 hover:bg-white/5 hover:text-ivory"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="/en"
              className="ml-1 hidden rounded-[2px] px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory/40 transition hover:text-gold sm:inline-flex"
            >
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="ml-1 rounded-[2px] border border-gold/30 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-gold/80 transition hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 md:py-12">{children}</main>
    </div>
  );
}
