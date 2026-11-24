import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LenisProvider } from "@/components/effects/LenisProvider";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { routing } from "@/i18n/routing";
import { siteFontVariables } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: {
      default: messages.metadata.home.title,
      template: `%s | ${messages.site.shortName}`,
    },
    description: messages.metadata.home.description,
    metadataBase: new URL("https://kidanemeheret.org"),
    openGraph: {
      title: messages.metadata.home.title,
      description: messages.metadata.home.description,
      type: "website",
      locale: locale === "am" ? "am_ET" : "en_US",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${siteFontVariables} h-full ${locale === "am" ? "locale-am" : ""}`}
    >
      <body
        className="min-h-full antialiased bg-ivory text-charcoal"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ScrollProgress />
          <LenisProvider>{children}</LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
