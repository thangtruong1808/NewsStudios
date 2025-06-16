import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewsStudios | Latest News, Articles, and Videos",
  description: "Stay informed with NewsStudios - Your trusted source for the latest news, in-depth articles, and engaging videos across various categories.",
  keywords: "news, articles, videos, latest news, current events, trending topics",
  authors: [{
    name: "Thang Truong"
  }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "NewsStudios | Latest News, Articles, and Videos",
    description: "Stay informed with NewsStudios - Your trusted source for the latest news, in-depth articles, and engaging videos across various categories.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios"
  }
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
