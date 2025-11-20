import { Metadata } from "next";
import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
  title: "Home | NewsStudios",
  description:
    "Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.",
  keywords: ["dashboard", "content management", "CMS", "admin panel"],
  authors: [{ name: "thang-truong" }],
  openGraph: {
    title: "Home | NewsStudios",
    description:
      "Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.",
    url: "https://news-studios.vercel.app",
    type: "website",
    siteName: "NewsStudios",
    images: [
      {
        url: "https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png",
        width: 400,
        height: 209,
        alt: "NewsStudios Platform",
      },
    ],
  },
  other: {
    appId: "692383700367966",
    "article:author": "thang-truong",
    "article:published_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | NewsStudios",
    description:
      "Discover and explore a comprehensive collection of articles, videos, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights from our extensive library.",
    images: ["https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png"],
  },
};

// Component Info
// Description: Main site layout providing shared navigation, content frame, footer with modern background styling.
// Date updated: 2025-November-21
// Author: thangtruong

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Navigation bar */}
      <NavBar />
      {/* Main content wrapper */}
      <div className="mx-auto w-full max-w-[1536px] flex-1 px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        <main className="w-full">{children}</main>
      </div>
      {/* Footer */}
      <Footer />
      {/* Vercel Analytics - tracks page views and user interactions */}
      <Analytics />
    </div>
  );
}
