"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  const switchLocale = (next: (typeof routing.locales)[number]) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn("flex items-center gap-2 text-[11px]", className)}
      role="group"
      aria-label={t("switchLabel")}
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={cn(
          "transition-colors",
          locale === "en" ? "text-gold" : "text-ivory/55 hover:text-ivory"
        )}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("english")}
      </button>
      <span className="text-ivory/25" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => switchLocale("am")}
        className={cn(
          "font-amharic transition-colors",
          locale === "am" ? "text-gold" : "text-ivory/55 hover:text-ivory"
        )}
        aria-current={locale === "am" ? "true" : undefined}
      >
        {t("amharic")}
      </button>
    </div>
  );
}
