import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_Ethiopic,
  Noto_Serif_Ethiopic,
} from "next/font/google";

export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const notoSerifEthiopic = Noto_Serif_Ethiopic({
  variable: "--font-noto-serif-ethiopic",
  subsets: ["ethiopic", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const siteFontVariables = `${cormorant.variable} ${inter.variable} ${notoSansEthiopic.variable} ${notoSerifEthiopic.variable}`;

export const ethiopicFontVariables = `${notoSansEthiopic.variable} ${notoSerifEthiopic.variable}`;
