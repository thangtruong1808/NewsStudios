import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// Component Info
// Description: Root layout establishing global typography and mounting shared providers.
// Data created: Registers Inter font for site-wide usage and wraps page content.
// Author: thangtruong

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
