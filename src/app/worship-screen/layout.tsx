import type { Metadata, Viewport } from "next";
import { ethiopicFontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Worship Display",
  description: "Church worship and prayer slide display for TV and projector.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function WorshipScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="am" dir="ltr" className={`${ethiopicFontVariables} h-full`}>
      <body className="h-full overflow-hidden bg-black antialiased">{children}</body>
    </html>
  );
}
