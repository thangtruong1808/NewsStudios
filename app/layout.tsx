import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewsStudios",
  description: "A modern news management platform built with Next.js",
  openGraph: {
    title: 'NewsStudios',
    description: 'A modern news management platform built with Next.js',
    images: [
      {
        url: '/NewsStudios-Thumbnail-Image.png',
        width: 1200,
        height: 630,
        alt: 'NewsStudios Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsStudios',
    description: 'A modern news management platform built with Next.js',
    images: ['/NewsStudios-Thumbnail-Image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
