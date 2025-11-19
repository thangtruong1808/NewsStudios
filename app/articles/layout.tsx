import { Metadata } from "next";
import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
  title: "Articles | NewsStudios",
  description:
    "Discover and explore a comprehensive collection of articles, news, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights.",
  keywords: ["articles", "news", "content", "blog", "tags"],
  authors: [{ name: "thang-truong" }],
  openGraph: {
    title: "Articles | NewsStudios",
    description:
      "Discover and explore a comprehensive collection of articles, news, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights.",
    url: "https://news-studios.vercel.app/articles",
    type: "website",
    siteName: "NewsStudios",
    images: [
      {
        url: "https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png",
        width: 400,
        height: 209,
        alt: "NewsStudios Articles Platform",
      },
    ],
  },
  other: {
    "fb:app_id": "692383700367966",
    author: "thang-truong",
    "article:author": "thang-truong",
    published_time: new Date().toISOString(),
    "article:published_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | NewsStudios",
    description:
      "Discover and explore a comprehensive collection of articles, news, and multimedia content. Browse through curated content from various categories and tags, and stay updated with the latest news and insights.",
    images: ["https://news-studios.vercel.app/NewsStudios-Thumbnail-Image.png"],
  },
};

// Component Info
// Description: Server layout assembling global navigation, content, and footer for articles pages with modern background styling.
// Date created: 2025-01-27
// Author: thangtruong

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    </div>
  );
}

