import type { Metadata } from "next";
import { siteFontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Kidane Miheret",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`admin ${siteFontVariables} h-full`}>
      <body
        className="admin-body min-h-full antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
