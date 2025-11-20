import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Metadata } from "next";

// Component Info
// Description: Root layout establishing global typography and mounting shared providers.
// Date updated: 2025-November-21
// Author: thangtruong

// Poppins for headings - modern, clean, and highly readable
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

// Open Sans for body text - excellent readability and user-friendly
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
});

// Root metadata with metadataBase for resolving social images
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${openSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
