// Load fonts with Next.js
import { Inter, Playfair_Display } from "next/font/google";

// Define the fonts
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});
