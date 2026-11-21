import { Cormorant_Garamond, Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";

// Japanese glyphs are served through unicode-range slices; only Latin is preloaded.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const shippori = Shippori_Mincho_B1({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
});

export const zen = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-zen",
  display: "swap",
  preload: false,
});

export const fontVars = `${cormorant.variable} ${shippori.variable} ${zen.variable}`;
