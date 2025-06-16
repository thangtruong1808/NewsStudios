import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Videos | NewsStudios",
  description: "Manage and view all videos in the NewsStudios dashboard.",
  keywords: "dashboard, videos, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Videos | NewsStudios",
    description: "Manage and view all videos in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardVideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 