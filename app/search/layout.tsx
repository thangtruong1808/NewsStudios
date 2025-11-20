import { Metadata } from "next";
import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://news-studios.vercel.app"),
  title: "Search Articles | NewsStudios",
  description: "Search and filter articles by title, categories, and subcategories.",
};

// Component Info
// Description: Server layout assembling global navigation, content, and footer for search pages with modern background styling.
// Date updated: 2025-November-21
// Author: thangtruong

export default function SearchLayout({
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

