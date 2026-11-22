import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Next.js 16 blocks dev assets across hostnames (localhost vs 127.0.0.1)
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  headers: async () => [
    {
      source: "/pdf.worker.min.mjs",
      headers: [{ key: "Content-Type", value: "text/javascript; charset=utf-8" }],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
