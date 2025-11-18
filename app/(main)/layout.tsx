import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import TopButton from "../components/front-end/shared/TopButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://news-studios.vercel.app"),
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
// Description: Main site layout providing shared navigation, content frame, footer, and top button.
// Date created: 2024-12-19
// Author: thangtruong

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavBar />
      <div className="mx-auto w-full max-w-[1536px] flex-1 px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        <main className="w-full">{children}</main>
      </div>
      <Footer />
      {/* <TopButton /> */}
    </div>
  );
}
