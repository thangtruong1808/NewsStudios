import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Articles | NewsStudios",
  description: "Manage and view all articles in the NewsStudios dashboard.",
  keywords: "dashboard, articles, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Articles | NewsStudios",
    description: "Manage and view all articles in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 