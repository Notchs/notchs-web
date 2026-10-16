import { JetBrains_Mono } from "next/font/google";

/** Mono is only for proof data: Notch numbers, codes and times. */
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: "500",
});
